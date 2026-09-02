import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import notificationService from "../services/notificationService";

// Admin-only page (see RoleGuard in AppRoutes.js). Backend is
// deliberately narrow — Notification.js's own top-of-file comment
// explains this surfaces specific admin-relevant events (new
// emergency reports, new university registrations), not a
// general-purpose notification system for every role.
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      setNotifications(response?.data || []);
      setUnreadCount(response?.unreadCount ?? 0);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (notificationId) => {
    try {
      await notificationService.markNotificationRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to mark as read."
      );
    }
  };

  return (
    <div className="notifications-page">

      <div className="notifications-header">
        <h2>Notifications</h2>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount} unread</span>
        )}
      </div>

      {loading && <p>Loading notifications...</p>}

      {!loading && notifications.length === 0 && (
        <p className="notifications-empty">No notifications yet.</p>
      )}

      {!loading &&
        notifications.map((n) => (
          <div
            key={n._id}
            className={`card notification-item ${n.read ? "" : "unread"}`}
            onClick={() => !n.read && handleMarkRead(n._id)}
          >
            <div className="notification-title">{n.title}</div>
            {n.message && (
              <div className="notification-message">{n.message}</div>
            )}
            {n.link && (
              <a href={n.link} className="notification-link">
                View →
              </a>
            )}
          </div>
        ))}

    </div>
  );
}
