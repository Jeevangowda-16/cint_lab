"use client";

import { useAuth } from "@/lib/authContext";

export function useAdminAuth() {
  const { user, isAdmin, claims, loading, isAuthAvailable, logout } = useAuth();

  return {
    user,
    claims,
    isAdmin,
    loading,
    isAuthenticated: Boolean(user),
    isAuthAvailable,
    logout,
  };
}
