"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function GodmodePage() {
  const router = useRouter();
  const { login, isAdmin, loading } = useAdminAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAdmin) {
      router.replace("/admin");
    }
  }, [isAdmin, loading, router]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await login(form.email, form.password);

    if (result.success) {
      router.replace("/admin");
      return;
    }

    setError(result.message || "Login failed.");
    setSubmitting(false);
  };

  if (loading) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <Card className="max-w-md mx-auto bg-white border border-gray-300 rounded p-8">
        <h1 className="text-3xl font-semibold text-gray-900">Admin Access</h1>
        <p className="mt-2 text-sm text-gray-700">Sign in to continue.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700" htmlFor="email">User ID</label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="mt-2 h-10"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              className="mt-2 h-10"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full h-10" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
