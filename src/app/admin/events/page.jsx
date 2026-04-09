"use client";

import { useCallback, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { addEvent, deleteEvent, getEvents, updateEvent } from "@/services/eventService";

const initialForm = {
  title: "",
  type: "seminar",
  description: "",
  speaker: "",
  location: "",
  eventDate: "",
  eventEndDate: "",
  registrationUrl: "",
  isFeatured: false,
};

export default function AdminEventsPage() {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");

  const fetchEvents = useCallback(() => getEvents({ type: "all" }), []);
  const { data, loading, error, refresh } = useAsyncData(fetchEvents);
  const events = data || [];

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({ ...previous, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      eventDate: form.eventDate ? new Date(form.eventDate).toISOString() : new Date().toISOString(),
      eventEndDate: form.eventEndDate ? new Date(form.eventEndDate).toISOString() : "",
    };

    if (editingId) {
      await updateEvent(editingId, payload);
    } else {
      await addEvent(payload);
    }

    setForm(initialForm);
    setEditingId("");
    await refresh();
  };

  const startEdit = (eventItem) => {
    setEditingId(eventItem.id);
    setForm({
      title: eventItem.title || "",
      type: eventItem.type || "seminar",
      description: eventItem.description || "",
      speaker: eventItem.speaker || "",
      location: eventItem.location || "",
      eventDate: eventItem.eventDate ? new Date(eventItem.eventDate).toISOString().slice(0, 16) : "",
      eventEndDate: eventItem.eventEndDate ? new Date(eventItem.eventEndDate).toISOString().slice(0, 16) : "",
      registrationUrl: eventItem.registrationUrl || "",
      isFeatured: Boolean(eventItem.isFeatured),
    });
  };

  const remove = async (eventId) => {
    await deleteEvent(eventId);
    await refresh();
  };

  return (
    <main className="min-h-screen bg-gray-100 px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Admin: Events</h1>

        <form onSubmit={onSubmit} className="bg-white border border-gray-300 rounded p-6 space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={form.title} onChange={onChange} placeholder="Title" className="bg-white border border-gray-300 p-3 rounded" />
            <select name="type" value={form.type} onChange={onChange} className="bg-white border border-gray-300 p-3 rounded">
              <option value="seminar">seminar</option>
              <option value="event">event</option>
            </select>
          </div>
          <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full bg-white border border-gray-300 p-3 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="speaker" value={form.speaker} onChange={onChange} placeholder="Speaker" className="bg-white border border-gray-300 p-3 rounded" />
            <input name="location" value={form.location} onChange={onChange} placeholder="Location" className="bg-white border border-gray-300 p-3 rounded" />
            <input name="eventDate" type="datetime-local" value={form.eventDate} onChange={onChange} className="bg-white border border-gray-300 p-3 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="eventEndDate" type="datetime-local" value={form.eventEndDate} onChange={onChange} className="bg-white border border-gray-300 p-3 rounded" />
            <input name="registrationUrl" value={form.registrationUrl} onChange={onChange} placeholder="Event URL" className="bg-white border border-gray-300 p-3 rounded" />
          </div>
          <label className="text-sm text-gray-700 flex items-center gap-2"><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={onChange} />Featured</label>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded border border-blue-800 font-semibold hover:bg-blue-800">{editingId ? "Update" : "Add"} Event</button>
            {editingId && <button type="button" onClick={() => { setEditingId(""); setForm(initialForm); }} className="bg-white border border-gray-300 text-gray-900 px-6 py-2 rounded font-semibold hover:bg-gray-100">Cancel</button>}
          </div>
        </form>

        {loading && <p className="text-gray-600">Loading events...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="space-y-4">
          {events.map((eventItem) => (
            <article key={eventItem.id} className="bg-white border border-gray-300 rounded p-4">
              <h2 className="text-xl font-semibold text-gray-900">{eventItem.title}</h2>
              <p className="text-sm text-gray-700">{eventItem.type} • {new Date(eventItem.eventDate).toLocaleString()}</p>
              <div className="mt-3 flex gap-3">
                <button type="button" onClick={() => startEdit(eventItem)} className="text-blue-700 font-semibold hover:text-blue-800">Edit</button>
                <button type="button" onClick={() => remove(eventItem.id)} className="text-gray-700 font-semibold hover:text-gray-900">Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
