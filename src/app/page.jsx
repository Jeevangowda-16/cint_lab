"use client";

import { useCallback, useMemo } from "react";
import Image from "next/image";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getEvents } from "@/services/eventService";
import { getLabOverview } from "@/services/labService";

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

  const latestEvents = useMemo(() => (eventData || []).slice(0, 3), [eventData]);

  return (
    <main className="page-shell text-slate-800">
      <div className="section-shell space-y-12">
        {loading && <p className="text-gray-600">Loading homepage...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <section className="rounded border border-gray-300 bg-white p-6 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
                <div className="text-left">
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-600">Department of Aerospace Engineering, IISc</p>
                  <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 leading-[1.15]">
                    {overview?.title || "CINT Lab"}
                  </h1>
                  <p className="mt-5 max-w-2xl text-base md:text-lg leading-7 text-gray-700">
                    {overview?.mission || "Computing Intelligence and Networked Technologies research in autonomy, control, and aerospace systems."}
                  </p>
                </div>

                <div className="lg:justify-self-end w-full max-w-md">
                  <div className="overflow-hidden rounded border border-gray-300 bg-gray-100">
                    <Image
                      src="/headshots/sn-omkar.jpg"
                      alt="SN Omkar"
                      width={720}
                      height={900}
                      priority
                      className="h-auto w-full object-cover"
                    />
                  </div>
                  <p className="mt-3 text-center text-sm text-gray-600">SN Omkar</p>
                </div>
              </div>
            </section>

            <section className="rounded border border-gray-300 bg-white p-6 md:p-8">
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-600">Latest events</p>
                  <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-gray-900">Latest Top 3 Events</h2>
                </div>
              </div>

              {latestEvents.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {latestEvents.map((eventItem) => (
                    <article key={eventItem.id} className="rounded border bg-gray-50 p-4 md:p-6 border border-gray-300">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="text-xs uppercase tracking-[0.15em] text-gray-600">{eventItem.type}</p>
                          <h3 className="mt-2 text-xl md:text-2xl font-semibold text-gray-900 leading-tight">{eventItem.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          {eventItem.eventEndDate
                            ? `${formatDate(eventItem.eventDate)} - ${formatDate(eventItem.eventEndDate)}`
                            : formatDate(eventItem.eventDate)}
                        </p>
                      </div>

                      <p className="mt-4 max-w-3xl text-sm md:text-[15px] leading-7 text-gray-700">
                        {previewText(eventItem.description)}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-700">
                        <p>Speaker: {eventItem.speaker || "TBA"}</p>
                        <p>Location: {eventItem.location || "IISc Aerospace Engineering"}</p>
                        {eventItem.registrationUrl && (
                          <a
                            href={eventItem.registrationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded border border-blue-800 bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                          >
                            Open Event
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-gray-700">No events available.</p>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
