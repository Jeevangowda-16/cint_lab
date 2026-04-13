"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getProjects } from "@/services/projectService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <main className="page-shell text-gray-800">
      <section className="section-shell mb-10 relative overflow-hidden rounded glass-card p-6 md:p-10 reveal-up">
        <div className="absolute -top-20 right-0 h-60 w-60 hero-glow-blue" />
        <div className="absolute bottom-0 left-0 h-44 w-44 hero-glow-gold" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Project Portfolio</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight mt-2">Projects</h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed">
            Explore active and recently reviewed initiatives in autonomy, biomechanics, sensing, and data-driven aerospace systems.
          </p>
        </div>
      </section>

      <div className="section-shell mb-8">
        <div className="segmented-tabs">
          {statusFilters.map((filter) => (
            <Button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              variant="ghost"
              className={`segmented-tab-btn capitalize ${
                statusFilter === filter
                  ? "segmented-tab-btn-active"
                  : ""
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {loading && <p className="section-shell text-gray-600">Loading projects...</p>}
      {error && <p className="section-shell text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="section-shell grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="paper-card rounded p-7 md:p-8 flex flex-col justify-between"
            >
              <CardContent className="p-0 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="chip">{project.status || "ongoing"}</span>
                  <p className="text-xs uppercase tracking-[0.1em] text-gray-600">ID: {project.id}</p>
                </div>
                <h2 className="text-2xl text-gray-900 mt-4">{project.title}</h2>
                <p className="text-gray-700 mt-3 leading-relaxed">{project.summary}</p>
                <p className="text-sm text-gray-700 mt-4 leading-relaxed">{project.description}</p>
                {(project.tags || []).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(project.tags || []).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-gray-300 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Status: <span className="font-semibold capitalize text-gray-800">{project.status}</span>
                </p>
                <Link className="text-blue-800 text-sm font-semibold hover:underline" href={`/projects/${project.id}`}>
                  Get More Info
                </Link>
              </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
