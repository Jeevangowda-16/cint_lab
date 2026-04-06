"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [claims, setClaims] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setIsAdmin(false);
        setClaims({});
        setLoading(false);
        return;
      }

      try {
        const idTokenResult = await currentUser.getIdTokenResult(true);
        const nextClaims = idTokenResult.claims || {};

        setUser(currentUser);
        setClaims(nextClaims);
        setIsAdmin(Boolean(nextClaims.admin));
      } catch (error) {
        console.error("Failed to read auth claims", error);
        setUser(currentUser);
        setClaims({});
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    if (!auth) {
      return;
    }

    await signOut(auth);
  };

  const contextValue = useMemo(
    () => ({
      user,
      isAdmin,
      claims,
      loading,
      isFirebaseAuthAvailable: Boolean(auth),
      logout,
    }),
    [user, isAdmin, claims, loading]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contextValue = useContext(AuthContext);

  if (!contextValue) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return contextValue;
}
