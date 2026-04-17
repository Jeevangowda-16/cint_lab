"use client";

import { useCallback, useMemo, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getEvents } from "@/services/eventService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

function eventTimingStatus(eventItem, now = new Date()) {
  const start = new Date(eventItem.eventDate);
  const end = eventItem.eventEndDate ? new Date(eventItem.eventEndDate) : start;

  if (start <= now && now <= end) {
    return "current";
  }

  if (start > now) {
    return "future";
  }

  return "past";
}

export default function EventsPage() {
  const fetchEvents = useCallback(() => getEvents(), []);
  const { data, loading, error } = useAsyncData(fetchEvents);
  const events = useMemo(() => data || [], [data]);
  const [timingFilter, setTimingFilter] = useState("current");
  const [selectedMonth, setSelectedMonth] = useState(() => startOfMonth(new Date()));
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));
  const [showCalendar, setShowCalendar] = useState(false);

  const now = useMemo(() => new Date(), []);
  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth), [calendarMonth]);

  const latestTop3 = useMemo(() => events.slice(0, 3), [events]);

  const currentEvents = useMemo(
    () =>
      events.filter((eventItem) => {
        const date = new Date(eventItem.eventDate);
        return date.getFullYear() === selectedMonth.getFullYear() && date.getMonth() === selectedMonth.getMonth();
      }),
    [events, selectedMonth]
  );

  const futureEvents = useMemo(
    () =>
      events
        .filter((eventItem) => new Date(eventItem.eventDate) > now)
        .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()),
    [events, now]
  );

  const pastEvents = useMemo(
    () =>
      events.filter((eventItem) => {
        const endDate = eventItem.eventEndDate ? new Date(eventItem.eventEndDate) : new Date(eventItem.eventDate);
        return endDate < now;
      }),
    [events, now]
  );

  const displayedEvents = useMemo(() => {
    if (timingFilter === "future") {
      return futureEvents;
    }

    if (timingFilter === "past") {
      return pastEvents;
    }

    return currentEvents;
  }, [timingFilter, currentEvents, futureEvents, pastEvents]);

  const setToToday = () => {
    const today = startOfMonth(new Date());
    setSelectedMonth(today);
    setCalendarMonth(today);
    setShowCalendar(false);
  };

  const shiftSelectedMonth = (offset) => {
    const next = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + offset, 1);
    setSelectedMonth(next);
    setCalendarMonth(next);
    setShowCalendar(false);
  };

  return (
    <main className="page-shell text-gray-800">
      <div className="section-shell max-w-5xl mb-10 glass-card relative overflow-hidden rounded p-6 md:p-10 reveal-up">
        <div className="absolute -top-12 -right-8 h-44 w-44 hero-glow-blue" />
        <div className="absolute -bottom-14 -left-8 h-36 w-36 hero-glow-gold" />
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Events and Academic Sessions</p>
        <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight mt-2">Seminars and Events</h1>
        <p className="mt-4 text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl">
          Upcoming and recent interactions loaded directly from the local events feed.
        </p>
      </div>

      {loading && <p className="section-shell max-w-5xl text-gray-600">Loading events...</p>}
      {error && <p className="section-shell max-w-5xl text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="section-shell max-w-5xl space-y-6">
          <div className="pt-6 border-t border-gray-300 relative">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-gray-700">Showing events for {monthLabel(selectedMonth)}.</p>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  type="button"
                  onClick={() => shiftSelectedMonth(-1)}
                  variant="outline"
                  className="px-3 py-2 text-sm"
                  aria-label="Previous month"
                >
                  &lt;
                </Button>
                <Button
                  type="button"
                  onClick={setToToday}
                  variant="outline"
                  className="px-4 py-2 text-sm"
                >
                  Today
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowCalendar((previous) => !previous)}
                  variant="outline"
                  className="px-4 py-2 text-sm text-gray-900"
                >
                  {monthLabel(selectedMonth)}
                </Button>
                <Button
                  type="button"
                  onClick={() => shiftSelectedMonth(1)}
                  variant="outline"
                  className="px-3 py-2 text-sm"
                  aria-label="Next month"
                >
                  &gt;
                </Button>
              </div>
            </div>

            {showCalendar && (
              <div className="z-20 absolute right-0 top-16 rounded border border-gray-300 bg-white p-4 w-[320px]">
                <div className="flex items-center justify-between mb-3">
                  <Button
                    type="button"
                    onClick={() => setCalendarMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1))}
                    variant="ghost"
                    className="px-2 py-1 text-gray-700"
                  >
                    &lt;
                  </Button>
                  <p className="font-semibold text-gray-900">{monthLabel(calendarMonth)}</p>
                  <Button
                    type="button"
                    onClick={() => setCalendarMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1))}
                    variant="ghost"
                    className="px-2 py-1 text-gray-700"
                  >
                    &gt;
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-[0.1em] text-gray-600 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <span key={`${day}-${index}`}>{day}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((item) => (
                    <Button
                      key={`${item.date.toISOString()}-${item.isCurrentMonth}`}
                      type="button"
                      onClick={() => {
                        setSelectedMonth(startOfMonth(item.date));
                        setCalendarMonth(startOfMonth(item.date));
                        setShowCalendar(false);
                      }}
                      variant="ghost"
                      className={`h-9 rounded text-sm ${
                        isSameDay(item.date, selectedMonth)
                          ? "bg-blue-900 text-white font-semibold"
                          : item.isCurrentMonth
                            ? "text-gray-800 hover:bg-gray-100"
                            : "text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      {item.date.getDate()}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <div className="segmented-tabs">
              {[
                { value: "current", label: "Current Events" },
                { value: "future", label: "Future Events" },
                { value: "past", label: "Past Events" },
              ].map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  onClick={() => setTimingFilter(option.value)}
                  variant="ghost"
                  className={`segmented-tab-btn ${
                    timingFilter === option.value
                      ? "segmented-tab-btn-active"
                      : ""
                  }`}
                >
                  {option.label}
                </Button>
              ))}
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-4 capitalize">
              {timingFilter === "current"
                ? `Showing current events for ${monthLabel(selectedMonth)}.`
                : timingFilter === "future"
                  ? "Showing all upcoming events."
                  : "Showing all past events."}
            </p>

            {displayedEvents.length === 0 ? (
              <p className="text-sm text-gray-700">
                {timingFilter === "future"
                  ? "No upcoming events found."
                  : timingFilter === "past"
                    ? "No past events found."
                    : `No current events found for ${monthLabel(selectedMonth)}.`}
              </p>
            ) : (
              <div className="space-y-4">
                {displayedEvents.map((eventItem) => (
                  <Card key={`month-${eventItem.id}`} className="paper-card rounded p-4">
                    <CardContent className="p-0">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg text-gray-900">{eventItem.title}</h3>
                        <p className="text-sm text-gray-700 mt-1">
                          {eventItem.eventEndDate
                            ? `${formatDate(eventItem.eventDate)} - ${formatDate(eventItem.eventEndDate)}`
                            : formatDate(eventItem.eventDate)}
                        </p>
                        {eventItem.registrationUrl && (
                          <Button className="mt-3 bg-blue-900 hover:bg-blue-800" asChild>
                            <a href={eventItem.registrationUrl} target="_blank" rel="noreferrer">
                              Open Event
                            </a>
                          </Button>
                        )}
                      </div>

                      {eventItem.imageUrl && (
                        <div className="h-56 w-full overflow-hidden rounded border border-gray-300 bg-white md:w-80 md:shrink-0">
                          <img
                            src={eventItem.imageUrl}
                            alt={eventItem.title}
                            className="h-full w-full object-contain p-2"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {timingFilter === "current" && (
            <>
              <h2 className="text-2xl md:text-3xl text-gray-900">Latest Top 3 Events</h2>
              {latestTop3.map((eventItem) => (
                <Card key={eventItem.id} className="paper-card rounded p-6">
                  <CardContent className="p-0">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
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
                        <Button className="mt-4 bg-blue-900 hover:bg-blue-800" asChild>
                          <a href={eventItem.registrationUrl} target="_blank" rel="noreferrer">
                            Open Event
                          </a>
                        </Button>
                      )}
                    </div>

                    {eventItem.imageUrl && (
                      <div className="h-56 w-full overflow-hidden rounded border border-gray-300 bg-white md:w-80 md:shrink-0">
                        <img
                          src={eventItem.imageUrl}
                          alt={eventItem.title}
                          className="h-full w-full object-contain p-2"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      )}
    </main>
  );
}
