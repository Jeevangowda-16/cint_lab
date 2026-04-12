"use client";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-md mx-auto bg-white border border-gray-300 rounded p-8">
        <h1 className="text-3xl font-semibold text-gray-900">Admin Access</h1>
        <p className="mt-2 text-sm text-gray-700">
          This project runs in local mode. To open the admin panel, enter the path manually in the address bar.
        </p>
        <p className="mt-4 rounded border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-800">/admin</p>
      </div>
    </main>
  );
}
