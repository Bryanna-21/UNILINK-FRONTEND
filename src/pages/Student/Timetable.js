import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import TimetableCard from "../../components/academic/TimetableCard";
import courseService from "../../services/courseService";
import timetableService from "../../services/timetableService";
import userService from "../../services/userService";

import "./Timetable.css";

const DAY_ORDER = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

// There is no single "get my whole timetable" endpoint - the backend
// is course-scoped (see timetableService.js). This page fetches the
// student's enrolled courses, then calls getMyScheduleForCourse once
// per course and merges everything into one flat, day-sorted list.
// Each entry only carries courseId - course title/code and the
// lecturer's name are resolved separately per course and attached
// before rendering, since TimetableCard needs human-readable text,
// not raw ids.
const Timetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadTimetable = async () => {
      try {
        setLoading(true);

        const coursesResponse = await courseService.getCourses();
        const courses = coursesResponse?.data || [];

        if (courses.length === 0) {
          if (!cancelled) setTimetable([]);
          return;
        }

        // Resolve each course's lecturer name once, in parallel,
        // rather than per-entry - a course has one lecturer for all
        // of its timetable slots.
        const lecturerNameByCourseId = {};
        await Promise.all(
          courses.map(async (course) => {
            if (!course.lecturerId) {
              lecturerNameByCourseId[course._id] = "Not assigned";
              return;
            }
            try {
              const summary = await userService.getUserSummary(course.lecturerId);
              lecturerNameByCourseId[course._id] = summary?.data?.name || "Not assigned";
            } catch {
              lecturerNameByCourseId[course._id] = "Not assigned";
            }
          })
        );

        // Fetch this student's merged (canonical + override) schedule
        // for every enrolled course, in parallel.
        const scheduleResults = await Promise.allSettled(
          courses.map((course) => timetableService.getMyScheduleForCourse(course._id))
        );

        const merged = [];
        scheduleResults.forEach((result, i) => {
          if (result.status !== "fulfilled") return;
          const course = courses[i];
          const entries = result.value?.data || [];

          entries.forEach((entry) => {
            merged.push({
              id: entry._id,
              day: entry.dayOfWeek,
              unit: course.title,
              code: course.code,
              startTime: entry.startTime,
              endTime: entry.endTime,
              room: entry.location,
              lecturer: lecturerNameByCourseId[course._id],
              isOverridden: entry.isOverridden,
            });
          });
        });

        merged.sort((a, b) => {
          const dayDiff = DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
          if (dayDiff !== 0) return dayDiff;
          return (a.startTime || "").localeCompare(b.startTime || "");
        });

        if (!cancelled) setTimetable(merged);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load timetable."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadTimetable();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="timetable-page">
      <main className="timetable-content">

        <div className="timetable-header">
          <h1>My Timetable</h1>
          <p>View your weekly class schedule and lecture information.</p>
        </div>

        <div className="timetable-grid">
          {loading && <p>Loading timetable...</p>}

          {!loading && timetable.length === 0 && (
            <div className="empty-timetable">
              No timetable available.
            </div>
          )}

          {!loading &&
            timetable.map((item) => (
              <TimetableCard
                key={item.id}
                day={item.day}
                unit={item.unit}
                lecturer={item.lecturer}
                room={item.room}
                startTime={item.startTime}
                endTime={item.endTime}
                type={item.isOverridden ? "Personalized" : "Lecture"}
              />
            ))}
        </div>

      </main>
    </div>
  );
};

export default Timetable;
