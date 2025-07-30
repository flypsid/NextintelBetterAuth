import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

interface ServerProtectedRouteProps {
  children: React.ReactNode;
  locale?: string;
  redirectTo?: string;
}

/**
 * Server-side route protection component that validates session on the server.
 * This provides an additional layer of security beyond middleware checks.
 * 
 * According to Better Auth documentation:
 * - Middleware should only do optimistic checks for performance
 * - Server components should validate sessions for protected content
 * - This prevents bypassing protection by manually creating cookies
 */
export async function ServerProtectedRoute({
  children,
  locale = "en",
  redirectTo,
}: ServerProtectedRouteProps) {
  // Validate session on server - this is the recommended approach
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect if no valid session found
  if (!session) {
    const defaultRedirect = locale === "fr" ? "/fr/connexion" : "/en/login";
    redirect(redirectTo || defaultRedirect);
  }

  // Return children if session is valid
  return <>{children}</>;
}