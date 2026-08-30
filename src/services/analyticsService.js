import api from "./api";
/**
 * Analytics Service
 *
 * Admin-only platform metrics. Only two routes exist on the real
 * backend (admin.routes.js) — user growth and university growth.
 * An earlier version of this file had 14 functions covering posts,
 * messages, emergencies, communities, events, reports, and revenue
 * analytics; none of those routes exist. Also worth noting: this
 * service isn't currently imported anywhere, including
 * Lecturer/Analytics.js, which uses unrelated hardcoded data — this
 * was seemingly built for a future admin dashboard, not the
 * lecturer-facing page its name might suggest.
 */
const analyticsService = {
  getUserGrowth: async () => {
    try {
      const response = await api.get("/admin/analytics/user-growth");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user growth:", error);
      throw error;
    }
  },
  getUniversityGrowth: async () => {
    try {
      const response = await api.get("/admin/analytics/university-growth");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch university growth:", error);
      throw error;
    }
  },
};
export default analyticsService;
