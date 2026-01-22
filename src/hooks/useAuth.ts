"use client";

import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const isAuthenticated = !!session;

  const signOut = async () => {
    await nextAuthSignOut({ redirect: false });
  };

  return {
    user: session?.user || null,
    role: session?.user?.role || null,
    isAuthenticated,
    loading,
    signOut,
  };
}
