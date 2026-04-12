"use client";

import Link from "next/link";
import { useAdminAuth } from "@/hooks/useAdminAuth";

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
        <section className="glass-card relative overflow-hidden rounded p-6 md:p-10">
          <div className="absolute -top-16 -right-10 h-52 w-52 hero-glow-blue" />
          <div className="absolute -bottom-14 -left-10 h-40 w-40 hero-glow-gold" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-gray-600">Control Center</p>
              <h1 className="section-title mt-2">Admin Dashboard</h1>
              <p className="text-gray-700 mt-3">Signed in as {user?.email}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded border border-gray-800 bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Sign out
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="paper-card rounded p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl text-gray-900">{section.label}</h2>
                <span className="text-lg text-gray-500">&rarr;</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{section.note}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
