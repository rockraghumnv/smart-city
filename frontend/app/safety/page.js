"use client";

import { useEffect, useState } from "react";
import { Plus, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function CitySafetyPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", eventDate: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [joining, setJoining] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/safety/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (e) {
      setError("Could not load events.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/safety/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create event");
      setSuccess("Event created!");
      setShowCreate(false);
      setForm({ name: "", location: "", eventDate: "", description: "" });
      fetchEvents();
    } catch (e) {
      setError("Could not create event.");
    } finally {
      setCreating(false);
    }
  }

  async function handleJoin(eventId) {
    setJoining(eventId);
    setError("");
    try {
      const res = await fetch(`/api/safety/events/${eventId}/join`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to join event");
      fetchEvents();
    } catch (e) {
      setError("Could not join event.");
    } finally {
      setJoining("");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-0 md:p-8">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">City Safety Events</h1>
          <button
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="w-5 h-5 mr-2" /> Create Event
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No upcoming events.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-semibold text-lg text-gray-900">{event.name}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPin className="w-4 h-4 mr-1" /> {event.location}
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <Calendar className="w-4 h-4 mr-1" /> {formatDate(event.eventDate)}
                  </div>
                  <div className="text-gray-700 text-sm mb-4">{event.description}</div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="w-4 h-4 mr-1" /> {event.attendees?.length || 0} joined
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/safety/event/${event._id}`} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 font-medium text-sm">Details</Link>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm disabled:opacity-50"
                      onClick={() => handleJoin(event._id)}
                      disabled={joining === event._id}
                    >
                      {joining === event._id ? "Joining..." : "Join"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Event</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  required
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full border px-3 py-2 rounded"
                  required
                  value={form.eventDate}
                  onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  required
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={creating}>{creating ? "Creating..." : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
