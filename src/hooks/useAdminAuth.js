"use client";

import { useAuth } from "@/lib/authContext";

export function useAdminAuth() {
  const { user, isAdmin, claims, loading, isAuthAvailable, login, logout } = useAuth();

  return {
    user,
    claims,
    isAdmin,
    loading,
    isAuthenticated: Boolean(user),
    isAuthAvailable,
    login,
    logout,
  };
}
