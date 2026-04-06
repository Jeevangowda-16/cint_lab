"use client";

import { useAuth } from "@/lib/authContext";

export function useAdminAuth() {
  const { user, isAdmin, claims, loading, isFirebaseAuthAvailable, logout } = useAuth();

  return {
    user,
    claims,
    isAdmin,
    loading,
    isAuthenticated: Boolean(user),
    isFirebaseAuthAvailable,
    logout,
  };
}
