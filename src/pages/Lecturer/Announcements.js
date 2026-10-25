import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaBullhorn, FaCalendarAlt, FaUsers } from "react-icons/fa";

import StateMessage from "../../components/common/StateMessage";
import useMyCourses from "../../hooks/useMyCourses";
import announcementService from "../../services/announcementService";

import { getErrorMessage } from "../../utils/errors";
import { notify } from "../../utils/notify";
import { formatDate, unitLabel } from "../../utils/format";

import "./Announcements.css";
import "../../styles/pages/lists.css";

const EMPTY_FORM = { title: "", message: "", courseId: "" };

// Announcements posted to students. Reads and writes the real
// /community/announcements endpoints: an announcement with no course is
// visible across the poster's university, one with a course is scoped to
// that course. Nothing is shown as "published" unless the server
// accepted it.
const Announcements = () => {
  const { courses } = useMyCourses();

  const [form, setForm] = useState(EMPTY_FORM);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await announcementService.getAnnouncements();
      setItems(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setItems([]);
      setError(getErrorMessage(err, "We couldn't load announcements."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const courseById = useMemo(
    () => new Map(courses.map((course) => [String(course._id), course])),
    [courses]
  );

  const audienceLabel = (item) => {
    if (!item.courseId) return "Everyone at the university";
    const course = courseById.get(String(item.courseId));
    return course ? unitLabel(course) : "A specific unit";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title: form.title.trim(),
      body: form.message.trim(),
    };

    if (form.courseId) payload.courseId = form.courseId;

    if (!payload.title || !payload.body) {
      notify.error("Please add a title and a message.");
      return;
    }

    setSubmitting(true);

    try {
      await announcementService.createAnnouncement(payload);
      notify.success("Announcement published.");
      setForm(EMPTY_FORM);
      await load();
    } catch (err) {
      notify.error(getErrorMessage(err, "We couldn't publish your announcement."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="announcements-page">
      <main className="announcements-content">
        <div className="announcements-header">
          <h1>Class Announcements</h1>
          <p>Communicate important academic updates with students.</p>
        </div>

        <form className="announcement-form" onSubmit={handleSubmit}>
          <div className="announcement-group">
            <label htmlFor="announcement-title">
              <FaBullhorn />
              Title
            </label>

            <input
              id="announcement-title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Announcement title"
              maxLength={150}
              required
            />
          </div>

          <div className="announcement-group">
            <label htmlFor="announcement-message">Message</label>

            <textarea
              id="announcement-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write announcement..."
              rows="5"
              required
            />
          </div>

          <div className="announcement-group">
            <label htmlFor="announcement-audience">
              <FaUsers />
              Audience
            </label>

            <select
              id="announcement-audience"
              name="courseId"
              value={form.courseId}
              onChange={handleChange}
            >
              <option value="">Everyone at my university</option>

              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {unitLabel(course)}
                </option>
              ))}
            </select>
          </div>

          <button
            className="publish-announcement"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Publishing..." : "Publish Announcement"}
          </button>
        </form>

        <div className="announcement-list">
          {loading ? (
            <StateMessage kind="loading" text="Loading announcements..." />
          ) : error ? (
            <StateMessage
              kind="error"
              title="Announcements unavailable"
              text={error}
              action={
                <button type="button" className="list-btn" onClick={load}>
                  Try again
                </button>
              }
            />
          ) : items.length === 0 ? (
            <StateMessage
              title="No announcements yet"
              text="Announcements you publish will appear here."
            />
          ) : (
            items.map((item) => (
              <div className="announcement-card" key={item._id}>
                <div className="announcement-card-header">
                  <FaBullhorn />
                  <h3>{item.title}</h3>
                </div>

                <p>{item.body}</p>

                <div className="announcement-meta">
                  <span>
                    <FaUsers />
                    {audienceLabel(item)}
                  </span>

                  <span>
                    <FaCalendarAlt />
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Announcements;
