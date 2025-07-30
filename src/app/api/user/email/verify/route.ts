import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withValidation } from "@/lib/middleware/validation";
import { db } from "@/db/drizzle";
import { user, verification } from "@/db/schema";
import { eq } from "drizzle-orm";

// Schéma pour la vérification du changement d'email
const verifyEmailChangeSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

// POST - Vérifier le changement d'email
export const POST = withValidation(
  verifyEmailChangeSchema,
  async (request: NextRequest, validatedData) => {
    try {
      const { token } = validatedData;

      // Rechercher le token de vérification
      const verificationRecord = await db
        .select()
        .from(verification)
        .where(eq(verification.value, token))
        .limit(1);

      if (verificationRecord.length === 0) {
        return NextResponse.json(
          { error: "Invalid or expired verification token" },
          { status: 400 }
        );
      }

      const record = verificationRecord[0];

      // Vérifier l'expiration
      if (new Date() > record.expiresAt) {
        // Supprimer le token expiré
        await db.delete(verification).where(eq(verification.id, record.id));
        return NextResponse.json(
          { error: "Verification token has expired" },
          { status: 400 }
        );
      }

      // Extraire l'userId depuis l'identifier
      const identifierMatch = record.identifier.match(/^email-change-(.+)$/);
      if (!identifierMatch) {
        return NextResponse.json(
          { error: "Invalid token format" },
          { status: 400 }
        );
      }

      const userId = identifierMatch[1];

      // Vérifier que l'utilisateur existe
      const existingUser = await db
        .select()
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

      if (existingUser.length === 0) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const currentUser = existingUser[0];
      const newEmail = currentUser.pendingEmail;

      // Vérifier qu'il y a bien un email en attente
      if (!newEmail) {
        return NextResponse.json(
          { error: "No pending email change found" },
          { status: 400 }
        );
      }

      // Vérifier que le nouvel email n'est pas déjà utilisé par un autre utilisateur
      const emailInUse = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, newEmail))
        .limit(1);

      if (emailInUse.length > 0 && emailInUse[0].id !== userId) {
        return NextResponse.json(
          { error: "Email address is already in use" },
          { status: 400 }
        );
      }

      // Effectuer le changement d'email
      await db
        .update(user)
        .set({
          email: newEmail,
          pendingEmail: null,
          emailVerified: true, // Le nouvel email est considéré comme vérifié
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId));

      // Supprimer le token de vérification
      await db.delete(verification).where(eq(verification.id, record.id));

      return NextResponse.json(
        {
          success: true,
          message: "Email address updated successfully",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Email verification error:", error);
      return NextResponse.json(
        { error: "Failed to verify email change" },
        { status: 500 }
      );
    }
  }
);