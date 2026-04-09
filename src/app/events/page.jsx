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
    <main className="page-shell text-gray-800">
      <div className="section-shell max-w-5xl mb-10 glass-card relative overflow-hidden rounded p-6 md:p-10 reveal-up">
        <div className="absolute -top-12 -right-8 h-44 w-44 hero-glow-blue" />
        <div className="absolute -bottom-14 -left-8 h-36 w-36 hero-glow-gold" />
        <p className="text-xs uppercase tracking-[0.12em] text-gray-600">Events and Academic Sessions</p>
        <h1 className="text-4xl md:text-5xl text-gray-900 mt-2">Seminars and Events</h1>
        <p className="mt-4 text-lg text-gray-700">
          Upcoming and recent interactions loaded directly from the local events feed.
        </p>
      </div>

      {loading && <p className="section-shell max-w-5xl text-gray-600">Loading events...</p>}
      {error && <p className="section-shell max-w-5xl text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="section-shell max-w-5xl space-y-6">
          <div className="pt-6 border-t border-gray-300 relative">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <button
                type="button"
                onClick={() => shiftSelectedMonth(-1)}
                className="rounded border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                aria-label="Previous month"
              >
                &lt;
              </button>
              <button
                type="button"
                onClick={setToToday}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setShowCalendar((previous) => !previous)}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
              >
                {monthLabel(selectedMonth)}
              </button>
              <button
                type="button"
                onClick={() => shiftSelectedMonth(1)}
                className="rounded border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                aria-label="Next month"
              >
                &gt;
              </button>
            </div>

            {showCalendar && (
              <div className="z-20 absolute top-16 left-0 rounded border border-gray-300 bg-white p-4 w-[320px]">
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={() => setCalendarMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1))}
                    className="rounded px-2 py-1 text-gray-700 hover:bg-gray-100"
                  >
                    &lt;
                  </button>
                  <p className="font-semibold text-gray-900">{monthLabel(calendarMonth)}</p>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1))}
                    className="rounded px-2 py-1 text-gray-700 hover:bg-gray-100"
                  >
                    &gt;
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-[0.1em] text-gray-600 mb-2">
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
                      className={`h-9 rounded text-sm ${
                        isSameDay(item.date, selectedDate)
                          ? "bg-blue-700 text-white font-semibold"
                          : item.isCurrentMonth
                            ? "text-gray-800 hover:bg-gray-100"
                            : "text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      {item.date.getDate()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-gray-700 mb-4">Showing events for {monthLabel(selectedMonth)}.</p>

            {monthEvents.length === 0 ? (
              <p className="text-sm text-gray-700">No events found for this month.</p>
            ) : (
              <div className="space-y-4">
                {monthEvents.map((eventItem) => (
                  <article key={`month-${eventItem.id}`} className="paper-card rounded p-4">
                    <h3 className="text-lg text-gray-900">{eventItem.title}</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      {eventItem.eventEndDate
                        ? `${formatDate(eventItem.eventDate)} - ${formatDate(eventItem.eventEndDate)}`
                        : formatDate(eventItem.eventDate)}
                    </p>
                    {eventItem.registrationUrl && (
                      <a
                        className="inline-flex mt-3 items-center rounded border border-blue-800 bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
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
              <h2 className="text-2xl md:text-3xl text-gray-900">Latest Top 3 Events</h2>
              {latestTop3.map((eventItem) => (
                <article key={eventItem.id} className="paper-card rounded p-6">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-xs uppercase tracking-[0.1em] text-blue-700 font-semibold">
                        {eventItem.type}
                        {eventItem.isFeatured ? " • featured" : ""}
                      </p>
                      <h2 className="text-2xl text-gray-900 mt-2">{eventItem.title}</h2>
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
                  <p className="mt-3 text-sm text-gray-700">Speaker: {eventItem.speaker}</p>
                  <p className="text-sm text-gray-700">Location: {eventItem.location}</p>
                  {eventItem.registrationUrl && (
                    <a
                      className="inline-flex mt-4 items-center rounded border border-blue-800 bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
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
