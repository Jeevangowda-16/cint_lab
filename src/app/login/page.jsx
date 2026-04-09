"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-md mx-auto bg-white border border-gray-300 rounded p-8">
        <h1 className="text-3xl font-semibold text-gray-900">Admin Access</h1>
        <p className="mt-2 text-sm text-gray-700">
          This project runs in local mode. Authentication is disabled and the admin panel is available directly.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-flex bg-blue-700 text-white py-2 px-4 rounded border border-blue-800 font-semibold hover:bg-blue-800"
        >
          Go to Admin Panel
        </Link>
      </div>
    </main>
  );
}
