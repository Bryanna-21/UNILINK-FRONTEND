import api from "./api";
/**
 * Lost & Found Service
 *
 * Handles:
 * - Viewing lost/found item reports
 * - Reporting a lost or found item (with optional photo)
 * - Marking a report as resolved
 */
const lostAndFoundService = {
  /**
   * Get all unresolved lost/found items, optionally filtered by status
   */
  getItems: async (status) => {
    try {
      const response = await api.get("/lost-and-found", {
        params: status ? { status } : {},
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch lost & found items:", error);
      throw error;
    }
  },
  /**
   * Report a lost or found item. formData may include an image file.
   */
  reportItem: async (formData) => {
    try {
      const response = await api.post("/lost-and-found", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to report item:", error);
      throw error;
    }
  },
  /**
   * Mark a report as resolved (only the original reporter can do this)
   */
  markResolved: async (itemId) => {
    try {
      const response = await api.patch(`/lost-and-found/${itemId}/resolve`);
      return response.data;
    } catch (error) {
      console.error("Failed to mark item resolved:", error);
      throw error;
    }
  },
};
export default lostAndFoundService;
