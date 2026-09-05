import api from "./api";

// Matches the actual backend surface exactly (src/controllers/emergency.controller.js).
// A previous version of this file used a plural /emergencies namespace
// with a much larger, speculative feature set (live location tracking,
// nearby responder dispatch, evidence upload, cancel/update) - none of
// it real. The actual backend is singular /emergency, three roles
// (student/lecturer/admin), with server-side authorization computed
// from real relationships (Course.lecturerId, universityId) - see
// message.controller.js's getAuthorizedReports for how visibility is
// actually determined; it is never controlled by a client-supplied
// filter param.
const emergencyService = {
  // Student: file a report. courseId is optional - if supplied, the
  // backend independently verifies real enrollment in that course
  // before trusting it (a client can't just tag an arbitrary courseId
  // to influence who sees the report).
  async reportEmergency({ type, message, location, courseId }) {
    const { data } = await api.post("/emergency/report", {
      type,
      message,
      location,
      courseId,
    });
    return data;
  },

  // Student: their own reports only, full detail (message visible).
  async getMyReports() {
    const { data } = await api.get("/emergency/my-reports");
    return data;
  },

  // Lecturer/admin: authorization-scoped list. Lecturer gets a
  // stripped preview (no reporter identity); admin gets full detail.
  // Restricted types (abuse) are server-side excluded from a
  // lecturer's results entirely, not just hidden client-side.
  async getAuthorizedReports() {
    const { data } = await api.get("/emergency/reports");
    return data;
  },

  // Lecturer/admin: first-touch action on a report they're authorized
  // to see.
  async acknowledgeReport(reportId) {
    const { data } = await api.patch(`/emergency/reports/${reportId}/acknowledge`);
    return data;
  },

  // Lecturer/admin: add a staff-only internal note, never shown to
  // the reporting student.
  async respondToReport(reportId, note) {
    const { data } = await api.post(`/emergency/reports/${reportId}/respond`, { note });
    return data;
  },

  // Lecturer/admin: hand off to admin. This is the highest action a
  // lecturer can take - they cannot resolve or dismiss (enforced
  // server-side, not just absent from the UI).
  async escalateReport(reportId) {
    const { data } = await api.patch(`/emergency/reports/${reportId}/escalate`);
    return data;
  },

  // Admin only (enforced server-side).
  async updateReportStatus(reportId, status) {
    const { data } = await api.patch(`/emergency/reports/${reportId}/status`, { status });
    return data;
  },

  async getContacts() {
    const { data } = await api.get("/emergency/contacts");
    return data;
  },

  async requestHelp() {
    const { data } = await api.post("/emergency/help");
    return data;
  },
};

export default emergencyService;
