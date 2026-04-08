"use client";

import { useCallback, useMemo, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getEvents } from "@/services/eventService";

function formatDate(date) {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function monthLabel(monthDate) {
  return monthDate.toLocaleString(undefined, { month: "long", year: "numeric" });
}

function startOfMonth(value) {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarDays(monthDate) {
  const monthStart = startOfMonth(monthDate);
  const startWeekDay = monthStart.getDay();
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - startWeekDay);

  return Array.from({ length: 42 }).map((_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return {
      date: day,
      isCurrentMonth: day.getMonth() === monthDate.getMonth(),
    };
  });
}

function previewText(value, maxLength = 140) {
  if (!value) {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

export default function EventsPage() {
  const fetchEvents = useCallback(() => getEvents(), []);
  const { data, loading, error } = useAsyncData(fetchEvents);
  const events = useMemo(() => data || [], [data]);

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));
  const [showCalendar, setShowCalendar] = useState(false);

  const selectedMonth = useMemo(() => startOfMonth(selectedDate), [selectedDate]);
  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth), [calendarMonth]);
  const currentMonth = useMemo(() => startOfMonth(new Date()), []);
  const isCurrentMonthSelected = useMemo(
    () =>
      selectedMonth.getFullYear() === currentMonth.getFullYear() &&
      selectedMonth.getMonth() === currentMonth.getMonth(),
    [selectedMonth, currentMonth]
  );

  const latestTop3 = useMemo(() => events.slice(0, 3), [events]);

  const monthEvents = useMemo(
    () =>
      events.filter((eventItem) => {
        const date = new Date(eventItem.eventDate);
        return date.getFullYear() === selectedMonth.getFullYear() && date.getMonth() === selectedMonth.getMonth();
      }),
    [events, selectedMonth]
  );

  const setToToday = () => {
    const now = new Date();
    setSelectedDate(now);
    setCalendarMonth(startOfMonth(now));
    setShowCalendar(false);
  };

  const shiftSelectedMonth = (offset) => {
    const next = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + offset, 1);
    setSelectedDate(next);
    setCalendarMonth(next);
    setShowCalendar(false);
  };

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
          <div className="pt-6 border-t border-slate-200 relative">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <button
                type="button"
                onClick={() => shiftSelectedMonth(-1)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                aria-label="Previous month"
              >
                &lt;
              </button>
              <button
                type="button"
                onClick={setToToday}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setShowCalendar((previous) => !previous)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900"
              >
                {monthLabel(selectedMonth)}
              </button>
              <button
                type="button"
                onClick={() => shiftSelectedMonth(1)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                aria-label="Next month"
              >
                &gt;
              </button>
            </div>

            {showCalendar && (
              <div className="z-20 absolute top-16 left-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl w-[320px]">
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={() => setCalendarMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1))}
                    className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100"
                  >
                    &lt;
                  </button>
                  <p className="font-semibold text-slate-900">{monthLabel(calendarMonth)}</p>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1))}
                    className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100"
                  >
                    &gt;
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-[0.12em] text-slate-500 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <span key={`${day}-${index}`}>{day}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((item) => (
                    <button
                      key={`${item.date.toISOString()}-${item.isCurrentMonth}`}
                      type="button"
                      onClick={() => {
                        setSelectedDate(item.date);
                        setCalendarMonth(startOfMonth(item.date));
                        setShowCalendar(false);
                      }}
                      className={`h-9 rounded-md text-sm transition ${
                        isSameDay(item.date, selectedDate)
                          ? "bg-blue-600 text-white font-semibold"
                          : item.isCurrentMonth
                            ? "text-slate-800 hover:bg-slate-100"
                            : "text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {item.date.getDate()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-slate-600 mb-4">Showing events for {monthLabel(selectedMonth)}.</p>

            {monthEvents.length === 0 ? (
              <p className="text-sm text-slate-600">No events found for this month.</p>
            ) : (
              <div className="space-y-4">
                {monthEvents.map((eventItem) => (
                  <article key={`month-${eventItem.id}`} className="paper-card rounded-xl p-4">
                    <h3 className="text-lg text-slate-900">{eventItem.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {eventItem.eventEndDate
                        ? `${formatDate(eventItem.eventDate)} - ${formatDate(eventItem.eventEndDate)}`
                        : formatDate(eventItem.eventDate)}
                    </p>
                    {eventItem.registrationUrl && (
                      <a
                        className="inline-flex mt-3 items-center rounded-full bg-sky-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-900"
                        href={eventItem.registrationUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open Event
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>

          {isCurrentMonthSelected && (
            <>
              <h2 className="text-2xl md:text-3xl text-slate-900">Latest Top 3 Events</h2>
              {latestTop3.map((eventItem) => (
                <article key={eventItem.id} className="paper-card rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-sky-700 font-bold">
                        {eventItem.type}
                        {eventItem.isFeatured ? " • featured" : ""}
                      </p>
                      <h2 className="text-2xl text-slate-900 mt-2">{eventItem.title}</h2>
                    </div>
                    <p className="text-sm text-slate-500">
                      {eventItem.eventEndDate
                        ? `${formatDate(eventItem.eventDate)} - ${formatDate(eventItem.eventEndDate)}`
                        : formatDate(eventItem.eventDate)}
                    </p>
                  </div>
                  <p className="mt-4 max-w-3xl text-sm md:text-[15px] leading-7 text-slate-600">
                    {previewText(eventItem.description)}
                  </p>
                  <p className="mt-3 text-sm text-slate-600">Speaker: {eventItem.speaker}</p>
                  <p className="text-sm text-slate-600">Location: {eventItem.location}</p>
                  {eventItem.registrationUrl && (
                    <a
                      className="inline-flex mt-4 items-center rounded-full bg-sky-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-900"
                      href={eventItem.registrationUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Event
                    </a>
                  )}
                </article>
              ))}
            </>
          )}
        </div>
      )}
    </main>
  );
}
