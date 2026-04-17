"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getInterns } from "@/services/internService";
import { getProjectById, getProjects } from "@/services/projectService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function renderParagraphs(paragraphs = []) {
  return paragraphs.map((paragraph) => (
    <p key={paragraph} className="mt-3 leading-relaxed text-slate-700">
      {paragraph}
    </p>
  ));
}

function renderTable(table) {
  if (!table) {
    return null;
  }

  const columns = table.columns || [];

  return (
    <div className="mt-5 overflow-x-auto rounded border border-gray-300 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase tracking-[0.1em] text-xs">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 border-b border-gray-300">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={`${rowIndex}-${row[columns[0]?.key] || "row"}`} className="odd:bg-white even:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 align-top text-gray-700 border-b border-gray-200">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionBlock({ section }) {
  return (
    <Card className="paper-card rounded p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.12em] text-blue-700 font-semibold">Section</p>
      <h2 className="text-2xl md:text-3xl text-gray-900 mt-2">{section.title}</h2>
      {renderParagraphs(section.paragraphs || [])}

      {(section.bullets || []).length > 0 && (
        <ul className="mt-4 space-y-3">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 text-gray-700 leading-relaxed">
              <span className="mt-2 h-2 w-2 rounded bg-blue-900 shrink-0" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {renderTable(section.table)}
    </Card>
  );
}

function InternCard({ intern, projectTitle }) {
  return (
    <Card className="paper-card rounded p-5 md:p-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="chip">{intern.status || "active"}</span>
        <p className="text-xs uppercase tracking-[0.1em] text-gray-600">{intern.cohort ? `Cohort ${intern.cohort}` : "Intern"}</p>
      </div>
      <h3 className="text-2xl text-gray-900 mt-3">{intern.name}</h3>
      <p className="text-sm font-semibold text-blue-700 mt-1">{intern.college}</p>
      {intern.email && (
        <a className="inline-block mt-3 text-blue-700 font-semibold hover:underline" href={`mailto:${intern.email}`}>
          {intern.email}
        </a>
      )}
      <div className="mt-4 space-y-2 text-sm text-gray-700">
        {intern.phone && <p>Phone: {intern.phone}</p>}
        {(projectTitle || intern.project) && <p>Project: {projectTitle || intern.project}</p>}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {intern.github && (
          <a className="text-blue-700 font-semibold hover:underline" href={intern.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        {intern.linkedin && (
          <a className="text-blue-700 font-semibold hover:underline" href={intern.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
      </div>
    </Card>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = String(params?.id || "");

  const fetchProject = useCallback(() => getProjectById(projectId), [projectId]);
  const fetchProjects = useCallback(() => getProjects(), []);
  const fetchInterns = useCallback(() => getInterns({ projectId, status: "all", cohort: "all" }), [projectId]);

  const {
    data: project,
    loading: projectLoading,
    error: projectError,
  } = useAsyncData(fetchProject);

  const { data: allProjects } = useAsyncData(fetchProjects);
  const {
    data: internData,
    loading: internsLoading,
    error: internsError,
  } = useAsyncData(fetchInterns);

  const interns = useMemo(() => internData || [], [internData]);
  const isGmaProject = useMemo(() => {
    if (!project) {
      return false;
    }

    const id = String(project.id || "").toLowerCase();
    const slug = String(project.slug || "").toLowerCase();
    return id === "gma-project" || slug === "gma-project";
  }, [project]);

  const projectTitleById = useMemo(() => {
    const map = new Map();
    (allProjects || []).forEach((item) => {
      if (item?.id) {
        map.set(String(item.id), item.title || "");
      }
    });
    return map;
  }, [allProjects]);

  if (projectLoading) {
    return (
      <main className="page-shell text-gray-800">
        <section className="section-shell py-10">
          <p className="text-gray-700">Loading project...</p>
        </section>
      </main>
    );
  }

  if (projectError || !project) {
    return (
      <main className="page-shell text-gray-800">
        <section className="section-shell py-10 space-y-4">
          <p className="text-red-600">{projectError || "Project not found."}</p>
          <Button variant="link" className="px-0" asChild>
            <Link href="/projects">Back to Projects</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell text-gray-800">
      <section className="section-shell relative overflow-hidden rounded glass-card p-6 md:p-10 reveal-up mb-8">
        <div className="absolute -top-16 right-0 h-64 w-64 hero-glow-blue" />
        <div className="absolute -bottom-16 -left-10 h-48 w-48 hero-glow-gold" />
        <div className="relative max-w-4xl">
          <p className="text-xs uppercase tracking-[0.12em] text-gray-600">Project Detail</p>
          <h1 className="section-title mt-2">{project.title}</h1>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed">{project.summary}</p>
          <p className="mt-4 text-gray-700 leading-relaxed">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="chip">{project.status || "ongoing"}</span>
            {(project.tags || []).map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded border border-gray-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {!isGmaProject && (
        <section className="section-shell grid gap-6">
          {(project.sections || []).map((section) => (
            <SectionBlock key={section.title} section={section} />
          ))}
        </section>
      )}

      <section className="section-shell mt-10">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-gray-600">Interns</p>
            <h2 className="text-3xl text-gray-900 mt-2">Interns working on this project</h2>
          </div>
          <p className="text-sm text-gray-700">{interns.length} intern{interns.length === 1 ? "" : "s"} linked via local data</p>
        </div>

        {internsLoading && <p className="text-gray-700">Loading interns...</p>}
        {internsError && <p className="text-red-600">{internsError}</p>}

        {!internsLoading && !internsError && interns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interns.map((intern) => (
              <InternCard
                key={intern.id}
                intern={intern}
                projectTitle={projectTitleById.get(String(intern.projectId || ""))}
              />
            ))}
          </div>
        ) : null}

        {!internsLoading && !internsError && interns.length === 0 ? (
          <Card className="paper-card rounded p-6 text-gray-700">
            No interns are linked to this project yet.
          </Card>
        ) : null}
      </section>

      <section className="section-shell mt-10 mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-gray-700">Project ID: {project.id}</p>
        <Button variant="link" className="px-0" asChild>
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </section>
    </main>
  );
}
