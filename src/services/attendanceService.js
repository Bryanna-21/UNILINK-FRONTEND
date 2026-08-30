import api from "./api";
/**
 * Attendance Service
 *
 * Handles signing attendance for a course and viewing attendance
 * records. Real backend routes are all nested under a course
 * (courses/:courseId/attendance...) — no flat top-level /attendance
 * endpoints exist despite an earlier version of this file assuming
 * eight of them.
 */
const attendanceService = {
  /**
   * Sign (mark) attendance for a course session
   */
  signAttendance: async (courseId) => {
    try {
      const response = await api.post(`/courses/${courseId}/attendance`);
      return response.data;
    } catch (error) {
      console.error("Failed to sign attendance:", error);
      throw error;
    }
  },
  /**
   * Get the current student's own attendance record for a course
   */
  getMyAttendanceForCourse: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/attendance/mine`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      throw error;
    }
  },
  /**
   * Get the full attendance record for a course (lecturer/admin view)
   */
  getAttendanceForCourse: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/attendance`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch course attendance:", error);
      throw error;
    }
  },
};
export default attendanceService;
