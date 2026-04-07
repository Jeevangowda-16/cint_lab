"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getProjects } from "@/services/projectService";

const statusFilters = ["all", "ongoing", "review", "completed"];

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchProjects = useCallback(
    () => getProjects({ status: statusFilter === "all" ? undefined : statusFilter }),
    [statusFilter]
  );

  const { data, loading, error } = useAsyncData(fetchProjects);

  const projects = useMemo(() => data || [], [data]);

  return (
    <main className="page-shell text-slate-800">
      <section className="section-shell mb-10 relative overflow-hidden rounded-3xl glass-card p-6 md:p-10 reveal-up">
        <div className="absolute -top-20 right-0 h-60 w-60 hero-glow-blue" />
        <div className="absolute bottom-0 left-0 h-44 w-44 hero-glow-gold" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Project Portfolio</p>
          <h1 className="section-title mt-2">Projects</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl">
            Explore active and recently reviewed initiatives in autonomy, biomechanics, sensing, and data-driven aerospace systems.
          </p>
        </div>
      </section>

      <div className="section-shell mb-8 flex gap-3 flex-wrap">
        {statusFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
              statusFilter === filter
                ? "bg-sky-800 text-white border-sky-800 shadow-md"
                : "bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:text-sky-800"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading && <p className="section-shell text-gray-600">Loading projects...</p>}
      {error && <p className="section-shell text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="section-shell grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <article
              key={project.id}
              className="paper-card rounded-2xl p-7 md:p-8 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="chip">{project.status || "ongoing"}</span>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">ID: {project.id}</p>
                </div>
                <h2 className="text-2xl text-slate-900 mt-4">{project.title}</h2>
                <p className="text-slate-700 mt-3 leading-relaxed">{project.summary}</p>
                <p className="text-sm text-slate-600 mt-4 leading-relaxed">{project.description}</p>
                {(project.tags || []).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(project.tags || []).map((tag) => (
                      <span key={tag} className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Status: <span className="font-semibold capitalize text-slate-800">{project.status}</span>
                </p>
                <Link className="text-slate-900 text-sm font-bold hover:underline" href={`/projects/${project.id}`}>
                  Get More Info
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
