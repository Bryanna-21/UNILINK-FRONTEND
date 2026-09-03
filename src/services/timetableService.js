import api from "./api";

// Matches the actual backend surface exactly, confirmed against
// src/controllers/timetable.controller.js and src/routes/course.routes.js
// (timetable endpoints are nested under /courses, not a standalone
// /timetable prefix). A previous version of this file assumed a flat,
// non-course-scoped model (getTimetable, getStudentTimetable, getByDay,
// searchTimetable) with none of the real per-student override system —
// none of those functions matched any real route.
//
// Every real endpoint is scoped to a specific course. There is no
// "get my full timetable across all courses" endpoint — a student's
// complete schedule is the union of getMyScheduleForCourse called once
// per enrolled course, assembled client-side if/when that view is built.
const timetableService = {
  // ---------- Canonical timetable (lecturer/admin write, anyone read) ----------

  getTimetableForCourse: async (courseId) => {
    const { data } = await api.get(`/courses/${courseId}/timetable`);
    return data;
  },

  // dayOfWeek, startTime, endTime required; location optional.
  // Lecturer/admin only - backend enforces this.
  createTimetableEntry: async (courseId, entryData) => {
    const { data } = await api.post(`/courses/${courseId}/timetable`, entryData);
    return data;
  },

  // Lecturer/admin only - backend enforces this.
  deleteTimetableEntry: async (timetableId) => {
    const { data } = await api.delete(`/courses/timetable/${timetableId}`);
    return data;
  },

  // ---------- Student's personal merged view ----------

  // Canonical entries for the course, with this student's own
  // overrides swapped in. Each entry in the response carries
  // isOverridden so the UI can visually distinguish a personalized
  // slot from the default one.
  getMyScheduleForCourse: async (courseId) => {
    const { data } = await api.get(`/courses/${courseId}/timetable/mine`);
    return data;
  },

  // Upsert - calling this again for the same timetableId updates the
  // existing override rather than creating a duplicate.
  setMyOverride: async (timetableId, overrideData) => {
    const { data } = await api.put(
      `/courses/timetable/${timetableId}/override`,
      overrideData
    );
    return data;
  },

  // Reverts this student back to the canonical entry for this slot.
  deleteMyOverride: async (timetableId) => {
    const { data } = await api.delete(
      `/courses/timetable/${timetableId}/override`
    );
    return data;
  },
};

export default timetableService;
