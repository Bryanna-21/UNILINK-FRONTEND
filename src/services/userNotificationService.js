import api from "./api";

// Student/lecturer-facing notifications (grade posted, new
// assignment, new message, exam published) - a genuinely separate
// system from notificationService.js, which is admin-only and hits
// /api/admin/notifications. This one hits the top-level
// /api/notifications, mounted specifically for this new system (see
// UNILINK-BACKEND's app.js and models/UserNotification.js).
const userNotificationService = {
  // This user's own notifications (max 50, newest first) plus
  // unreadCount.
  async getMyNotifications() {
    const { data } = await api.get("/notifications");
    return data;
  },

  async markNotificationRead(notificationId) {
    const { data } = await api.patch(`/notifications/${notificationId}/read`);
    return data;
  },

  async markAllRead() {
    const { data } = await api.patch("/notifications/read-all");
    return data;
  },
};

export default userNotificationService;
