import api from "./api";
/**
 * Announcement Service
 *
 * Handles browsing and creating community-wide announcements.
 * Real backend routes are GET/POST /community/announcements only —
 * no by-id, course-scoped, unit-scoped, lecturer-scoped, update,
 * delete, or read-tracking endpoints exist despite an earlier
 * version of this file assuming all of them.
 */
const announcementService = {
  getAnnouncements: async () => {
    try {
      const response = await api.get("/community/announcements");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      throw error;
    }
  },
  createAnnouncement: async (announcementData) => {
    try {
      const response = await api.post("/community/announcements", announcementData);
      return response.data;
    } catch (error) {
      console.error("Failed to create announcement:", error);
      throw error;
    }
  },
};
export default announcementService;
