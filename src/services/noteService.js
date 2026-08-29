import api from "./api";
/**
 * Note Service
 *
 * Handles browsing a course's notes. Uploading notes is
 * lecturer/admin-only on the backend — no upload function here,
 * since this service is used from the student-facing course detail
 * page.
 */
const noteService = {
  getNotesForCourse: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/notes`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      throw error;
    }
  },
};
export default noteService;
