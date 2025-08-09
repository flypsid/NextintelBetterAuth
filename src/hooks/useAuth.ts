"use client";

import { authClient } from "@/lib/auth-client";

// Infer types from Better Auth
type Session = typeof authClient.$Infer.Session;
type BaseUser = Session['user'];

// Extend User type to include pendingEmail
type User = BaseUser & {
  pendingEmail?: string | null;
};

interface AuthState {
  user: User | null;
  session: Session["session"] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
}

export function useAuth(): AuthState {
  // Use Better Auth's native useSession hook
  const { data: session, isPending, refetch } = authClient.useSession();

  const refreshSession = async () => {
    await refetch();
  };

  return {
    user: session?.user || null,
    session: session?.session || null,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    refreshSession,
  };
}
