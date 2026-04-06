"use client";

import { useCallback } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getContacts, updateContact } from "@/services/contactService";

export default function AdminContactsPage() {
  const fetchContacts = useCallback(() => getContacts(), []);
  const { data, loading, error, refresh } = useAsyncData(fetchContacts);
  const contacts = data || [];

  const setStatus = async (contactId, status) => {
    await updateContact(contactId, { status });
    await refresh();
  };

  return (
    <main className="min-h-screen bg-gray-50 px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin: Contacts</h1>

        {loading && <p className="text-gray-600">Loading contacts...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="space-y-4">
          {contacts.map((contact) => (
            <article key={contact.id} className="bg-white border border-gray-100 rounded-lg p-4">
              <h2 className="text-xl font-bold text-gray-900">{contact.fullName}</h2>
              <p className="text-sm text-gray-600 mt-1">{contact.email} • {contact.subject}</p>
              <p className="text-sm text-gray-700 mt-2">{contact.message}</p>
              <div className="mt-3 flex gap-3 items-center">
                <span className="text-sm text-gray-500">Status: {contact.status}</span>
                {contact.status !== "resolved" && (
                  <button type="button" onClick={() => setStatus(contact.id, "in_progress")} className="text-blue-700 font-semibold">Mark in progress</button>
                )}
                {contact.status !== "resolved" && (
                  <button type="button" onClick={() => setStatus(contact.id, "resolved")} className="text-green-700 font-semibold">Resolve</button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
