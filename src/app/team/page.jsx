"use client";

import { useCallback, useMemo, useState } from "react";
import { Inter } from "next/font/google";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getInterns } from "@/services/internService";
import { getProjects } from "@/services/projectService";
import { getTeamMembers } from "@/services/teamService";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Initialize the Inter font
const inter = Inter({ subsets: ["latin"] });

const TEAM_FILTERS = [{ label: "All", value: "all" }];

function toAbsoluteUrl(value) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
}

export default function PeopleDirectory() {
  const [roleFilter, setRoleFilter] = useState("all");
  const isInternView = roleFilter === "interns";

  const fetchTeamMembers = useCallback(
    () =>
      getTeamMembers({
        roleCategory: "all",
      }),
    []
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
    <main className={`min-h-screen bg-gradient-to-br from-[#eef2f8] via-[#f4f7fb] to-[#e6eaf3] text-slate-800 p-4 md:p-8 ${inter.className}`}>
      <div className="max-w-5xl mx-auto">
        <section className="relative mb-10 p-10 md:p-16 rounded-3xl shadow-sm flex flex-col items-center text-center overflow-hidden border border-slate-200/50 animate-fade-up">
          <div
            className="absolute inset-0 z-0 animate-bg-zoom origin-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2070&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-0"></div>

          <div className="relative z-10 transition-transform duration-700 ease-out hover:scale-[1.02]">
            <p
              className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-3 drop-shadow-sm animate-fade-up"
              style={{ animationDelay: "0.2s", animationFillMode: "both" }}
            >
              Team at CINT Lab
            </p>
            <h1
              className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight animate-fade-up"
              style={{ animationDelay: "0.3s", animationFillMode: "both" }}
            >
              People
            </h1>
            <p
              className="mt-5 text-lg md:text-xl text-slate-200 max-w-3xl leading-relaxed drop-shadow-md font-medium animate-fade-in"
              style={{ animationDelay: "0.5s", animationFillMode: "both" }}
            >
              Meet our faculty, associates, alumni, and interns contributing across intelligent
              systems and aerospace research.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex flex-wrap gap-2 md:gap-3 items-center justify-center mb-10">
            {TEAM_FILTERS.map((filter) => (
              <Button
                key={filter.value}
                variant={roleFilter === filter.value ? "default" : "outline"}
                onClick={() => setRoleFilter(filter.value)}
                className={`rounded-full h-9 px-4 md:h-10 md:px-5 font-medium text-xs md:text-sm transition-all duration-300 active:scale-95 ${roleFilter === filter.value
                  ? "bg-slate-900 text-white shadow-md transform scale-105"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:scale-105 hover:shadow-md hover:-translate-y-0.5"
                  }`}
              >
                {filter.label}
              </Button>
            ))}

            {designationFilters.map((designation) => (
              <Button
                key={designation}
                variant={roleFilter === designation ? "default" : "outline"}
                onClick={() => setRoleFilter(designation)}
                className={`rounded-full h-9 px-4 md:h-10 md:px-5 font-medium text-xs md:text-sm transition-all duration-300 active:scale-95 ${roleFilter === designation
                  ? "bg-slate-900 text-white shadow-md transform scale-105"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:scale-105 hover:shadow-md hover:-translate-y-0.5"
                  }`}
              >
                {designation}
              </Button>
            ))}

            <Button
              variant={roleFilter === "interns" ? "default" : "outline"}
              onClick={() => setRoleFilter("interns")}
              className={`rounded-full h-9 px-4 md:h-10 md:px-5 font-medium text-xs md:text-sm transition-all duration-300 active:scale-95 ${roleFilter === "interns"
                ? "bg-slate-900 text-white shadow-md transform scale-105"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:scale-105 hover:shadow-md hover:-translate-y-0.5"
                }`}
            >
              Interns
            </Button>
          </div>

          {!isInternView && (
            <>
              {teamLoading && <p className="text-center text-slate-500 py-10">Loading team data...</p>}
              {teamError && <p className="text-center text-red-500 py-10">{teamError}</p>}

              {!teamLoading && !teamError && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {visibleTeamMembers.map((member, index) => (
                    <Card
                      key={member.id}
                      className="rounded-2xl p-6 flex flex-row gap-5 items-center shadow-sm hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 animate-fade-up border-slate-200 bg-white"
                      style={{
                        animationDelay: `${Math.min(index * 0.1, 1)}s`,
                        animationFillMode: "both",
                      }}
                    >
                      <Avatar className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border border-slate-100 shadow-sm relative">
                        {member.imageUrl && (
                          <AvatarImage src={member.imageUrl} alt={member.name} className="object-cover rounded-2xl" />
                        )}
                        <AvatarFallback className="text-2xl sm:text-3xl font-bold text-slate-400 bg-slate-50 rounded-2xl">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>

                      <CardContent className="p-0 flex-1 min-w-0 flex flex-col justify-center border-none shadow-none">
                        <h3 className="text-[1.15rem] font-bold text-slate-900 tracking-tight truncate">{member.name}</h3>
                        <p className="text-sm font-medium text-slate-500 mt-0.5">
                          {member.designation || "Faculty"}
                        </p>

                        {member.email ? (
                          <a
                            className="block mt-2 text-xs text-slate-500 hover:text-slate-800 hover:underline truncate transition-colors duration-200"
                            href={`mailto:${member.email}`}
                          >
                            {member.email}
                          </a>
                        ) : (
                          <p className="block mt-2 text-xs text-slate-400">No public email</p>
                        )}

                        {member.profileUrl && (
                          <div className="mt-3 flex items-center gap-3 text-sm text-slate-300">
                            <a
                              className="text-slate-600 hover:text-slate-900 hover:underline font-medium transition-colors duration-200"
                              href={toAbsoluteUrl(member.profileUrl)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Profile
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {isInternView && (
            <>
              {internLoading && <p className="text-center text-slate-500 py-10">Loading interns...</p>}
              {internError && <p className="text-center text-red-500 py-10">{internError}</p>}

              {!internLoading && !internError && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {interns.map((intern, index) => (
                    <Card
                      key={intern.id}
                      className="rounded-2xl p-6 flex flex-row gap-5 items-center shadow-sm hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 animate-fade-up border-slate-200 bg-white"
                      style={{
                        animationDelay: `${Math.min(index * 0.1, 1)}s`,
                        animationFillMode: "both",
                      }}
                    >
                      <Avatar className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border border-slate-100 shadow-sm relative">
                        {intern.imageUrl && (
                          <AvatarImage src={intern.imageUrl} alt={intern.name} className="object-cover rounded-2xl" />
                        )}
                        <AvatarFallback className="text-2xl sm:text-3xl font-bold text-slate-400 bg-slate-50 rounded-2xl">
                          {getInitials(intern.name)}
                        </AvatarFallback>
                      </Avatar>

                      <CardContent className="p-0 flex-1 min-w-0 flex flex-col justify-center border-none shadow-none">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant="default" className="text-[10px] font-semibold uppercase tracking-wide bg-slate-900 text-white hover:bg-slate-800 rounded-md px-2.5 py-0.5">
                            {intern.status || "active"}
                          </Badge>
                        </div>
                        <h3 className="text-[1.15rem] font-bold text-slate-900 tracking-tight truncate">{intern.name}</h3>
                        <p className="text-sm font-medium text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {projectTitleById.get(String(intern.projectId || "")) ||
                            intern.program ||
                            intern.project}
                        </p>

                        {intern.email && (
                          <a
                            className="block mt-2 text-xs text-slate-500 hover:text-slate-800 hover:underline truncate transition-colors duration-200"
                            href={`mailto:${intern.email}`}
                          >
                            {intern.email}
                          </a>
                        )}

                        {intern.github || intern.linkedin ? (
                          <div className="mt-3 flex items-center gap-3 text-sm text-slate-300">
                            {intern.github && (
                              <a
                                className="text-slate-600 hover:text-slate-900 hover:underline font-medium transition-colors duration-200"
                                href={toAbsoluteUrl(intern.github)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                GitHub
                              </a>
                            )}
                            {intern.github && intern.linkedin && <span>|</span>}
                            {intern.linkedin && (
                              <a
                                className="text-slate-600 hover:text-slate-900 hover:underline font-medium transition-colors duration-200"
                                href={toAbsoluteUrl(intern.linkedin)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                LinkedIn
                              </a>
                            )}
                          </div>
                        ) : (
                          !intern.email && (
                            <p className="mt-3 text-xs text-slate-400">No contact info</p>
                          )
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}