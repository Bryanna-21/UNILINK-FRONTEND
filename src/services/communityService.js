import api from "./api";

/**
 * Community Service
 *
 * Real routes live under /api/communities (the v2 router):
 * list, join and leave. University-wide communities are automatic and
 * cannot be joined or left; private ones are not joinable yet.
 */
const communityService = {
  getCommunities: async () => {
    try {
      const response = await api.get("/communities");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch communities:", error);
      throw error;
    }
  },
  join: async (communityId) => {
    try {
      const response = await api.post(`/communities/${communityId}/join`);
      return response.data;
    } catch (error) {
      console.error("Failed to join community:", error);
      throw error;
    }
  },
  leave: async (communityId) => {
    try {
      const response = await api.post(`/communities/${communityId}/leave`);
      return response.data;
    } catch (error) {
      console.error("Failed to leave community:", error);
      throw error;
    }
  },
};

export default communityService;
