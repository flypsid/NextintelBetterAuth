import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withValidationAndAuth } from "@/lib/middleware/validation";
import {
  sendPasswordChangeNotification,
  getLocaleFromRequest,
} from "@/lib/email";
import { auth } from "@/lib/auth";

// Schéma pour le changement de mot de passe
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

// POST - Changer le mot de passe
export const POST = withValidationAndAuth(
  changePasswordSchema,
  async (request: NextRequest, validatedData) => {
    try {
      const { currentPassword, newPassword } = validatedData;

      // Changer le mot de passe avec Better Auth
      const result = await auth.api.changePassword({
        headers: request.headers,
        body: {
          newPassword,
          currentPassword,
          revokeOtherSessions: false,
        },
      });

      if (!result) {
        return NextResponse.json(
          { error: "Failed to change password" },
          { status: 400 }
        );
      }

      // Envoyer une notification par email du changement de mot de passe
      try {
        const locale = getLocaleFromRequest(request);
        await sendPasswordChangeNotification({
          to: result.user.email,
          userName: result.user.name || result.user.email.split("@")[0],
          locale: locale as "en" | "fr",
        });
        console.log(
          "Password change notification sent successfully to:",
          result.user.email
        );
      } catch (emailError) {
        // Ne pas faire échouer la requête si l'email ne peut pas être envoyé
        console.error(
          "Failed to send password change notification:",
          emailError
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Password changed successfully",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Password change error:", error);

      // Gérer les erreurs spécifiques de Better Auth
      if (error instanceof Error) {
        if (error.message.includes("Invalid password")) {
          return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { error: "Failed to change password" },
        { status: 500 }
      );
    }
  }
);
