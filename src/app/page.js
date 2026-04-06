"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getLabOverview } from "@/services/labService";

export default function HomePage() {
  const fetchOverview = useCallback(() => getLabOverview(), []);
  const { data: overview, loading, error } = useAsyncData(fetchOverview);
  const ctas = overview?.ctas || [];

  return (
    <main className="page-shell">
      <div className="section-shell">
        {loading && <p className="text-gray-600">Loading lab overview...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && overview && (
          <div className="space-y-10 reveal-up">
            <section className="glass-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
              <div className="absolute -top-14 -right-20 w-56 h-56 hero-glow-blue" />
              <div className="absolute -bottom-16 -left-10 w-44 h-44 hero-glow-gold" />
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                <div className="md:col-span-2 text-left">
                  <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-sky-800">Academic Profile</p>
                  <h1 className="text-4xl md:text-6xl text-slate-900 mt-3 leading-tight">
                    {overview.title}
                  </h1>
                  <p className="text-lg md:text-xl text-slate-600 mt-4 leading-relaxed max-w-3xl">
                    {overview.mission}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Focus Area</p>
                  <p className="text-2xl md:text-3xl text-slate-900 mt-1">Guidance and Control</p>
                  <p className="text-sm text-slate-600 mt-3">Autonomy, Biomechanics, and Intelligent Systems</p>
                </div>
              </div>
            </section>

            <section className="paper-card rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl text-slate-900">Academic Snapshot</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5 text-left">
                <article>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Education</p>
                  <p className="mt-2 text-slate-700">Advanced degrees in aerospace and computational sciences with interdisciplinary training at IISc.</p>
                </article>
                <article>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Work Experience</p>
                  <p className="mt-2 text-slate-700">Leadership in optimization, dynamic systems, and collaborative industrial advisory programs.</p>
                </article>
                <article>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Interest Areas</p>
                  <p className="mt-2 text-slate-700">Helicopter dynamics, UAV autonomy, biomechanical analysis, and structural monitoring.</p>
                </article>
              </div>
            </section>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
              {ctas.map((cta) => (
                <Link
                  key={cta.id}
                  href={cta.href}
                  className="bg-sky-800 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-sky-900 transition shadow-md hover:shadow-lg"
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}