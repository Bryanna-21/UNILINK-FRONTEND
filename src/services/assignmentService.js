import api from "./api";
/**
 * Assignment Service
 *
 * Handles browsing a course's assignments, submitting/resubmitting
 * (student), and creating a new assignment (lecturer/admin only,
 * enforced server-side). Submission is text-only on the backend
 * (textAnswer field) — no file upload, despite what an earlier
 * version of this file assumed for both submission and creation.
 */
const assignmentService = {
  getAssignmentsForCourse: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/assignments`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
      throw error;
    }
  },
  getMySubmission: async (assignmentId) => {
    try {
      const response = await api.get(`/courses/assignments/${assignmentId}/my-submission`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch submission:", error);
      throw error;
    }
  },
  submitAssignment: async (assignmentId, textAnswer) => {
    try {
      const response = await api.post(`/courses/assignments/${assignmentId}/submit`, { textAnswer });
      return response.data;
    } catch (error) {
      console.error("Failed to submit assignment:", error);
      throw error;
    }
  },
  createAssignment: async (courseId, assignmentData) => {
    try {
      const response = await api.post(`/courses/${courseId}/assignments`, assignmentData);
      return response.data;
    } catch (error) {
      console.error("Failed to create assignment:", error);
      throw error;
    }
  },
};
export default assignmentService;
