import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StateMessage from "../components/common/StateMessage";
import eventService from "../services/eventService";
import { useAuth } from "../context/AuthContext";

import { getErrorMessage } from "../utils/errors";
import { notify } from "../utils/notify";
import { formatDateTime } from "../utils/format";

import "../styles/pages/lists.css";

// Upcoming events at the user's university, from GET /events, with the
// user's own RSVP status from GET /events/:id/my-rsvp.
export default function Events() {
  const { user } = useAuth();
  const canCreate = user?.role === "lecturer" || user?.role === "admin";

  const [events, setEvents] = useState([]);
  const [going, setGoing] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await eventService.getEvents();
      const list = Array.isArray(response?.data) ? response.data : [];

      setEvents(list);

      const statuses = await Promise.allSettled(
        list.map((event) => eventService.getMyRsvp(event._id))
      );

      const next = {};

      statuses.forEach((result, index) => {
        next[list[index]._id] =
          result.status === "fulfilled" && Boolean(result.value?.data);
      });

      setGoing(next);
    } catch (err) {
      setEvents([]);
      setError(getErrorMessage(err, "We couldn't load events."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRsvp = async (event) => {
    setBusyId(event._id);

    try {
      await eventService.rsvp(event._id);
      setGoing((prev) => ({ ...prev, [event._id]: true }));
      notify.success(`You're going to ${event.title}.`);
    } catch (err) {
      notify.error(getErrorMessage(err, "We couldn't save your RSVP."));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="list-page">
      <div className="list-page-header">
        <div>
          <h2>Upcoming Events</h2>
          <p>What's happening at your university.</p>
        </div>

        {canCreate && (
          <Link className="list-btn" to="/events/create">
            Create event
          </Link>
        )}
      </div>

      {loading ? (
        <StateMessage kind="loading" text="Loading events..." />
      ) : error ? (
        <StateMessage
          kind="error"
          title="Events unavailable"
          text={error}
          action={
            <button type="button" className="list-btn" onClick={load}>
              Try again
            </button>
          }
        />
      ) : events.length === 0 ? (
        <StateMessage
          title="No upcoming events"
          text="When your university schedules an event it will show up here."
        />
      ) : (
        <div className="list-stack">
          {events.map((event) => (
            <div className="list-card" key={event._id}>
              <div className="list-card-body">
                <h3>{event.title}</h3>

                {event.description && <p>{event.description}</p>}

                <div className="list-card-meta">
                  <span>{formatDateTime(event.date)}</span>
                  <span>{event.location}</span>
                  {event.capacity ? <span>Capacity {event.capacity}</span> : null}
                </div>
              </div>

              {going[event._id] ? (
                <span className="list-badge">Going</span>
              ) : (
                <button
                  type="button"
                  className="list-btn"
                  disabled={busyId === event._id}
                  onClick={() => handleRsvp(event)}
                >
                  {busyId === event._id ? "Saving..." : "RSVP"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
