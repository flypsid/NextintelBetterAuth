"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface UserAccount {
  providerId: string;
  accountId: string;
}

interface SocialAuthState {
  hasSocialAuth: boolean;
  accounts: UserAccount[];
  isLoading: boolean;
  error: string | null;
}

export function useSocialAuth(): SocialAuthState {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<SocialAuthState>({
    hasSocialAuth: false,
    accounts: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setState({
        hasSocialAuth: false,
        accounts: [],
        isLoading: false,
        error: null,
      });
      return;
    }

    const fetchUserAccounts = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const response = await fetch("/api/user/accounts");
        
        if (!response.ok) {
          throw new Error("Failed to fetch user accounts");
        }
        
        const data = await response.json();
        
        setState({
          hasSocialAuth: data.hasSocialAuth,
          accounts: data.accounts,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching user accounts:", error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    };

    fetchUserAccounts();
  }, [isAuthenticated, user]);

  return state;
}