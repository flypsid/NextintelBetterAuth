import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { account } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Récupérer les comptes liés à l'utilisateur
    const userAccounts = await db
      .select({
        providerId: account.providerId,
        accountId: account.accountId,
      })
      .from(account)
      .where(eq(account.userId, session.user.id));

    // Vérifier si l'utilisateur a des comptes sociaux
    const hasSocialAuth = userAccounts.some(
      (acc) => acc.providerId === "google" || acc.providerId === "discord"
    );

    return NextResponse.json({
      accounts: userAccounts,
      hasSocialAuth,
    });
  } catch (error) {
    console.error("Error fetching user accounts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}