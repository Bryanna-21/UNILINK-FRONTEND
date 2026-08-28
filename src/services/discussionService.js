import api from "./api";
/**
 * Discussion Service
 *
 * Per-course discussion feed. One thread per course (no nested
 * replies) — see Discussion model. userId on each entry is a raw
 * string with no populated name, matching mobile's approach: entries
 * from the current user show "You", others show a generic label.
 */
const discussionService = {
  getDiscussion: async (courseId) => {
    try {
      const response = await api.get(`/community/courses/${courseId}/discussion`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch discussion:", error);
      throw error;
    }
  },
  postToDiscussion: async (courseId, content) => {
    try {
      const response = await api.post(`/community/courses/${courseId}/discussion`, { content });
      return response.data;
    } catch (error) {
      console.error("Failed to post to discussion:", error);
      throw error;
    }
  },
};
export default discussionService;
