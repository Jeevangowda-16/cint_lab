"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading, isFirebaseAuthAvailable } = useAdminAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isFirebaseAuthAvailable) {
      router.replace("/login");
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isAdmin) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, isAdmin, isFirebaseAuthAvailable, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-8 py-16">
        <p className="text-gray-700">Verifying admin access...</p>
      </main>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
