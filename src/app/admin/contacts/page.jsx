"use client";

import { useCallback, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getContacts, updateContact } from "@/services/contactService";

export default function AdminContactsPage() {
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const fetchContacts = useCallback(() => getContacts(), []);
  const { data, loading, error, refresh } = useAsyncData(fetchContacts);
  const contacts = data || [];

  const setStatus = async (contactId, status) => {
    setFeedback("");
    setActionLoading(`${contactId}:${status}`);

    try {
      await updateContact(contactId, { status });
      setFeedback(`Contact status updated to ${status}.`);
      await refresh();
    } catch (updateError) {
      setFeedback(updateError instanceof Error ? updateError.message : "Failed to update contact status.");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <main className="page-shell text-gray-800">
      <div className="section-shell">
        <section className="glass-card rounded p-6 md:p-8 mb-6">
          <p className="text-xs uppercase tracking-[0.12em] text-gray-600">Admin Review</p>
          <h1 className="text-3xl md:text-4xl text-gray-900 mt-2">Contacts</h1>
          <p className="text-gray-700 mt-2">Track contact requests and mark progress until resolved.</p>
        </section>

        {loading && <p className="text-gray-600">Loading contacts...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {feedback && (
          <p className="mb-4 rounded border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700">
            {feedback}
          </p>
        )}

        <section className="space-y-4">
          {contacts.map((contact) => (
            <article key={contact.id} className="paper-card rounded p-5 md:p-6">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-2xl text-gray-900">{contact.fullName}</h2>
                  <p className="text-sm text-gray-700 mt-1">{contact.email} • {contact.subject}</p>
                </div>
                <span className="chip">{String(contact.status || "new").replaceAll("_", " ")}</span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-gray-700">{contact.message}</p>

              <div className="mt-4 flex flex-wrap gap-2 items-center">
                {contact.status !== "resolved" && (
                  <button
                    type="button"
                    onClick={() => setStatus(contact.id, "in_progress")}
                    disabled={actionLoading.startsWith(`${contact.id}:`)}
                    className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Mark in progress
                  </button>
                )}
                {contact.status !== "resolved" && (
                  <button
                    type="button"
                    onClick={() => setStatus(contact.id, "resolved")}
                    disabled={actionLoading.startsWith(`${contact.id}:`)}
                    className="rounded bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                  >
                    Resolve
                  </button>
                )}
                {actionLoading.startsWith(`${contact.id}:`) && <span className="text-xs text-gray-600">Updating...</span>}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
