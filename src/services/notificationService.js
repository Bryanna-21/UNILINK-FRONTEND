import api from "./api";

// Matches the actual backend surface exactly. A previous version of
// this file described a much larger, general-purpose notification
// system (per-user preferences, push device registration, admin
// broadcast-to-university/global, mark-all-as-read) that was never
// built and, per Notification.js's own top-of-file comment, was never
// intended to be — this is deliberately an ADMIN-ONLY, event-driven
// system. Notifications are created server-side via
// middleware/notifyAdmins.middleware.js when specific events occur
// (a new emergency report, a new university registration) — there is
// no client-facing "create notification" endpoint for this system.
//
// Student/lecturer notifications DO now exist as a separate system -
// see userNotificationService.js, which hits the top-level
// /api/notifications rather than this file's /api/admin/notifications.
const notificationService = {
  // Returns this admin's own notifications (max 50, newest first)
  // plus their current unread count.
  async getNotifications() {
    const { data } = await api.get("/admin/notifications");
    return data;
  },
  async markNotificationRead(notificationId) {
    const { data } = await api.patch(
      `/admin/notifications/${notificationId}/read`
    );
    return data;
  },
};
export default notificationService;
