"use client";

import { useCallback } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getEvents } from "@/services/eventService";

function formatDate(date) {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function EventsPage() {
  const fetchEvents = useCallback(() => getEvents(), []);
  const { data, loading, error } = useAsyncData(fetchEvents);
  const events = data || [];

  return (
    <main className="page-shell text-slate-800">
      <div className="section-shell max-w-5xl mb-10 glass-card relative overflow-hidden rounded-3xl p-6 md:p-10 reveal-up">
        <div className="absolute -top-12 -right-8 h-44 w-44 hero-glow-blue" />
        <div className="absolute -bottom-14 -left-8 h-36 w-36 hero-glow-gold" />
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Events and Academic Sessions</p>
        <h1 className="text-4xl md:text-5xl text-slate-900 tracking-tight mt-2">Seminars and Events</h1>
        <p className="mt-4 text-lg text-slate-600">
          Upcoming and recent interactions loaded directly from the Firestore events feed.
        </p>
      </div>

      {loading && <p className="section-shell max-w-5xl text-gray-600">Loading events...</p>}
      {error && <p className="section-shell max-w-5xl text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="section-shell max-w-5xl space-y-6">
          <h2 className="text-2xl md:text-3xl text-slate-900">Live Lab Event Feed</h2>
          {events.map((eventItem) => (
            <article key={eventItem.id} className="paper-card rounded-2xl p-6">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-sky-700 font-bold">
                    {eventItem.type}
                    {eventItem.isFeatured ? " • featured" : ""}
                  </p>
                  <h2 className="text-2xl text-slate-900 mt-2">{eventItem.title}</h2>
                </div>
                <p className="text-sm text-slate-500">{formatDate(eventItem.eventDate)}</p>
              </div>
              <p className="mt-4 text-slate-700">{eventItem.description}</p>
              <p className="mt-3 text-sm text-slate-600">Speaker: {eventItem.speaker}</p>
              <p className="text-sm text-slate-600">Location: {eventItem.location}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
