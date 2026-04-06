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
    <main className="min-h-screen bg-gray-50 px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Signed in as {user?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="bg-gray-900 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Sign out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold text-blue-700">{section.label}</h2>
              <p className="text-gray-600 mt-2 text-sm">{section.note}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
