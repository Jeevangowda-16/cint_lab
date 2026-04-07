"use client";

import { useCallback, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getApplications, updateApplication } from "@/services/applicationService";
import { auth } from "@/lib/firebase";

export default function AdminApplicationsPage() {
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const fetchApplications = useCallback(() => getApplications(), []);
  const { data, loading, error, refresh } = useAsyncData(fetchApplications);
  const applications = data || [];
  const visibleApplications = applications.filter((application) => application.status !== "rejected");

  const setStatus = async (applicationId, status) => {
    setFeedback("");
    setActionLoading(`${applicationId}:${status}`);

    try {
      // Force token refresh so newly granted admin claim is reflected immediately.
      if (auth?.currentUser) {
        await auth.currentUser.getIdToken(true);
      }

      await updateApplication(applicationId, { status });
      setFeedback(`Application status updated to ${status}.`);
      await refresh();
    } catch (updateError) {
      setFeedback(updateError instanceof Error ? updateError.message : "Failed to update application status.");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <main className="page-shell text-slate-800">
      <div className="section-shell">
        <section className="glass-card rounded-3xl p-6 md:p-8 mb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Admin Review</p>
          <h1 className="text-3xl md:text-4xl text-slate-900 mt-2">Applications</h1>
          <p className="text-slate-600 mt-2">Review incoming internship applications and update status quickly.</p>
        </section>

        {loading && <p className="text-slate-600">Loading applications...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {feedback && (
          <p className="mb-4 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700">
            {feedback}
          </p>
        )}

        <section className="space-y-4">
          {visibleApplications.map((application) => (
            <article key={application.id} className="paper-card rounded-2xl p-5 md:p-6">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-2xl text-slate-900">{application.fullName}</h2>
                  <p className="mt-1 text-sm text-slate-600">{application.email} • {application.institution}</p>
                </div>
                <span className="chip">{String(application.status || "new").replaceAll("_", " ")}</span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-700">{application.statement}</p>

              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <button
                  type="button"
                  onClick={() => setStatus(application.id, "under_review")}
                  disabled={actionLoading.startsWith(`${application.id}:`)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:opacity-50"
                >
                  Mark under review
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(application.id, "accepted")}
                  disabled={actionLoading.startsWith(`${application.id}:`)}
                  className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(application.id, "rejected")}
                  disabled={actionLoading.startsWith(`${application.id}:`)}
                  className="rounded-lg bg-rose-700 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:opacity-50"
                >
                  Reject
                </button>
                {actionLoading.startsWith(`${application.id}:`) && (
                  <span className="text-xs text-slate-500">Updating...</span>
                )}
              </div>
            </article>
          ))}
          {!loading && !error && visibleApplications.length === 0 && (
            <p className="text-sm text-slate-600">No active applications to review.</p>
          )}
        </section>
      </div>
    </main>
  );
}
