"use client";

import { useCallback, useMemo, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getInterns } from "@/services/internService";
import { getTeamMembers } from "@/services/teamService";

const TEAM_FILTERS = [
  { label: "All", value: "all" },
  { label: "Leads", value: "lead" },
  { label: "Associates", value: "associate" },
  { label: "Alumni", value: "alumni" },
  { label: "Interns", value: "interns" },
];

export default function PeopleDirectory() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeOnly, setActiveOnly] = useState(false);
  const isInternView = roleFilter === "interns";

  const fetchTeamMembers = useCallback(
    () =>
      getTeamMembers({
        roleCategory: isInternView ? "all" : roleFilter,
        activeOnly,
      }),
    [roleFilter, activeOnly, isInternView]
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
  const interns = useMemo(() => internData || [], [internData]);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member) => (
              <article
                key={member.id}
                className="paper-card p-6 rounded-2xl transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-xs font-bold text-sky-700 uppercase tracking-[0.16em]">{member.roleCategory}</p>
                  <p className="text-xs text-slate-500">Profile ID: {member.id}</p>
                </div>
                <h3 className="text-2xl text-slate-900 mt-2">{member.name}</h3>
                <p className="text-sm font-semibold text-slate-600 mt-1">{member.designation}</p>
                <p className="text-slate-700 mt-4 leading-relaxed">{member.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(member.researchAreas || []).map((area) => (
                    <span key={area} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full border border-slate-200">
                      {area}
                    </span>
                  ))}
                </div>
                {member.email ? (
                  <a className="inline-block mt-4 text-sky-700 font-semibold hover:underline" href={`mailto:${member.email}`}>
                    {member.email}
                  </a>
                ) : (
                  <p className="inline-block mt-4 text-gray-400">No public email</p>
                )}
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
                  <span className="chip">{intern.status}</span>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Cohort {intern.cohort}</p>
                </div>
                <h3 className="text-2xl text-slate-900 mt-3">{intern.name}</h3>
                <p className="text-sm font-semibold text-sky-700 mt-1">{intern.program}</p>
                <p className="text-sm text-slate-700 mt-4 leading-relaxed">Focus: {intern.focusArea}</p>
                <p className="text-sm text-slate-500 mt-3">Mentor ID: {intern.mentorId || "TBD"}</p>
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