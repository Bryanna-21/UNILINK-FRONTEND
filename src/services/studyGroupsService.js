import api from "./api";
/**
 * Study Groups Service
 *
 * Handles:
 * - Browsing study groups
 * - Creating a study group
 * - Joining a study group
 *
 * Note: there is no "leave" endpoint on the backend (only join) —
 * this is a real backend asymmetry, not an oversight here. See
 * community.routes.js.
 */
const studyGroupsService = {
  getStudyGroups: async () => {
    try {
      const response = await api.get("/community/study-groups");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch study groups:", error);
      throw error;
    }
  },
  createStudyGroup: async (groupData) => {
    try {
      const response = await api.post("/community/study-groups", groupData);
      return response.data;
    } catch (error) {
      console.error("Failed to create study group:", error);
      throw error;
    }
  },
  joinStudyGroup: async (groupId) => {
    try {
      const response = await api.post(`/community/study-groups/${groupId}/join`);
      return response.data;
    } catch (error) {
      console.error("Failed to join study group:", error);
      throw error;
    }
  },
};
export default studyGroupsService;
