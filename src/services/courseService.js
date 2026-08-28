import api from "./api";
/**
 * Course Service
 *
 * Handles:
 * - Browsing all courses
 * - Viewing a single course
 * - Enrolling in a course
 */
const courseService = {
  getCourses: async () => {
    try {
      const response = await api.get("/courses");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      throw error;
    }
  },
  getCourseById: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch course:", error);
      throw error;
    }
  },
  enroll: async (courseId) => {
    try {
      const response = await api.post(`/courses/${courseId}/enroll`);
      return response.data;
    } catch (error) {
      console.error("Failed to enroll:", error);
      throw error;
    }
  },
  createCourse: async (courseData) => {
    try {
      const response = await api.post("/courses", courseData);
      return response.data;
    } catch (error) {
      console.error("Failed to create course:", error);
      throw error;
    }
  },
};
export default courseService;
