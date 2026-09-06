import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaBell, FaCheckDouble } from "react-icons/fa";

import userNotificationService from "../services/userNotificationService";

import "./MyNotifications.css";

const TYPE_LABEL = {
  grade_posted: "Grade",
  new_assignment: "Assignment",
  new_message: "Message",
  exam_published: "Exam",
};

const MyNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await userNotificationService.getMyNotifications();
      setNotifications(res?.data || []);
      setUnreadCount(res?.unreadCount || 0);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleClick = async (notification) => {
    if (!notification.read) {
      try {
        await userNotificationService.markNotificationRead(notification._id);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        // Non-fatal - still navigate even if marking read failed, the
        // notification itself is more important than the read state.
      }
    }

    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await userNotificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked read.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not mark all as read."
      );
    }
  };

  return (
    <div className="my-notifications-page">

      <div className="mn-header">
        <div className="mn-header-title">
          <FaBell />
          <h1>Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <button className="mn-mark-all" onClick={handleMarkAllRead}>
            <FaCheckDouble /> Mark all read
          </button>
        )}
      </div>

      {loading && <p>Loading notifications...</p>}

      {!loading && notifications.length === 0 && (
        <div className="mn-empty">
          <FaBell size={32} />
          <p>No notifications yet.</p>
        </div>
      )}

      {!loading &&
        notifications.map((n) => (
          <div
            key={n._id}
            className={`mn-item ${n.read ? "" : "unread"}`}
            onClick={() => handleClick(n)}
          >
            <div className="mn-item-header">
              <span className="mn-type">{TYPE_LABEL[n.type] || n.type}</span>
              {!n.read && <span className="mn-dot" />}
            </div>
            <p className="mn-title">{n.title}</p>
            {n.message && <p className="mn-message">{n.message}</p>}
            <p className="mn-date">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

    </div>
  );
};

export default MyNotifications;
