"use client";

import Link from "next/link";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const adminSections = [
  { href: "/admin/projects", label: "Manage Projects", note: "Create, update, and archive projects." },
  { href: "/admin/people", label: "Manage People", note: "Update team members and intern profiles." },
  { href: "/admin/events", label: "Manage Events", note: "Publish seminars and latest events." },
  { href: "/admin/applications", label: "Review Applications", note: "Screen internship applications." },
  { href: "/admin/contacts", label: "Review Contacts", note: "Handle contact form submissions." },
];

export default function AdminHomePage() {
  const { user, logout } = useAdminAuth();

  return (
    <main className="page-shell text-slate-800">
      <div className="section-shell space-y-8">
        <section className="glass-card relative overflow-hidden rounded-3xl p-6 md:p-10">
          <div className="absolute -top-16 -right-10 h-52 w-52 hero-glow-blue" />
          <div className="absolute -bottom-14 -left-10 h-40 w-40 hero-glow-gold" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Control Center</p>
              <h1 className="section-title mt-2">Admin Dashboard</h1>
              <p className="text-slate-600 mt-3">Signed in as {user?.email}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
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
              className="paper-card rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl text-slate-900">{section.label}</h2>
                <span className="text-lg text-slate-400">&rarr;</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{section.note}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
