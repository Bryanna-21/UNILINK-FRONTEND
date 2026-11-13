import api from "./api";

/**
 * People Service
 *
 * GET /api/people/search matches usernames by prefix (3 to 20
 * characters: letters, numbers, dots, underscores). People are found at
 * every university (following is universal); staff accounts of other
 * universities are left out. It does not search by display name.
 */
const peopleService = {
  search: async (query) => {
    try {
      const response = await api.get("/people/search", { params: { q: query } });
      return response.data;
    } catch (error) {
      console.error("Failed to search people:", error);
      throw error;
    }
  },
};

export default peopleService;
