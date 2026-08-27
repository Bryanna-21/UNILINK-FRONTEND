import api from "./api";
/**
 * Polls Service
 *
 * Handles:
 * - Browsing active polls
 * - Creating a poll
 * - Voting on a poll option
 *
 * Note: the backend does not return a separate "did I vote" flag —
 * only each option's voterIds array. The caller derives the current
 * user's vote by scanning voterIds, same approach as the mobile app.
 */
const pollsService = {
  getPolls: async () => {
    try {
      const response = await api.get("/community/polls");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch polls:", error);
      throw error;
    }
  },
  createPoll: async (question, options) => {
    try {
      const response = await api.post("/community/polls", { question, options });
      return response.data;
    } catch (error) {
      console.error("Failed to create poll:", error);
      throw error;
    }
  },
  vote: async (pollId, optionIndex) => {
    try {
      const response = await api.post(`/community/polls/${pollId}/vote`, { optionIndex });
      return response.data;
    } catch (error) {
      console.error("Failed to vote:", error);
      throw error;
    }
  },
};
export default pollsService;
