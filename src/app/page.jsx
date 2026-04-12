"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getEvents } from "@/services/eventService";
import { getLabOverview } from "@/services/labService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function previewText(value, maxLength = 100) {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

export default function HomePage() {
  const fetchOverview = useCallback(() => getLabOverview(), []);
  const { data: overview, loading, error } = useAsyncData(fetchOverview);

  const fetchEvents = useCallback(() => getEvents(), []);
  const { data: eventData } = useAsyncData(fetchEvents);

  const allEvents = useMemo(() => eventData || [], [eventData]);

  const [pubIndex, setPubIndex] = useState(0);
  const visibleEvents = useMemo(
    () => allEvents.slice(pubIndex, pubIndex + 3),
    [allEvents, pubIndex]
  );

  const canGoPrev = pubIndex > 0;
  const canGoNext = pubIndex + 3 < allEvents.length;

  return (
    <main className="page-shell text-slate-800 px-4 md:px-6 lg:px-10">
      <div className="section-shell space-y-20 md:space-y-24">

        {loading && <p className="text-gray-600">Loading homepage...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>

            {/* HERO */}
            <Card className="rounded-2xl border border-gray-200/70 bg-white/60 backdrop-blur-sm shadow-sm">
              <CardContent className="px-8 md:px-12 py-12 md:py-14 flex flex-col items-start gap-6 max-w-4xl">

                <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                  Department of Aerospace Engineering · IISc Bengaluru
                </p>

                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight tracking-tight">
                  {overview?.title || "CINT Lab"}
                </h1>

                <p className="max-w-2xl text-base md:text-lg text-gray-600 leading-relaxed">
                  {overview?.mission}
                </p>

                {/* 🔥 ADD THIS BLOCK HERE */}
                <div className="flex gap-2 flex-wrap pt-2">
                  <Badge variant="secondary">AI</Badge>
                  <Badge variant="secondary">Autonomous Systems</Badge>
                  <Badge variant="secondary">UAV</Badge>
                </div>

                <div className="flex gap-4 pt-2">
                  <Button className="transition hover:scale-[1.03] active:scale-[0.97]" asChild>
                    <Link href="/projects">Explore Projects</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/team">Teams</Link>
                  </Button>
                </div>

              </CardContent>
            </Card>

            {/* AIRPLANE */}
            <Card className="fade-in fade-in-delay card-premium">
              <CardContent className="p-0">
                <div className="w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden">
                  <Image
                    src="/headshots/airplane.jpg"
                    alt="CINT Lab Aircraft"
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* PROFESSOR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 fade-in fade-in-delay-2">

              {/* IMAGE */}
              <Card className="card-premium hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col items-center gap-3">
                  <div className="w-full max-w-xs aspect-[4/5] overflow-hidden rounded-xl border border-gray-200">
                    <Image
                      src="/headshots/director.jpg"
                      alt="Prof. SN Omkar"
                      width={480}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Prof. SN Omkar
                  </p>
                  <p className="text-xs text-gray-500">
                    Chief Research Scientist & Head of CINT Lab
                  </p>
                </CardContent>
              </Card>

              {/* TEXT */}
              <Card className="card-premium hover:-translate-y-1">
                <CardContent className="p-8 flex flex-col gap-5 max-w-xl">

                  <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                    Dr. S. N. Omkar
                  </h2>

                  <p className="text-sm font-medium text-blue-700">
                    Chief Research Scientist & Head of CINT Lab
                  </p>
                  <div className="pt-1">
                    <Badge variant="secondary">Aerospace AI</Badge>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    Dr. S. N. Omkar is a Chief Research Scientist in the Department of Aerospace Engineering at the Indian Institute of Science (IISc), Bangalore. His research spans multiple domains within aerospace engineering, with a particular focus on unmanned air vehicles, autonomous navigation systems, and intelligent control mechanisms.
                  </p>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    His research interests include helicopter dynamics, satellite image processing, biomechanics, and composite design optimization. His pioneering work in UAV technology and autonomous navigation has contributed significantly to advancing aerial robotics and intelligent aerospace systems.
                  </p>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    He also leads research in structural health monitoring, applying advanced computational methods to ensure the safety and reliability of aerospace structures. Dr. Omkar actively contributes to interdisciplinary innovation and mentoring future researchers.
                  </p>

                </CardContent>
              </Card>

            </div>

            {/* DIVIDER */}
            <div className="h-px bg-gray-200 w-full" />

            {/* PUBLICATIONS */}
            <section className="space-y-6 fade-in">

              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
                  Recent Publications & News
                </h2>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPubIndex((i) => Math.max(0, i - 3))}
                    disabled={!canGoPrev}
                  >
                    ←
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setPubIndex((i) =>
                        Math.min(allEvents.length - 3, i + 3)
                      )
                    }
                    disabled={!canGoNext}
                  >
                    →
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {visibleEvents.map((eventItem) => (
                  <Card
                    key={eventItem.id}
                    className="card-premium hover:-translate-y-[3px]"
                  >
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold">
                        {eventItem.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="text-sm text-gray-600 space-y-3">
                      <p>{previewText(eventItem.description)}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(eventItem.eventDate)}
                      </p>

                      {eventItem.registrationUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={eventItem.registrationUrl}>
                            Open Event
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

            </section>

          </>
        )}
      </div>
    </main>
  );
}