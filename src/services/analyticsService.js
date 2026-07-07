import api from "./api";

const analyticsService = {
  // ==========================================
  // Dashboard
  // ==========================================

  async getDashboard() {
    const response = await api.get("/admin/analytics/dashboard");
    return response.data;
  },

  // ==========================================
  // Users
  // ==========================================

  async getUserAnalytics() {
    const response = await api.get("/admin/analytics/users");
    return response.data;
  },

  async getActiveUsers() {
    const response = await api.get("/admin/analytics/users/active");
    return response.data;
  },

  async getNewUsers(days = 30) {
    const response = await api.get("/admin/analytics/users/new", {
      params: { days },
    });

    return response.data;
  },

  // ==========================================
  // Universities
  // ==========================================

  async getUniversityAnalytics() {
    const response = await api.get(
      "/admin/analytics/universities"
    );

    return response.data;
  },

  // ==========================================
  // Posts
  // ==========================================

  async getPostAnalytics() {
    const response = await api.get(
      "/admin/analytics/posts"
    );

    return response.data;
  },

  async getTrendingPosts() {
    const response = await api.get(
      "/admin/analytics/posts/trending"
    );

    return response.data;
  },

  // ==========================================
  // Messages
  // ==========================================

  async getMessageAnalytics() {
    const response = await api.get(
      "/admin/analytics/messages"
    );

    return response.data;
  },

  // ==========================================
  // Emergencies
  // ==========================================

  async getEmergencyAnalytics() {
    const response = await api.get(
      "/admin/analytics/emergencies"
    );

    return response.data;
  },

  // ==========================================
  // Communities
  // ==========================================

  async getCommunityAnalytics() {
    const response = await api.get(
      "/admin/analytics/communities"
    );

    return response.data;
  },

  // ==========================================
  // Events
  // ==========================================

  async getEventAnalytics() {
    const response = await api.get(
      "/admin/analytics/events"
    );

    return response.data;
  },

  // ==========================================
  // Reports
  // ==========================================

  async getReportsAnalytics() {
    const response = await api.get(
      "/admin/analytics/reports"
    );

    return response.data;
  },

  // ==========================================
  // Revenue (future)
  // ==========================================

  async getRevenueAnalytics() {
    const response = await api.get(
      "/admin/analytics/revenue"
    );

    return response.data;
  },

  // ==========================================
  // Export
  // ==========================================

  async exportReport(type = "pdf") {
    const response = await api.get(
      "/admin/analytics/export",
      {
        params: { type },
        responseType: "blob",
      }
    );

    return response.data;
  },
};

export default analyticsService;
