import api from "./api";
/**
 * Unit Service
 *
 * Handles browsing a course's units. Creating units is
 * lecturer/admin-only on the backend — no create function here,
 * since this service is used from the student-facing course detail
 * page.
 */
const unitService = {
  getUnitsForCourse: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/units`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch units:", error);
      throw error;
    }
  },
};
export default unitService;
