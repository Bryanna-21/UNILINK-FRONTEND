import api from "./api";
/**
 * CAT Service
 *
 * Handles browsing a course's CATs (Continuous Assessment Tests)
 * and viewing the current student's own result for each one.
 * Creating CATs and publishing results are lecturer/admin-only on
 * the backend — no create/publish functions here.
 */
const catService = {
  getCatsForCourse: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/cats`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch CATs:", error);
      throw error;
    }
  },
  getMyResultForCat: async (catId) => {
    try {
      const response = await api.get(`/courses/cats/${catId}/my-result`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch CAT result:", error);
      throw error;
    }
  },
};
export default catService;
