import Link from "next/link";
import { notFound } from "next/navigation";
import { getInterns } from "@/services/internService";
import { getProjectById } from "@/services/projectService";

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
    <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white/80">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600 uppercase tracking-[0.15em] text-xs">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 border-b border-slate-200">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={`${rowIndex}-${row[columns[0]?.key] || "row"}`} className="odd:bg-white even:bg-slate-50/80">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 align-top text-slate-700 border-b border-slate-100">
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
    <section className="paper-card rounded-3xl p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.18em] text-sky-700 font-bold">Section</p>
      <h2 className="text-2xl md:text-3xl text-slate-900 mt-2">{section.title}</h2>
      {renderParagraphs(section.paragraphs || [])}

      {(section.bullets || []).length > 0 && (
        <ul className="mt-4 space-y-3">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 text-slate-700 leading-relaxed">
              <span className="mt-2 h-2 w-2 rounded-full bg-sky-700 shrink-0" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {renderTable(section.table)}
    </section>
  );
}

function InternCard({ intern }) {
  return (
    <article className="paper-card rounded-2xl p-5 md:p-6 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="chip">{intern.status || "active"}</span>
        <p className="text-xs uppercase tracking-[0.15em] text-slate-500">{intern.cohort ? `Cohort ${intern.cohort}` : "Intern"}</p>
      </div>
      <h3 className="text-2xl text-slate-900 mt-3">{intern.name}</h3>
      <p className="text-sm font-semibold text-sky-700 mt-1">{intern.college}</p>
      {intern.email && (
        <a className="inline-block mt-3 text-sky-700 font-semibold hover:underline" href={`mailto:${intern.email}`}>
          {intern.email}
        </a>
      )}
      <div className="mt-4 space-y-2 text-sm text-slate-700">
        {intern.phone && <p>Phone: {intern.phone}</p>}
        {intern.project && <p>Project: {intern.project}</p>}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {intern.github && (
          <a className="text-sky-700 font-semibold hover:underline" href={intern.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        {intern.linkedin && (
          <a className="text-sky-700 font-semibold hover:underline" href={intern.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
      </div>
    </article>
  );
}

export default async function ProjectDetailPage({ params }) {
  const resolvedParams = await params;
  const projectId = resolvedParams?.id;

  if (!projectId) {
    notFound();
  }

  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  const interns = await getInterns({ projectId: project.id, status: "all", cohort: "all" });

  return (
    <main className="page-shell text-slate-800">
      <section className="section-shell relative overflow-hidden rounded-3xl glass-card p-6 md:p-10 reveal-up mb-8">
        <div className="absolute -top-16 right-0 h-64 w-64 hero-glow-blue" />
        <div className="absolute -bottom-16 -left-10 h-48 w-48 hero-glow-gold" />
        <div className="relative max-w-4xl">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Project Detail</p>
          <h1 className="section-title mt-2">{project.title}</h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">{project.summary}</p>
          <p className="mt-4 text-slate-700 leading-relaxed">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="chip">{project.status || "ongoing"}</span>
            {(project.tags || []).map((tag) => (
              <span key={tag} className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-6">
        {(project.sections || []).map((section) => (
          <SectionBlock key={section.title} section={section} />
        ))}
      </section>

      <section className="section-shell mt-10">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Interns</p>
            <h2 className="text-3xl text-slate-900 tracking-tight mt-2">Interns working on this project</h2>
          </div>
          <p className="text-sm text-slate-600">{interns.length} intern{interns.length === 1 ? "" : "s"} linked via Firestore</p>
        </div>

        {interns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interns.map((intern) => (
              <InternCard key={intern.id} intern={intern} />
            ))}
          </div>
        ) : (
          <div className="paper-card rounded-2xl p-6 text-slate-600">
            No interns are linked to this project yet.
          </div>
        )}
      </section>

      <section className="section-shell mt-10 mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-600">Project ID: {project.id}</p>
        <Link href="/projects" className="text-sky-700 font-bold hover:underline">
          Back to Projects
        </Link>
      </section>
    </main>
  );
}
