import api from "./api";
/**
 * Assignment Service
 *
 * Handles browsing a course's assignments, viewing the current
 * student's own submission, and submitting/resubmitting. Submission
 * is text-only on the backend (textAnswer field) — no file upload
 * despite what an earlier version of this file assumed. Creating
 * assignments and grading submissions are lecturer/admin-only, so
 * no create/grade functions here.
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
};
export default assignmentService;
