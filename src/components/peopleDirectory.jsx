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
  const fetchProjects = useCallback(() => getProjects(), []);

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

  const { data: projectData } = useAsyncData(fetchProjects);

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

  const projectTitleById = useMemo(() => {
    const map = new Map();
    (projectData || []).forEach((project) => {
      if (project?.id) {
        map.set(String(project.id), project.title || "");
      }
    });
    return map;
  }, [projectData]);

  return (
    <main className="page-shell text-gray-800">
      <section className="section-shell mb-10 glass-card relative overflow-hidden rounded p-6 md:p-10 reveal-up">
        <div className="absolute -top-14 -right-12 h-48 w-48 hero-glow-blue" />
        <div className="absolute -bottom-14 -left-10 h-40 w-40 hero-glow-gold" />
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Team at CINT Lab</p>
        <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight mt-2">Team</h1>
        <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed">
          Meet our faculty, associates, alumni, and interns contributing across intelligent systems and aerospace research.
        </p>
      </section>

      <section className="section-shell mb-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="segmented-tabs">
            {TEAM_FILTERS.map((filter) => (
              <Button
                key={filter.value}
                onClick={() => setRoleFilter(filter.value)}
                variant="ghost"
                className={`segmented-tab-btn ${roleFilter === filter.value
                    ? "segmented-tab-btn-active"
                    : ""
                  }`}
              >
                {filter.label}
              </Button>
            ))}

            {designationFilters.map((designation) => (
              <Button
                key={designation}
                onClick={() => setRoleFilter(designation)}
                variant="ghost"
                className={`segmented-tab-btn ${roleFilter === designation
                    ? "segmented-tab-btn-active"
                    : ""
                  }`}
              >
                {designation}
              </Button>
            ))}

            <Button
              onClick={() => setRoleFilter("interns")}
              variant="ghost"
              className={`segmented-tab-btn ${roleFilter === "interns"
                  ? "segmented-tab-btn-active"
                  : ""
                }`}
            >
              Interns
            </Button>
          </div>

          {!isInternView && <label className="text-sm text-gray-700 flex items-center gap-2 md:ml-auto">
            <Checkbox
              checked={activeOnly}
              onChange={(event) => setActiveOnly(event.target.checked)}
            />
            Active members only
          </label>}
        </div>

        {!isInternView && (
          <>
            <h2 className="text-3xl text-gray-900 mb-5">Team</h2>
            {teamLoading && <p className="text-gray-600">Loading team data...</p>}
            {teamError && <p className="text-red-600">{teamError}</p>}

            {!teamLoading && !teamError && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
                {visibleTeamMembers.map((member) => (
                  <Card
                    key={member.id}
                    className="paper-card p-4 rounded-xl h-full flex flex-col overflow-hidden"
                  >
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
                    <h3 className="text-xl text-gray-900 leading-tight">{member.name}</h3>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-600 mt-2">{member.designation || "Faculty"}</p>
                    <div className="mt-auto pt-4 space-y-2 text-sm">
                      {member.email ? (
                        <a className="block text-blue-700 font-semibold hover:underline" href={`mailto:${member.email}`}>
                          {member.email}
                        </a>
                      ) : (
                        <p className="text-gray-400">No public email</p>
                      )}
                      {member.profileUrl ? (
                        <a
                          className="block text-blue-700 font-semibold hover:underline"
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
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {isInternView && (
          <>
            <h2 className="text-3xl text-gray-900 mb-5">Interns</h2>
            {internLoading && <p className="text-gray-600">Loading interns...</p>}
            {internError && <p className="text-red-600">{internError}</p>}

            {!internLoading && !internError && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {interns.map((intern) => (
                  <Card key={intern.id} className="paper-card rounded p-6">
                    <h3 className="text-2xl text-gray-900">{intern.name}</h3>
                    <p className="text-sm font-semibold text-blue-700 mt-1">
                      {projectTitleById.get(String(intern.projectId || "")) || intern.program || intern.project}
                    </p>
                    {intern.college && <p className="text-sm text-gray-700 mt-3 leading-relaxed">{intern.college}</p>}

                    <div className="mt-4 space-y-2 text-sm">
                      {intern.email && (
                        <a className="block text-blue-700 font-semibold hover:underline" href={`mailto:${intern.email}`}>
                          {intern.email}
                        </a>
                      )}
                      {intern.phone && <p className="text-gray-700">Phone: {intern.phone}</p>}
                      {intern.github && (
                        <a className="block text-blue-700 hover:underline" href={toAbsoluteUrl(intern.github)} target="_blank" rel="noreferrer">
                          GitHub
                        </a>
                      )}
                      {intern.linkedin && (
                        <a className="block text-blue-700 hover:underline" href={toAbsoluteUrl(intern.linkedin)} target="_blank" rel="noreferrer">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}