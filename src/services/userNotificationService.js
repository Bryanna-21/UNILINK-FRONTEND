import api from "./api";

// Student/lecturer-facing notifications - a genuinely separate
// system from notificationService.js, which is admin-only and hits
// /api/admin/notifications. This one hits the top-level
// /api/notifications, mounted specifically for this new system (see
// UNILINK-BACKEND's app.js and models/UserNotification.js).
//
// Tabs: category is all (default), followers, activity (likes and comments), mentions or
// updates. New-message notifications are never in these lists: messages show on Messages.
const paramsFor = (category) => (category && category !== "all" ? { category } : {});

const userNotificationService = {
  // This user's own notifications (max 50, newest first) for one tab, plus unreadCount
  // and counts (unread per tab).
  async getMyNotifications(category = "all") {
    const { data } = await api.get("/notifications", { params: paramsFor(category) });
    return data;
  },

  async markNotificationRead(notificationId) {
    const { data } = await api.patch(`/notifications/${notificationId}/read`);
    return data;
  },

  // Clears one tab, or everything when no category is given.
  async markAllRead(category = "all") {
    const { data } = await api.patch("/notifications/read-all", null, { params: paramsFor(category) });
    return data;
  },
};

export default userNotificationService;
