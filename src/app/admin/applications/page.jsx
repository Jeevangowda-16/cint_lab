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
    <main className="min-h-screen bg-gray-50 px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin: Applications</h1>

        {loading && <p className="text-gray-600">Loading applications...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {feedback && <p className="text-sm text-gray-700 mb-4">{feedback}</p>}

        <div className="space-y-4">
          {visibleApplications.map((application) => (
            <article key={application.id} className="bg-white border border-gray-100 rounded-lg p-4">
              <h2 className="text-xl font-bold text-gray-900">{application.fullName}</h2>
              <p className="text-sm text-gray-600 mt-1">{application.email} • {application.institution}</p>
              <p className="text-sm text-gray-700 mt-2">{application.statement}</p>
              <div className="mt-3 flex gap-3 items-center">
                <span className="text-sm text-gray-500">Status: {application.status}</span>
                <button
                  type="button"
                  onClick={() => setStatus(application.id, "under_review")}
                  disabled={Boolean(actionLoading)}
                  className="text-blue-700 font-semibold disabled:opacity-50"
                >
                  Mark under review
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(application.id, "accepted")}
                  disabled={Boolean(actionLoading)}
                  className="text-green-700 font-semibold disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(application.id, "rejected")}
                  disabled={Boolean(actionLoading)}
                  className="text-red-700 font-semibold disabled:opacity-50"
                >
                  Reject
                </button>
                {actionLoading.startsWith(`${application.id}:`) && (
                  <span className="text-xs text-gray-500">Updating...</span>
                )}
              </div>
            </article>
          ))}
          {!loading && !error && visibleApplications.length === 0 && (
            <p className="text-sm text-gray-600">No active applications to review.</p>
          )}
        </div>
      </div>
    </main>
  );
}
