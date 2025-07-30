import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { withAuth } from "@/lib/middleware/validation";
import type { Session, User } from "better-auth/types";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

// Types de fichiers autorisés
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// POST - Upload d'avatar
export const POST = withAuth(async (request: NextRequest, session: Session, currentUser: User) => {
  try {
    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validation du type de fichier
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validation de la taille
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size too large. Maximum 5MB allowed." },
        { status: 400 }
      );
    }

    // Créer le dossier avatars s'il n'existe pas
    const avatarsDir = join(process.cwd(), 'public', 'avatars');
    try {
      await mkdir(avatarsDir, { recursive: true });
    } catch {
      // Le dossier existe déjà, on continue
    }

    // Générer le nom de fichier
    const fileExtension = file.type.split('/')[1];
    const fileName = `user-${currentUser.id}.${fileExtension}`;
    const filePath = join(avatarsDir, fileName);

    // Convertir le fichier en buffer et l'écrire
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // URL publique de l'avatar
    const avatarUrl = `/avatars/${fileName}`;

    // Mettre à jour la base de données
    const [updatedUser] = await db
      .update(user)
      .set({
        image: avatarUrl,
        updatedAt: new Date(),
      })
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
        { error: "Failed to update user avatar" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Avatar updated successfully",
        user: updatedUser,
        avatarUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 }
    );
  }
});

// DELETE - Supprimer l'avatar
export const DELETE = withAuth(async (request: NextRequest, session: Session, currentUser: User) => {
  try {
    // Mettre à jour la base de données pour supprimer l'image
    const [updatedUser] = await db
      .update(user)
      .set({
        image: null,
        updatedAt: new Date(),
      })
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
        { error: "Failed to remove user avatar" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Avatar removed successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Avatar removal error:", error);
    return NextResponse.json(
      { error: "Failed to remove avatar" },
      { status: 500 }
    );
  }
});