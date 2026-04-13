"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { isAdmin, loading, logout } = useAdminAuth();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/godmode");
    }
  }, [isAdmin, loading, router]);

  useEffect(() => {
    return () => {
      logout();
    };
  }, [logout]);

  if (loading || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
