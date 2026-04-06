"use client";

import { useCallback, useMemo, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { submitApplication } from "@/services/applicationService";
import { getFormConfig } from "@/services/formConfigService";

const initialApplicationForm = {
  fullName: "",
  email: "",
  phone: "",
  institution: "",
  programLevel: "Undergraduate",
  interests: [],
  statement: "",
  resumeUrl: "",
};

export default function ApplyPage() {
  const [form, setForm] = useState(initialApplicationForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const fetchFormConfig = useCallback(() => getFormConfig(), []);
  const { data: formConfig, loading: optionsLoading } = useAsyncData(fetchFormConfig);
  const internshipInterestOptions = useMemo(
    () => formConfig?.internshipInterestOptions || [],
    [formConfig]
  );

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const onInterestToggle = (topic) => {
    setForm((previous) => {
      const hasTopic = previous.interests.includes(topic);
      const interests = hasTopic
        ? previous.interests.filter((item) => item !== topic)
        : [...previous.interests, topic];

      return { ...previous, interests };
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFeedback("");

    if (!form.fullName || !form.email || !form.institution || !form.statement) {
      setFeedback("Please fill all required fields before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitApplication(form);
      setFeedback(`Application submitted via ${result.mode} mode. Reference: ${result.id}`);
      setForm(initialApplicationForm);
    } catch (submitError) {
      setFeedback(submitError instanceof Error ? submitError.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell text-slate-800">
      <section className="section-shell max-w-4xl mb-10 relative overflow-hidden rounded-3xl glass-card p-6 md:p-10 reveal-up">
        <div className="absolute -top-14 -right-10 h-48 w-48 hero-glow-gold" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Applications</p>
          <h1 className="section-title mt-2">Internship Application</h1>
          <p className="mt-4 text-lg text-slate-600">
            Submit your profile to join ongoing tracks in guidance, control, and intelligent aerospace systems.
          </p>
        </div>
      </section>

      <form onSubmit={onSubmit} className="section-shell max-w-4xl paper-card rounded-3xl p-6 md:p-9 space-y-7">
        <div className="subtle-grid rounded-2xl p-4 md:p-5">
          <p className="text-sm text-slate-700 leading-relaxed">
            Required fields are marked with <span className="font-semibold">*</span>. We review submissions in weekly faculty and mentor meetings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="fullName">Full Name *</label>
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={onInputChange}
              className="mt-2 w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={onInputChange}
              className="mt-2 w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="institution">Institution *</label>
            <input
              id="institution"
              name="institution"
              value={form.institution}
              onChange={onInputChange}
              className="mt-2 w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="programLevel">Program Level</label>
            <select
              id="programLevel"
              name="programLevel"
              value={form.programLevel}
              onChange={onInputChange}
              className="mt-2 w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            >
              <option>Undergraduate</option>
              <option>Masters</option>
              <option>PhD</option>
            </select>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">Interest Areas</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {optionsLoading && <p className="text-sm text-slate-500">Loading interests...</p>}
            {internshipInterestOptions.map((topic) => (
              <label key={topic} className="flex items-center gap-2 text-sm text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={form.interests.includes(topic)}
                  onChange={() => onInterestToggle(topic)}
                />
                {topic}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="statement">Statement of Purpose *</label>
          <textarea
            id="statement"
            name="statement"
            rows={5}
            value={form.statement}
            onChange={onInputChange}
            className="mt-2 w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="resumeUrl">Resume URL</label>
          <input
            id="resumeUrl"
            name="resumeUrl"
            value={form.resumeUrl}
            onChange={onInputChange}
            className="mt-2 w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            placeholder="https://"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-sky-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-sky-900 transition disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>

        {feedback && <p className="text-sm text-slate-700">{feedback}</p>}
      </form>
    </main>
  );
}
