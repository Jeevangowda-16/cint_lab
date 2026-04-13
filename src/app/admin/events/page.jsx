"use client";

import { useCallback, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { addEvent, deleteEvent, getEvents, updateEvent } from "@/services/eventService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialForm = {
  title: "",
  type: "seminar",
  description: "",
  speaker: "",
  location: "",
  eventDate: "",
  eventEndDate: "",
  registrationUrl: "",
  imageUrl: "",
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
      imageUrl: eventItem.imageUrl || "",
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

        <Card className="mb-8">
          <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="title" value={form.title} onChange={onChange} placeholder="Title" />
            <Select value={form.type} onValueChange={(value) => setForm((previous) => ({ ...previous, type: value }))}>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seminar">seminar</SelectItem>
                <SelectItem value="event">event</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea name="description" value={form.description} onChange={onChange} placeholder="Description" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input name="speaker" value={form.speaker} onChange={onChange} placeholder="Speaker" />
            <Input name="location" value={form.location} onChange={onChange} placeholder="Location" />
            <Input name="eventDate" type="datetime-local" value={form.eventDate} onChange={onChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="eventEndDate" type="datetime-local" value={form.eventEndDate} onChange={onChange} />
            <Input name="registrationUrl" value={form.registrationUrl} onChange={onChange} placeholder="Event URL" />
          </div>
          <Input name="imageUrl" value={form.imageUrl} onChange={onChange} placeholder="Photo URL" />
          <label className="text-sm text-gray-700 flex items-center gap-2"><Checkbox name="isFeatured" checked={form.isFeatured} onChange={onChange} />Featured</label>
          <div className="flex gap-3">
            <Button type="submit">{editingId ? "Update" : "Add"} Event</Button>
            {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(""); setForm(initialForm); }}>Cancel</Button>}
          </div>
        </form>
          </CardContent>
        </Card>

        {loading && <p className="text-gray-600">Loading events...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="space-y-4">
          {events.map((eventItem) => (
            <Card key={eventItem.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{eventItem.title}</CardTitle>
              </CardHeader>
              <CardContent>
              {eventItem.imageUrl && (
                <div className="mb-4 h-40 w-full overflow-hidden rounded border border-gray-300 bg-white md:w-72">
                  <img
                    src={eventItem.imageUrl}
                    alt={eventItem.title}
                    className="h-full w-full object-contain p-2"
                    loading="lazy"
                  />
                </div>
              )}
              <p className="text-sm text-gray-700">
                {eventItem.type}
                {eventItem.isFeatured ? " • featured" : ""}
                {" • "}
                {eventItem.eventEndDate
                  ? `${new Date(eventItem.eventDate).toLocaleString()} - ${new Date(eventItem.eventEndDate).toLocaleString()}`
                  : new Date(eventItem.eventDate).toLocaleString()}
              </p>
              {eventItem.description && <p className="mt-2 text-sm text-gray-700">{eventItem.description}</p>}
              {eventItem.speaker && <p className="mt-2 text-sm text-gray-700">Speaker: {eventItem.speaker}</p>}
              {eventItem.location && <p className="text-sm text-gray-700">Location: {eventItem.location}</p>}
              {eventItem.registrationUrl && (
                <a
                  href={eventItem.registrationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center rounded border border-blue-800 bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Open Event
                </a>
              )}
              <div className="mt-3 flex gap-3">
                <Button type="button" variant="outline" onClick={() => startEdit(eventItem)}>Edit</Button>
                <Button type="button" variant="outline" onClick={() => remove(eventItem.id)}>Delete</Button>
              </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
