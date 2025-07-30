import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withValidationAndAuth } from "@/lib/middleware/validation";
import type { Session, User } from "better-auth/types";
import { db } from "@/db/drizzle";
import { user, verification } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  sendEmailChangeVerification,
  sendEmailChangeNotification,
  getLocaleFromRequest,
} from "@/lib/email";
import { nanoid } from "nanoid";

// Schéma pour la demande de changement d'email
const changeEmailSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
  currentPassword: z.string().min(1, "Current password is required"),
});

// POST - Demander un changement d'email
export const POST = withValidationAndAuth(
  changeEmailSchema,
  async (
    request: NextRequest,
    validatedData,
    session: Session,
    currentUser: User
  ) => {
    try {
      const { newEmail } = validatedData;

      // Vérifier que le nouvel email est différent de l'actuel
      if (newEmail === currentUser.email) {
        return NextResponse.json(
          { error: "New email must be different from current email" },
          { status: 400 }
        );
      }

      // Vérifier que le nouvel email n'est pas déjà utilisé
      const existingUser = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, newEmail))
        .limit(1);

      if (existingUser.length > 0) {
        return NextResponse.json(
          { error: "Email address is already in use" },
          { status: 400 }
        );
      }

      // TODO: Vérifier le mot de passe actuel
      // Note: Better Auth ne fournit pas directement de méthode pour vérifier le mot de passe
      // Cette fonctionnalité devra être implémentée selon la configuration Better Auth

      // Générer un token de vérification
      const token = nanoid(32);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

      // Stocker le token de vérification
      await db.insert(verification).values({
        id: nanoid(),
        identifier: `email-change-${currentUser.id}`,
        value: token,
        expiresAt,
      });

      // Stocker temporairement le nouvel email
      await db
        .update(user)
        .set({
          pendingEmail: newEmail,
          updatedAt: new Date(),
        })
        .where(eq(user.id, currentUser.id));

      // Envoyer l'email de vérification
      const locale = getLocaleFromRequest(request);
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/${locale}/verify-email-change?token=${token}`;

      await sendEmailChangeVerification({
        to: newEmail,
        userName: currentUser.name || currentUser.email.split("@")[0],
        newEmail,
        verificationUrl,
        locale: locale as "en" | "fr",
      });

      // Envoyer une notification à l'ancien email
      await sendEmailChangeNotification({
        to: currentUser.email,
        userName: currentUser.name || currentUser.email.split("@")[0],
        newEmail,
        locale: locale as "en" | "fr",
      });

      return NextResponse.json(
        {
          success: true,
          message:
            "Email change verification sent. Please check your new email address.",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Email change request error:", error);
      return NextResponse.json(
        { error: "Failed to process email change request" },
        { status: 500 }
      );
    }
  }
);
