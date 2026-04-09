"use client";

import { createContext, useContext, useMemo } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const contextValue = useMemo(() => {
    const logout = async () => {};

    return {
      user: {
        uid: "local-admin",
        email: "admin@local",
        displayName: "Local Admin",
      },
      isAdmin: true,
      claims: { admin: true },
      loading: false,
      isAuthAvailable: false,
      logout,
    };
  }, []);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contextValue = useContext(AuthContext);

  if (!contextValue) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return contextValue;
}
