"use client";

import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading, isFirebaseAuthAvailable } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && isAuthenticated && isAdmin) {
      router.replace("/admin");
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!isFirebaseAuthAvailable || !auth) {
      setMessage("Firebase auth is not configured. Update your .env.local settings.");
      return;
    }

    if (!email || !password) {
      setMessage("Email and password are required.");
      return;
    }

    setSubmitting(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const tokenResult = await credential.user.getIdTokenResult(true);

      if (!tokenResult.claims.admin) {
        setMessage("This account is authenticated but does not have admin access.");
        return;
      }

      router.replace("/admin");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-md mx-auto bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
        <p className="mt-2 text-sm text-gray-600">Sign in with an account that has the admin custom claim.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full bg-gray-50 border border-gray-200 p-3 rounded-lg"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full bg-gray-50 border border-gray-200 p-3 rounded-lg"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>

          {message && <p className="text-sm text-red-600">{message}</p>}
        </form>
      </div>
    </main>
  );
}
