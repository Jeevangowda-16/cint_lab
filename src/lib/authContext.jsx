"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").trim().toLowerCase();
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      window.localStorage.removeItem("cint-admin-auth");
    } catch {
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return {
        success: false,
        message: "Admin credentials are not configured.",
      };
    }

    const normalizedEmail = (email || "").trim().toLowerCase();

    if (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const nextUser = {
        uid: "local-admin",
        email: ADMIN_EMAIL,
        displayName: "Local Admin",
      };

      setUser(nextUser);
      return { success: true };
    }

    return {
      success: false,
      message: "Invalid user ID or password.",
    };
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
  }, []);

  const contextValue = useMemo(() => {
    const isConfigured = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD);

    return {
      user,
      isAdmin: Boolean(user) && isConfigured,
      claims: { admin: Boolean(user) && isConfigured },
      loading,
      isAuthAvailable: isConfigured,
      login,
      logout,
    };
  }, [user, loading, login, logout]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contextValue = useContext(AuthContext);

  if (!contextValue) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return contextValue;
}
