import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Handle auth routes first
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Get session for protected routes
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/tableau-de-bord"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.includes(route)
  );

  // Public routes that should be accessible without authentication
  const publicRoutes = ["/", "/fr", "/en"];
  const isPublicRoute = publicRoutes.some((route) => {
    const pathname = request.nextUrl.pathname;
    return pathname === route || pathname === `${route}/`;
  });

  const authRoutes = [
    "/login",
    "/connexion",
    "/register",
    "/inscription",
    "/forgot-password",
    "/mot-de-passe-oublie",
    "/email-sent",
    "/reset-password",
    "/verify-email",
  ];
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.includes(route)
  );

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const locale = request.nextUrl.pathname.split("/")[1];
    const loginPath = locale === "fr" ? "/fr/connexion" : "/en/login";
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  // Allow access to public routes without authentication
  if (isPublicRoute) {
    return intlMiddleware(request);
  }

  // Special handling for verify-email route - allow it to process even with active session
  const isVerifyEmailRoute = request.nextUrl.pathname.includes("/verify-email");

  // Redirect to dashboard if accessing auth route with active session (except verify-email)
  if (isAuthRoute && session && !isVerifyEmailRoute) {
    const locale = request.nextUrl.pathname.split("/")[1];
    const dashboardPath =
      locale === "fr" ? "/fr/tableau-de-bord" : "/en/dashboard";
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
