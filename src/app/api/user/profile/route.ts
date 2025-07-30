import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withValidationAndAuth, withAuth } from "@/lib/middleware/validation";
import type { Session, User } from "better-auth/types";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

// Schéma pour la mise à jour du profil
const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  image: z.string().url("Invalid image URL").optional().nullable(),
});

// GET - Récupérer le profil utilisateur
export const GET = withAuth(async (request: NextRequest, session: Session, user: User) => {
  try {
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
});

// PUT - Mettre à jour le profil utilisateur
export const PUT = withValidationAndAuth(
  updateProfileSchema,
  async (request: NextRequest, validatedData, session: Session, currentUser: User) => {
    try {
      // Préparer les données à mettre à jour
      const updateData: Partial<typeof user.$inferInsert> = {
        updatedAt: new Date(),
      };

      if (validatedData.name !== undefined) {
        updateData.name = validatedData.name;
      }
      if (validatedData.image !== undefined) {
        updateData.image = validatedData.image;
      }

      // Mettre à jour la base de données
      const [updatedUser] = await db
        .update(user)
        .set(updateData)
        .where(eq(user.id, currentUser.id))
        .returning({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });

      if (!updatedUser) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        {
          success: true,
          message: "Profile updated successfully",
          user: updatedUser,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Update profile error:", error);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }
  }
);