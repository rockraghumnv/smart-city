"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Upload, Send, Loader2 } from "lucide-react";
import Link from "next/link";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params.id;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("text");
  const [textContent, setTextContent] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  async function fetchEvent() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/safety/events`);
      if (!res.ok) throw new Error("Failed to fetch event");
      const data = await res.json();
      const found = data.find(e => e._id === eventId);
      setEvent(found);
    } catch (e) {
      setError("Could not load event details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReportSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("reportType", reportType);
      if (reportType === "image" && file) {
        formData.append("file", file);
      }
      if (reportType === "text") {
        formData.append("textContent", textContent);
      }
      const res = await fetch(`/api/safety/reports/${eventId}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to submit report");
      const data = await res.json();
      setResult(data);
      setTextContent("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      setError("Could not submit report.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-0 md:p-8">
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex items-center mb-6">
          <Link href="/safety" className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading event...</div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        ) : !event ? (
          <div className="text-center py-12 text-gray-500">Event not found.</div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="mb-4">
              <div className="text-xl font-semibold text-gray-900 mb-1">{event.name}</div>
              <div className="text-gray-600 mb-1">{event.location}</div>
              <div className="text-gray-600 mb-2">{formatDate(event.eventDate)}</div>
              <div className="text-gray-700 text-sm mb-2">{event.description}</div>
            </div>
            <hr className="my-4" />
            <h2 className="text-lg font-bold mb-2">Submit Safety Report</h2>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div className="flex gap-4 mb-2">
                <label className={`px-3 py-2 rounded cursor-pointer border ${reportType === "text" ? "bg-blue-100 border-blue-400" : "border-gray-300"}`}>
                  <input type="radio" name="reportType" value="text" checked={reportType === "text"} onChange={() => setReportType("text")}/>
                  <span className="ml-2">Text</span>
                </label>
                <label className={`px-3 py-2 rounded cursor-pointer border ${reportType === "image" ? "bg-blue-100 border-blue-400" : "border-gray-300"}`}>
                  <input type="radio" name="reportType" value="image" checked={reportType === "image"} onChange={() => setReportType("image")}/>
                  <span className="ml-2">Image</span>
                </label>
              </div>
              {reportType === "text" && (
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Describe the safety issue..."
                  required
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                />
              )}
              {reportType === "image" && (
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border px-3 py-2 rounded"
                  required
                  ref={fileInputRef}
                  onChange={e => setFile(e.target.files[0])}
                />
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} Submit Report
              </button>
            </form>
            {result && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded p-4">
                <div className="font-bold text-green-800 mb-1">{result.message}</div>
                <div className="text-green-700 mb-1">AI Analysis: {result.ai_analysis}</div>
                {result.action_taken && (
                  <div className="text-green-700 text-sm">Action: {result.action_taken.tool_called} - {result.action_taken.details}</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
