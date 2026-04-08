"use client";

import { useCallback, useMemo, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getInterns } from "@/services/internService";
import { getTeamMembers } from "@/services/teamService";

const TEAM_FILTERS = [{ label: "All", value: "all" }];

function toAbsoluteUrl(value) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

export default function PeopleDirectory() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeOnly, setActiveOnly] = useState(false);
  const isInternView = roleFilter === "interns";

  const fetchTeamMembers = useCallback(
    () =>
      getTeamMembers({
        roleCategory: "all",
        activeOnly,
      }),
    [activeOnly]
  );

  const fetchInterns = useCallback(() => getInterns({ status: "all", cohort: "all" }), []);

  const {
    data: teamData,
    loading: teamLoading,
    error: teamError,
  } = useAsyncData(fetchTeamMembers);

  const {
    data: internData,
    loading: internLoading,
    error: internError,
  } = useAsyncData(fetchInterns);

  const teamMembers = useMemo(() => teamData || [], [teamData]);
  const interns = useMemo(() => {
    const list = [...(internData || [])];
    const harshIndex = list.findIndex(
      (intern) => (intern.name || "").trim().toLowerCase() === "harshavardhan k"
    );
    const jeevanIndex = list.findIndex(
      (intern) => (intern.name || "").trim().toLowerCase() === "jeevan d"
    );

    if (harshIndex !== -1 && jeevanIndex !== -1 && jeevanIndex !== harshIndex + 1) {
      const [jeevan] = list.splice(jeevanIndex, 1);
      const insertAt = harshIndex < jeevanIndex ? harshIndex + 1 : harshIndex + 1;
      list.splice(insertAt, 0, jeevan);
    }

    return list;
  }, [internData]);
  const designationFilters = useMemo(() => {
    const values = new Set(
      teamMembers
        .map((member) => (member.designation || "").trim())
        .filter(Boolean)
    );

    return [...values].sort((a, b) => a.localeCompare(b));
  }, [teamMembers]);

  const visibleTeamMembers = useMemo(() => {
    if (roleFilter === "all" || roleFilter === "interns") return teamMembers;
    return teamMembers.filter((member) => (member.designation || "").trim() === roleFilter);
  }, [teamMembers, roleFilter]);

  return (
    <main className="page-shell text-slate-800">
      <section className="section-shell mb-10 glass-card relative overflow-hidden rounded-3xl p-6 md:p-10 reveal-up">
        <div className="absolute -top-14 -right-12 h-48 w-48 hero-glow-blue" />
        <div className="absolute -bottom-14 -left-10 h-40 w-40 hero-glow-gold" />
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Team at CINT Lab</p>
        <h1 className="text-4xl md:text-5xl text-slate-900 tracking-tight mt-2">Team</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl leading-relaxed">
          Meet our faculty, associates, alumni, and interns contributing across intelligent systems and aerospace research.
        </p>
      </section>

      <section className="section-shell mb-12">
        <div className="flex flex-wrap gap-3 items-center mb-6">
          {TEAM_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setRoleFilter(filter.value)}
              className={`px-4 py-2 rounded-xl font-semibold border transition ${
                roleFilter === filter.value
                  ? "bg-sky-800 text-white border-sky-800"
                  : "bg-white text-slate-700 border-slate-200 hover:border-sky-300"
              }`}
            >
              {filter.label}
            </button>
          ))}

          {designationFilters.map((designation) => (
            <button
              key={designation}
              type="button"
              onClick={() => setRoleFilter(designation)}
              className={`px-4 py-2 rounded-xl font-semibold border transition ${
                roleFilter === designation
                  ? "bg-sky-800 text-white border-sky-800"
                  : "bg-white text-slate-700 border-slate-200 hover:border-sky-300"
              }`}
            >
              {designation}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setRoleFilter("interns")}
            className={`px-4 py-2 rounded-xl font-semibold border transition ${
              roleFilter === "interns"
                ? "bg-sky-800 text-white border-sky-800"
                : "bg-white text-slate-700 border-slate-200 hover:border-sky-300"
            }`}
          >
            Interns
          </button>

          {!isInternView && <label className="ml-auto text-sm text-gray-700 flex items-center gap-2">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(event) => setActiveOnly(event.target.checked)}
            />
            Active members only
          </label>}
        </div>

        {!isInternView && (
          <>
        <h2 className="text-3xl text-slate-900 tracking-tight mb-5">Team</h2>
        {teamLoading && <p className="text-gray-600">Loading team data...</p>}
        {teamError && <p className="text-red-600">{teamError}</p>}

        {!teamLoading && !teamError && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {visibleTeamMembers.map((member) => (
              <article
                key={member.id}
                className="paper-card p-6 rounded-2xl transition-transform duration-200 hover:-translate-y-1 h-full flex flex-col"
              >
                <h3 className="text-2xl text-slate-900">{member.name}</h3>
                <p className="text-sm font-semibold text-slate-600 mt-2">Designation: {member.designation || "Faculty"}</p>
                <div className="mt-auto pt-6 space-y-2 text-sm">
                  {member.email ? (
                    <a className="block text-sky-700 font-semibold hover:underline" href={`mailto:${member.email}`}>
                      {member.email}
                    </a>
                  ) : (
                    <p className="text-gray-400">No public email</p>
                  )}
                  {member.profileUrl ? (
                    <a
                      className="block text-sky-700 font-semibold hover:underline"
                      href={toAbsoluteUrl(member.profileUrl)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Profile Link
                    </a>
                  ) : (
                    <p className="text-gray-400">No profile link</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
          </>
        )}

        {isInternView && (
          <>
        <h2 className="text-3xl text-slate-900 tracking-tight mb-5">Interns</h2>
        {internLoading && <p className="text-gray-600">Loading interns...</p>}
        {internError && <p className="text-red-600">{internError}</p>}

        {!internLoading && !internError && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interns.map((intern) => (
              <article key={intern.id} className="paper-card rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="chip">{intern.status || "active"}</span>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">{intern.cohort ? `Cohort ${intern.cohort}` : "Intern"}</p>
                </div>
                <h3 className="text-2xl text-slate-900 mt-3">{intern.name}</h3>
                <p className="text-sm font-semibold text-sky-700 mt-1">{intern.project || intern.program}</p>
                {(intern.college || intern.focusArea) && (
                  <p className="text-sm text-slate-700 mt-3 leading-relaxed">{intern.college || `Focus: ${intern.focusArea}`}</p>
                )}
                {(intern.email || intern.phone || intern.github || intern.linkedin) && (
                  <div className="mt-4 space-y-2 text-sm">
                    {intern.email && (
                      <a className="block text-sky-700 font-semibold hover:underline" href={`mailto:${intern.email}`}>
                        {intern.email}
                      </a>
                    )}
                    {intern.phone && <p className="text-slate-700">Phone: {intern.phone}</p>}
                    {intern.github && (
                      <a className="block text-sky-700 hover:underline" href={toAbsoluteUrl(intern.github)} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    )}
                    {intern.linkedin && (
                      <a className="block text-sky-700 hover:underline" href={toAbsoluteUrl(intern.linkedin)} target="_blank" rel="noreferrer">
                        LinkedIn
                      </a>
                    )}
                  </div>
                )}
                {!intern.email && !intern.phone && !intern.github && !intern.linkedin && (
                  <p className="text-sm text-slate-500 mt-3">Mentor ID: {intern.mentorId || "TBD"}</p>
                )}
              </article>
            ))}
          </div>
        )}
          </>
        )}
      </section>
    </main>
  );
}