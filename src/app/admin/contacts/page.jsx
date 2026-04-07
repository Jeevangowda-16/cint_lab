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
    <main className="page-shell text-slate-800">
      <div className="section-shell">
        <section className="glass-card rounded-3xl p-6 md:p-8 mb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Admin Review</p>
          <h1 className="text-3xl md:text-4xl text-slate-900 mt-2">Contacts</h1>
          <p className="text-slate-600 mt-2">Track contact requests and mark progress until resolved.</p>
        </section>

        {loading && <p className="text-slate-600">Loading contacts...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {feedback && (
          <p className="mb-4 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700">
            {feedback}
          </p>
        )}

        <section className="space-y-4">
          {contacts.map((contact) => (
            <article key={contact.id} className="paper-card rounded-2xl p-5 md:p-6">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-2xl text-slate-900">{contact.fullName}</h2>
                  <p className="text-sm text-slate-600 mt-1">{contact.email} • {contact.subject}</p>
                </div>
                <span className="chip">{String(contact.status || "new").replaceAll("_", " ")}</span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-700">{contact.message}</p>

              <div className="mt-4 flex flex-wrap gap-2 items-center">
                {contact.status !== "resolved" && (
                  <button
                    type="button"
                    onClick={() => setStatus(contact.id, "in_progress")}
                    disabled={actionLoading.startsWith(`${contact.id}:`)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:opacity-50"
                  >
                    Mark in progress
                  </button>
                )}
                {contact.status !== "resolved" && (
                  <button
                    type="button"
                    onClick={() => setStatus(contact.id, "resolved")}
                    disabled={actionLoading.startsWith(`${contact.id}:`)}
                    className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
                  >
                    Resolve
                  </button>
                )}
                {actionLoading.startsWith(`${contact.id}:`) && <span className="text-xs text-slate-500">Updating...</span>}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
