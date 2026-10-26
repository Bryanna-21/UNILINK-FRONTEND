import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Skeleton from "../../components/common/Skeleton";
import StateMessage from "../../components/common/StateMessage";

import { useAuth } from "../../context/AuthContext";
import courseService from "../../services/courseService";
import timetableService from "../../services/timetableService";
import attendanceService from "../../services/attendanceService";
import announcementService from "../../services/announcementService";
import eventService from "../../services/eventService";

import { getErrorMessage } from "../../utils/errors";
import { notify } from "../../utils/notify";
import { formatDate, formatDateTime, todayLocalISO } from "../../utils/format";

import "../../styles/pages/studentHome.css";

const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

// The web counterpart of the app's Home tab, same sections in the same
// order: Campus Announcements, Upcoming Events, Today's Timetable,
// Attendance. Every figure comes from the backend; nothing is invented.
// (The old page showed 6 courses, 4 assignments, 28 notes and 12
// notifications whatever the account.)
const Dashboard = () => {
  const { user } = useAuth();

  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [academicLoading, setAcademicLoading] = useState(true);
  const [academicError, setAcademicError] = useState("");

  const [signingId, setSigningId] = useState(null);

  // Announcements and events load on their own so a failing academic
  // endpoint never hides campus information (as in the app).
  useEffect(() => {
    let active = true;

    announcementService
      .getAnnouncements()
      .then((res) => {
        if (active) setAnnouncements(Array.isArray(res?.data) ? res.data : []);
      })
      .catch(() => {
        if (active) setAnnouncements([]);
      })
      .finally(() => {
        if (active) setAnnouncementsLoading(false);
      });

    eventService
      .getEvents()
      .then((res) => {
        if (active) setEvents(Array.isArray(res?.data) ? res.data : []);
      })
      .catch(() => {
        if (active) setEvents([]);
      })
      .finally(() => {
        if (active) setEventsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const loadAcademic = useCallback(async () => {
    setAcademicLoading(true);
    setAcademicError("");

    try {
      const response = await courseService.getCourses();
      const courses = Array.isArray(response?.data) ? response.data : [];

      const today = todayLocalISO();
      const todayName = DAY_NAMES[new Date().getDay()];

      const perCourse = await Promise.all(
        courses.map(async (course) => {
          const [schedule, mine] = await Promise.all([
            timetableService
              .getMyScheduleForCourse(course._id)
              .catch(() => ({ data: [] })),
            attendanceService
              .getMyAttendanceForCourse(course._id)
              .catch(() => ({ data: [] })),
          ]);

          const entries = (Array.isArray(schedule?.data) ? schedule.data : []).filter(
            (entry) => entry.dayOfWeek === todayName
          );

          const records = Array.isArray(mine?.data) ? mine.data : [];

          return {
            classes: entries.map((entry) => ({
              id: entry._id,
              courseTitle: course.title,
              startTime: entry.startTime,
              endTime: entry.endTime,
              location: entry.location,
              isOverridden: Boolean(entry.isOverridden),
            })),
            attendance: {
              courseId: course._id,
              courseTitle: course.title,
              signedToday: records.some((record) => record.date === today),
            },
          };
        })
      );

      setClasses(
        perCourse
          .flatMap((item) => item.classes)
          .sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)))
      );
      setAttendance(perCourse.map((item) => item.attendance));
    } catch (err) {
      setClasses([]);
      setAttendance([]);
      setAcademicError(getErrorMessage(err, "Could not load your dashboard."));
    } finally {
      setAcademicLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAcademic();
  }, [loadAcademic]);

  const markSigned = (courseId) =>
    setAttendance((prev) =>
      prev.map((item) =>
        item.courseId === courseId ? { ...item, signedToday: true } : item
      )
    );

  const handleSign = async (item) => {
    setSigningId(item.courseId);

    try {
      await attendanceService.signAttendance(item.courseId, todayLocalISO());
      notify.success(`Attendance recorded for ${item.courseTitle} today.`);
      markSigned(item.courseId);
    } catch (err) {
      if (err?.response?.status === 409) {
        notify.success(`You've already signed attendance for ${item.courseTitle} today.`);
        markSigned(item.courseId);
      } else {
        notify.error(getErrorMessage(err, "Could not sign attendance."));
      }
    } finally {
      setSigningId(null);
    }
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="sh-page">
      <header className="sh-header">
        <h1>Hi, {firstName} 👋</h1>
      </header>

      <section className="sh-section">
        <h2>Campus Announcements</h2>

        {announcementsLoading ? (
          <Skeleton variant="list" rows={2} />
        ) : announcements.length === 0 ? (
          <div className="sh-empty">No campus announcements right now.</div>
        ) : (
          <div className="sh-stack">
            {announcements.slice(0, 3).map((item) => (
              <article className="sh-card" key={item._id}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span className="sh-meta">{formatDate(item.createdAt)}</span>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="sh-section">
        <div className="sh-section-head">
          <h2>Upcoming Events</h2>
          <Link to="/events">View all</Link>
        </div>

        {eventsLoading ? (
          <Skeleton variant="list" rows={2} />
        ) : events.length === 0 ? (
          <div className="sh-empty">No upcoming events at your institution.</div>
        ) : (
          <div className="sh-stack">
            {events.slice(0, 3).map((event) => (
              <Link className="sh-card sh-card--link" to="/events" key={event._id}>
                <h3>{event.title}</h3>
                <span className="sh-meta">
                  {formatDateTime(event.date)}
                  {event.location ? ` · ${event.location}` : ""}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="sh-section">
        <h2>Today&apos;s Timetable</h2>

        {academicLoading ? (
          <Skeleton variant="list" rows={2} />
        ) : academicError ? (
          <StateMessage
            kind="error"
            title="Couldn't load your timetable"
            text={academicError}
            action={
              <button type="button" className="list-btn" onClick={loadAcademic}>
                Try again
              </button>
            }
          />
        ) : classes.length === 0 ? (
          <Link className="sh-empty sh-empty--link" to="/student/academics">
            No classes today. Open Academics.
          </Link>
        ) : (
          <div className="sh-stack">
            {classes.map((entry) => (
              <article className="sh-card" key={entry.id}>
                <span className="sh-time">
                  {entry.startTime} – {entry.endTime}
                </span>
                <h3>{entry.courseTitle}</h3>
                <span className="sh-meta">
                  {entry.location || "Location not set"}
                  {entry.isOverridden ? " · your schedule" : ""}
                </span>
              </article>
            ))}
          </div>
        )}

        <Link className="sh-link" to="/student/timetable">
          View full timetable →
        </Link>
      </section>

      <section className="sh-section">
        <h2>Attendance</h2>

        {academicLoading ? (
          <Skeleton variant="list" rows={2} />
        ) : academicError ? (
          <div className="sh-empty">{academicError}</div>
        ) : attendance.length === 0 ? (
          <div className="sh-empty">Enroll in a course to sign attendance.</div>
        ) : (
          <div className="sh-stack">
            {attendance.map((item) => (
              <article className="sh-card sh-card--row" key={item.courseId}>
                <h3>{item.courseTitle}</h3>

                {item.signedToday ? (
                  <span className="list-badge">Signed in</span>
                ) : (
                  <button
                    type="button"
                    className="list-btn"
                    disabled={signingId === item.courseId}
                    onClick={() => handleSign(item)}
                  >
                    {signingId === item.courseId ? "Signing…" : "Sign in"}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
