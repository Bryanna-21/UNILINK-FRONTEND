import api from "./api";

const notificationService = {
  // ==========================================
  // Notifications
  // ==========================================

  async getNotifications(page = 1, limit = 20) {
    const response = await api.get("/notifications", {
      params: {
        page,
        limit,
      },
    });

    return response.data;
  },

  async getUnreadNotifications() {
    const response = await api.get("/notifications/unread");
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get("/notifications/unread/count");
    return response.data;
  },

  // ==========================================
  // Read Status
  // ==========================================

  async markAsRead(notificationId) {
    const response = await api.patch(
      `/notifications/${notificationId}/read`
    );

    return response.data;
  },

  async markAllAsRead() {
    const response = await api.patch(
      "/notifications/read-all"
    );

    return response.data;
  },

  // ==========================================
  // Delete
  // ==========================================

  async deleteNotification(notificationId) {
    const response = await api.delete(
      `/notifications/${notificationId}`
    );

    return response.data;
  },

  async clearNotifications() {
    const response = await api.delete(
      "/notifications"
    );

    return response.data;
  },

  // ==========================================
  // Preferences
  // ==========================================

  async getPreferences() {
    const response = await api.get(
      "/notifications/preferences"
    );

    return response.data;
  },

  async updatePreferences(preferences) {
    const response = await api.put(
      "/notifications/preferences",
      preferences
    );

    return response.data;
  },

  // ==========================================
  // Push Notification Token
  // ==========================================

  async registerDevice(deviceToken) {
    const response = await api.post(
      "/notifications/device",
      {
        deviceToken,
      }
    );

    return response.data;
  },

  async unregisterDevice(deviceToken) {
    const response = await api.delete(
      "/notifications/device",
      {
        data: {
          deviceToken,
        },
      }
    );

    return response.data;
  },

  // ==========================================
  // Admin
  // ==========================================

  async sendGlobalNotification(data) {
    const response = await api.post(
      "/admin/notifications/global",
      data
    );

    return response.data;
  },

  async sendUniversityNotification(
    universityId,
    data
  ) {
    const response = await api.post(
      `/admin/notifications/university/${universityId}`,
      data
    );

    return response.data;
  },

  async sendEmergencyNotification(data) {
    const response = await api.post(
      "/admin/notifications/emergency",
      data
    );

    return response.data;
  },
};

export default notificationService;
