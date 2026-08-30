import api from "./api";
/**
 * Note Service
 *
 * Handles browsing a course's notes (any authenticated user) and
 * uploading a new note (lecturer/admin only, enforced server-side).
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
  uploadNote: async (courseId, formData) => {
    try {
      const response = await api.post(`/courses/${courseId}/notes`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to upload note:", error);
      throw error;
    }
  },
};
export default noteService;
