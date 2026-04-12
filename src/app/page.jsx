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
  const [carouselIndex, setCarouselIndex] = useState(0);
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

            <Card className="rounded-2xl border border-gray-200/70 bg-white/60 backdrop-blur-sm shadow-sm">
              <CardContent className="px-8 md:px-12 py-12 md:py-14">

                {/* 🔥 GRID START */}
                <div className="grid md:grid-cols-2 gap-10 items-center">

                  {/* LEFT SIDE (YOUR EXISTING CONTENT) */}
                  <div className="space-y-6 max-w-xl">

                    <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                      Department of Aerospace Engineering · IISc Bengaluru
                    </p>

                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight tracking-tight mt-2">
                      {overview?.title || "CINT Lab"}
                    </h1>

                    <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-lg">
                      {overview?.mission}
                    </p>

                    <div className="flex gap-2 flex-wrap pt-4">
                      <Badge variant="destructive">AI</Badge>
                      <Badge variant="destructive">Autonomous Systems</Badge>
                      <Badge variant="destructive">UAV</Badge>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button size="lg" className="px-6 py-5 text-base font-medium" asChild>
                        <Link href="/projects">Explore Projects</Link>
                      </Button>
                      <Button size="lg" className="px-6 py-5 text-base font-medium" variant="outline" asChild>
                        <Link href="/team">Meet Our Team</Link>
                      </Button>
                    </div>

                  </div>

                  {/* RIGHT SIDE (NEW IMAGE) */}
                  <div className="hidden md:block">
                    <div className="relative w-full h-[300px] md:h-[350px] rounded-xl overflow-hidden">
                      <Image
                        src="/iisc-aerospace.jpg"
                        alt="Aerospace Department IISc"
                        width={800}
                        height={500}
                        className="w-full h-full object-cover object-center"
                        priority
                      />
                      {/* 🔥 OPTIONAL GRADIENT */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-0" />

                      {/* 🔥 SHADCN BADGE */}
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-black/60 text-white backdrop-blur-sm border-none px-3 py-1">
                          IISc Aerospace Department
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 🔥 GRID END */}

              </CardContent>
            </Card>

            {/* AIRPLANE */}
            <Card className="fade-in fade-in-delay card-premium">
              <CardContent className="p-0">

                <div className="relative w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden">

                  {/* IMAGE SLIDER */}
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${pubIndex * 100}%)`,
                    }}
                  >

                    {[
                      { src: "/headshots/airplane1.jpg", title: "The HT-2 awaiting restoration " },
                      { src: "/headshots/airplane2.jpg", title: "The Hunter after it was restored " },
                      { src: "/headshots/airplane3.jpg", title: "The team of Sukumaran, Murali and Manjunath standing in front of the restored Pushpak" },
                      { src: "/headshots/airplane4.jpg", title: "The Hunter during restoration" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="w-full min-w-full flex-shrink-0 relative h-[420px] md:h-[520px]"
                      >
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />

                        {/* TITLE */}
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-black/60 text-white backdrop-blur-sm">
                            {item.title}
                          </Badge>
                        </div>
                      </div>
                    ))}

                  </div>

                  {/* LEFT BUTTON */}
                  <button
                    onClick={() => setPubIndex((prev) => (prev - 1 + 4) % 4)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full px-3 py-2 shadow"
                  >
                    ←
                  </button>

                  {/* RIGHT BUTTON */}
                  <button
                    onClick={() => setPubIndex((prev) => (prev + 1) % 4)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full px-3 py-2 shadow"
                  >
                    →
                  </button>

                </div>

              </CardContent>
            </Card>

            {/* PROFESSOR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 fade-in fade-in-delay-2">

              {/* IMAGE */}
              <Card className="card-premium hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col items-center gap-3">
                  <div className="w-full flex justify-center items-center rounded-xl border-gray-200 py-6">
                    <Image
                      src="/headshots/director.jpg"
                      alt="Prof. SN Omkar"
                      width={450}
                      height={450}
                      className="object-contain"
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
    </main >
  );
}