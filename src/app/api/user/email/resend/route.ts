import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { user, verification } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendEmailChangeVerification, getLocaleFromRequest } from "@/lib/email";
import { generateId } from "lucia";

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

    // Récupérer l'utilisateur avec son email en attente
    const [currentUser] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        pendingEmail: user.pendingEmail,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!currentUser.pendingEmail) {
      return NextResponse.json(
        { error: "No pending email change found" },
        { status: 400 }
      );
    }

    // Supprimer les anciens tokens de vérification
    await db
      .delete(verification)
      .where(eq(verification.identifier, userId));

    // Générer un nouveau token de vérification
    const token = generateId(32);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    // Stocker le token avec les informations nécessaires
    await db.insert(verification).values({
      id: generateId(15),
      identifier: `email-change-${userId}`,
      value: token,
      expiresAt,
    });

    // Envoyer l'email de vérification
    const locale = getLocaleFromRequest(request);
    await sendEmailChangeVerification({
      to: currentUser.pendingEmail,
      userName: currentUser.name || "User",
      newEmail: currentUser.pendingEmail,
      verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/verify-email-change?token=${token}`,
      locale,
    });

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}