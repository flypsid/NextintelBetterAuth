import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Session, User } from "better-auth/types";

/**
 * Middleware de validation pour les API routes
 * Valide le body de la requête avec un schéma Zod
 */
export function withValidation<T extends z.ZodSchema>(
  schema: T,
  handler: (request: NextRequest, validatedData: z.infer<T>) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json();
      const validatedData = schema.parse(body);
      return await handler(request, validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
          { status: 400 }
        );
      }

      console.error("Validation middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware d'authentification pour les API routes protégées
 */
export function withAuth(
  handler: (request: NextRequest, session: Session, user: User) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      const { auth } = await import("@/lib/auth");
      
      const sessionData = await auth.api.getSession({
        headers: request.headers,
      });

      if (!sessionData) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      return await handler(request, sessionData.session, sessionData.user);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

/**
 * Combine validation et authentification
 */
export function withValidationAndAuth<T extends z.ZodSchema>(
  schema: T,
  handler: (
    request: NextRequest,
    validatedData: z.infer<T>,
    session: Session,
    user: User
  ) => Promise<NextResponse>
) {
  return withAuth(async (request, session, user) => {
    try {
      const body = await request.json();
      const validatedData = schema.parse(body);
      return await handler(request, validatedData, session, user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
          { status: 400 }
        );
      }

      throw error;
    }
  });
}