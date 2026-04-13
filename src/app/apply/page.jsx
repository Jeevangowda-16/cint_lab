"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getFormConfig } from "@/services/formConfigService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [successMessage, setSuccessMessage] = useState("");
  const fetchFormConfig = useCallback(() => getFormConfig(), []);
  const { data: formConfig, loading: optionsLoading } = useAsyncData(fetchFormConfig);
  const internshipInterestOptions = useMemo(
    () => formConfig?.internshipInterestOptions || [],
    [formConfig]
  );

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSuccessMessage("");
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [successMessage]);

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
    setSuccessMessage("");

    if (!form.fullName || !form.email || !form.institution || !form.statement) {
      setFeedback("Please fill all required fields before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/applications/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Submission failed.");
      }

      setSuccessMessage("Application submitted successfully.");
      setForm(initialApplicationForm);
    } catch (submitError) {
      setFeedback(submitError instanceof Error ? submitError.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell text-gray-800">
      {successMessage && (
        <div className="success-overlay" role="status" aria-live="polite">
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h2 className="success-title">Application Submitted Successfully</h2>
            <p className="success-text">Thank you for submitting your application.</p>
          </div>
        </div>
      )}

      <section className="section-shell max-w-4xl mb-10 relative overflow-hidden rounded glass-card p-6 md:p-10 reveal-up">
        <div className="absolute -top-14 -right-10 h-48 w-48 hero-glow-gold" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-600">Applications</p>
          <h1 className="section-title mt-2">Internship Application</h1>
          <p className="mt-4 text-lg text-gray-700">
            Submit your profile to join ongoing tracks in guidance, control, and intelligent aerospace systems.
          </p>
        </div>
      </section>

      <form onSubmit={onSubmit} className="section-shell max-w-4xl paper-card rounded p-6 md:p-9 space-y-7">
        <div className="subtle-grid rounded border border-gray-200 p-4 md:p-5">
          <p className="text-sm text-gray-700 leading-relaxed">
            Required fields are marked with <span className="font-semibold">*</span>. We review submissions in weekly faculty and mentor meetings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700" htmlFor="fullName">Full Name *</label>
            <Input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={onInputChange}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700" htmlFor="email">Email *</label>
            <Input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={onInputChange}
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700" htmlFor="institution">Institution *</label>
            <Input
              id="institution"
              name="institution"
              value={form.institution}
              onChange={onInputChange}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700" htmlFor="programLevel">Program Level</label>
            <Select value={form.programLevel} onValueChange={(value) => setForm((previous) => ({ ...previous, programLevel: value }))}>
              <SelectTrigger id="programLevel" className="mt-2 w-full h-11">
                <SelectValue placeholder="Select program level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                <SelectItem value="Masters">Masters</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Interest Areas</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {optionsLoading && <p className="text-sm text-gray-600">Loading interests...</p>}
            {internshipInterestOptions.map((topic) => (
              <label key={topic} className="flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-300 px-3 py-2 rounded">
                <Checkbox
                  checked={form.interests.includes(topic)}
                  onChange={() => onInterestToggle(topic)}
                />
                {topic}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700" htmlFor="statement">Statement of Purpose *</label>
          <Textarea
            id="statement"
            name="statement"
            rows={5}
            value={form.statement}
            onChange={onInputChange}
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700" htmlFor="resumeUrl">Resume URL</label>
          <Input
            id="resumeUrl"
            name="resumeUrl"
            value={form.resumeUrl}
            onChange={onInputChange}
            className="mt-2"
            placeholder="https://"
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 bg-blue-700 hover:bg-blue-800"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </Button>

        {feedback && <p className="text-sm text-gray-700">{feedback}</p>}
      </form>
    </main>
  );
}
