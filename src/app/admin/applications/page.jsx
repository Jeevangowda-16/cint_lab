"use client";

import { useCallback, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getApplications, updateApplication } from "@/services/applicationService";

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
    <main className="page-shell text-gray-800">
      <div className="section-shell">
        <section className="glass-card rounded p-6 md:p-8 mb-6">
          <p className="text-xs uppercase tracking-[0.12em] text-gray-600">Admin Review</p>
          <h1 className="text-3xl md:text-4xl text-gray-900 mt-2">Applications</h1>
          <p className="text-gray-700 mt-2">Review incoming internship applications and update status quickly.</p>
        </section>

        {loading && <p className="text-gray-600">Loading applications...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {feedback && (
          <p className="mb-4 rounded border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700">
            {feedback}
          </p>
        )}

        <section className="space-y-4">
          {visibleApplications.map((application) => (
            <article key={application.id} className="paper-card rounded p-5 md:p-6">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-2xl text-gray-900">{application.fullName}</h2>
                  <p className="mt-1 text-sm text-gray-700">{application.email} • {application.institution}</p>
                </div>
                <span className="chip">{String(application.status || "new").replaceAll("_", " ")}</span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-gray-700">{application.statement}</p>

              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <button
                  type="button"
                  onClick={() => setStatus(application.id, "under_review")}
                  disabled={actionLoading.startsWith(`${application.id}:`)}
                  className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Mark under review
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(application.id, "accepted")}
                  disabled={actionLoading.startsWith(`${application.id}:`)}
                  className="rounded bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(application.id, "rejected")}
                  disabled={actionLoading.startsWith(`${application.id}:`)}
                  className="rounded border border-gray-600 bg-gray-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
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
