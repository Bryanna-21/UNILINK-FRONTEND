import api from "./api";
/**
 * Clubs Service
 *
 * Handles:
 * - Browsing clubs
 * - Creating a club
 * - Joining / leaving a club
 */
const clubsService = {
  getClubs: async () => {
    try {
      const response = await api.get("/community/clubs");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch clubs:", error);
      throw error;
    }
  },
  createClub: async (name, description) => {
    try {
      const response = await api.post("/community/clubs", { name, description });
      return response.data;
    } catch (error) {
      console.error("Failed to create club:", error);
      throw error;
    }
  },
  toggleMembership: async (clubId, isMember) => {
    try {
      const response = await api.post(`/community/clubs/${clubId}/${isMember ? "leave" : "join"}`);
      return response.data;
    } catch (error) {
      console.error("Failed to update club membership:", error);
      throw error;
    }
  },
};
export default clubsService;
