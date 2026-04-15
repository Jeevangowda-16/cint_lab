"use client";

import Link from "next/link";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const adminSections = [
  { href: "/admin/projects", label: "Manage Projects", note: "Create, update, and archive projects." },
  { href: "/admin/people", label: "Manage People", note: "Update team members and intern profiles." },
  { href: "/admin/events", label: "Manage Events", note: "Publish seminars and latest events." },
];

export default function AdminHomePage() {
  const { user, logout } = useAdminAuth();

  return (
    <main className="page-shell text-gray-800">
      <div className="section-shell space-y-8">
        <Card className="glass-card relative overflow-hidden rounded p-6 md:p-10">
          <div className="absolute -top-16 -right-10 h-52 w-52 hero-glow-blue" />
          <div className="absolute -bottom-14 -left-10 h-40 w-40 hero-glow-gold" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-gray-600">Control Center</p>
              <h1 className="section-title mt-2">Admin Dashboard</h1>
              <p className="text-gray-700 mt-3">Signed in as {user?.email}</p>
            </div>
            <Button
              type="button"
              onClick={logout}
              variant="default"
              className="bg-gray-900 hover:bg-gray-800"
            >
              Sign out
            </Button>
          </div>
        </Card>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {adminSections.map((section) => (
            <Link key={section.href} href={section.href}>
              <Card className="paper-card rounded p-6 h-full transition hover:shadow-md">
                <CardHeader className="p-0">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-xl text-gray-900">{section.label}</CardTitle>
                    <span className="text-lg text-gray-500">&rarr;</span>
                  </div>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <p className="text-sm text-gray-700">{section.note}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
