import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { user, verification } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Supprimer l'email en attente et les tokens de vérification associés
    await db.transaction(async (tx) => {
      // Mettre à jour l'utilisateur pour supprimer l'email en attente
      await tx
        .update(user)
        .set({ pendingEmail: null })
        .where(eq(user.id, userId));

      // Supprimer tous les tokens de vérification d'email pour cet utilisateur
      await tx
        .delete(verification)
        .where(eq(verification.identifier, `email-change-${userId}`));
    });

    return NextResponse.json({
      success: true,
      message: "Email change cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel email change error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}