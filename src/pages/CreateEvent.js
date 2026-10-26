import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import StateMessage from "../components/common/StateMessage";

import { notify } from "../utils/notify";
import { getErrorMessage } from "../utils/errors";

import "../styles/pages/lists.css";

const EMPTY = { title: "", description: "", date: "", location: "", capacity: "" };

// POST /events needs title, date and location (lecturers and admins
// only). The old form sent only title and date, so it was rejected
// every time, and the error went to the console.
export default function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const canCreate = user?.role === "lecturer" || user?.role === "admin";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = form.title.trim();
    const location = form.location.trim();
    const when = form.date ? new Date(form.date) : null;

    if (!title || !location || !when || Number.isNaN(when.getTime())) {
      notify.error("Please add a title, a date and time, and a location.");
      return;
    }

    if (when.getTime() <= Date.now()) {
      notify.error("Pick a date and time in the future.");
      return;
    }

    const payload = { title, location, date: when.toISOString() };

    if (form.description.trim()) payload.description = form.description.trim();

    const capacity = Number(form.capacity);
    if (form.capacity !== "" && Number.isInteger(capacity) && capacity > 0) {
      payload.capacity = capacity;
    }

    setSubmitting(true);

    try {
      await API.post("/events", payload);
      notify.success("Event created.");
      navigate("/events");
    } catch (err) {
      notify.error(getErrorMessage(err, "We couldn't create the event."));
    } finally {
      setSubmitting(false);
    }
  };

  if (!canCreate) {
    return (
      <div className="list-page">
        <StateMessage
          title="Only lecturers and admins can create events"
          text="You can still see and RSVP to events on the events page."
          action={
            <Link className="list-btn" to="/events">
              Back to events
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="list-page">
      <div className="list-page-header">
        <div>
          <h2>Create event</h2>
          <p>It will show up for everyone at your university.</p>
        </div>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Title</span>
          <input className="list-input" name="title" value={form.title}
            onChange={handleChange} maxLength={150} required />
        </label>

        <label className="form-field">
          <span>Date and time</span>
          <input className="list-input" type="datetime-local" name="date"
            value={form.date} onChange={handleChange} required />
        </label>

        <label className="form-field">
          <span>Location</span>
          <input className="list-input" name="location" value={form.location}
            onChange={handleChange} maxLength={150} required />
        </label>

        <label className="form-field">
          <span>Description (optional)</span>
          <textarea className="list-input" name="description" rows="4"
            value={form.description} onChange={handleChange} />
        </label>

        <label className="form-field">
          <span>Capacity (optional)</span>
          <input className="list-input" type="number" min="1" step="1"
            name="capacity" value={form.capacity} onChange={handleChange} />
        </label>

        <button className="list-btn" type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create event"}
        </button>
      </form>
    </div>
  );
}
