"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getInterns } from "@/services/internService";
import { getProjects } from "@/services/projectService";
import { getTeamMembers } from "@/services/teamService";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

const TEAM_FILTERS = [{ label: "All", value: "all" }];

function toAbsoluteUrl(value) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

function getInitials(name) {
  return (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function PeopleDirectory() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeOnly, setActiveOnly] = useState(false);

  // Data Fetching
  const fetchTeamMembers = useCallback(
    () => getTeamMembers({ roleCategory: "all", activeOnly }),
    [activeOnly]
  );
  const fetchInterns = useCallback(() => getInterns({ status: "all", cohort: "all" }), []);
  const fetchProjects = useCallback(() => getProjects(), []);

  const { data: teamData, loading: teamLoading, error: teamError } = useAsyncData(fetchTeamMembers);
  const { data: internData, loading: internLoading, error: internError } = useAsyncData(fetchInterns);
  const { data: projectData } = useAsyncData(fetchProjects);

  // Memoized Data Processing
  const teamMembers = useMemo(() => teamData || [], [teamData]);

  const interns = useMemo(() => {
    const list = [...(internData || [])];
    const harshIndex = list.findIndex(i => (i.name || "").trim().toLowerCase() === "harshavardhan k");
    const jeevanIndex = list.findIndex(i => (i.name || "").trim().toLowerCase() === "jeevan d");

    if (harshIndex !== -1 && jeevanIndex !== -1 && jeevanIndex !== harshIndex + 1) {
      const [jeevan] = list.splice(jeevanIndex, 1);
      list.splice(harshIndex + 1, 0, jeevan);
    }
    return list;
  }, [internData]);

  const projectTitleById = useMemo(() => {
    const map = new Map();
    (projectData || []).forEach((p) => { if (p?.id) map.set(String(p.id), p.title || ""); });
    return map;
  }, [projectData]);

  const designationFilters = useMemo(() => {
    const values = new Set(teamMembers.map((m) => (m.designation || "").trim()).filter(Boolean));
    return [...values].sort((a, b) => a.localeCompare(b));
  }, [teamMembers]);

  // Unified Filtering Logic
  const visibleMembers = useMemo(() => {
    if (roleFilter === "all") {
      return [...teamMembers, ...interns];
    }
    if (roleFilter === "interns") {
      return interns;
    }
    return teamMembers.filter((m) => (m.designation || "").trim() === roleFilter);
  }, [teamMembers, interns, roleFilter]);

  const isLoading = teamLoading || internLoading;
  const hasError = teamError || internError;

  // Exact styling constant based on your requirements
  const getButtonClass = (isActive) =>
    isActive
      ? "bg-blue-900 text-white border-transparent hover:bg-blue-800 focus:ring-blue-800 shadow-sm font-medium transition-colors"
      : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200 font-medium transition-colors";

  return (
    <main className="page-shell text-gray-800">
      {/* UPDATE 1: Changed to rounded-2xl */}
      <section className="section-shell mb-10 glass-card relative overflow-hidden rounded-2xl p-6 md:p-10 reveal-up">
        <div className="absolute -top-14 -right-12 h-48 w-48 hero-glow-blue" />
        <div className="absolute -bottom-14 -left-10 h-40 w-40 hero-glow-gold" />
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Team at CINT Lab</p>
        <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight mt-2">People</h1>
        <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed">
          Meet our faculty, associates, alumni, and interns contributing across intelligent systems and aerospace research.
        </p>
      </section>

      <section className="section-shell mb-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {TEAM_FILTERS.map((f) => (
              <Button
                key={f.value}
                onClick={() => setRoleFilter(f.value)}
                className={getButtonClass(roleFilter === f.value)}
              >
                {f.label}
              </Button>
            ))}

            {designationFilters.map((d) => (
              <Button
                key={d}
                onClick={() => setRoleFilter(d)}
                className={getButtonClass(roleFilter === d)}
              >
                {d}
              </Button>
            ))}

            <Button
              onClick={() => setRoleFilter("interns")}
              className={getButtonClass(roleFilter === "interns")}
            >
              Interns
            </Button>
          </div>
        </div>

        <h2 className="text-3xl text-gray-900 mb-5 capitalize">
          {roleFilter === "all" ? "Our Team" : roleFilter}
        </h2>

        {isLoading && <p className="text-gray-600">Loading directory...</p>}
        {hasError && <p className="text-red-600">Error loading data.</p>}

        {!isLoading && !hasError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
            {visibleMembers.map((member) => {
              const isInternRecord = !member.designation && (member.projectId || member.program);

              // UPDATE 2: Added hover shadow effects matching the publications page
              return (
                <Card key={member.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-4 h-full flex flex-col overflow-hidden">
                  <div className="relative mb-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 aspect-[1/1.05]">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={`${member.name} portrait`}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-gray-100 text-2xl font-semibold text-blue-900">
                        {getInitials(member.name)}
                      </div>
                    )}
                  </div>

                  {/* Decreased spacing between Name and Role/Project */}
                  <h3 className="text-xl text-gray-900 leading-tight">{member.name}</h3>

                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-600 mt-1">
                    {isInternRecord
                      ? (projectTitleById.get(String(member.projectId || "")) || member.program || "Intern")
                      : (member.designation || "Faculty")
                    }
                  </p>

                  {/* Compact spacing for Email and Links */}
                  <div className="mt-auto pt-3 space-y-1 text-sm">
                    {member.email ? (
                      <a className="block text-blue-900 font-semibold hover:underline" href={`mailto:${member.email}`}>
                        {member.email}
                      </a>
                    ) : (
                      <p className="text-gray-400 italic">Private Email</p>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                      {member.profileUrl && (
                        <a className="text-blue-900 font-semibold hover:underline" href={toAbsoluteUrl(member.profileUrl)} target="_blank" rel="noreferrer">
                          Profile
                        </a>
                      )}
                      {member.github && (
                        <a className="text-blue-900 font-semibold hover:underline" href={toAbsoluteUrl(member.github)} target="_blank" rel="noreferrer">
                          GitHub
                        </a>
                      )}
                      {member.linkedin && (
                        <a className="text-blue-900 font-semibold hover:underline" href={toAbsoluteUrl(member.linkedin)} target="_blank" rel="noreferrer">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}