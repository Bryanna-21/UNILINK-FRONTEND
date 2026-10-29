import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaBell, FaCheckDouble } from "react-icons/fa";

import userNotificationService from "../services/userNotificationService";
import { resolveWebLink } from "../utils/notificationLinks";

import "./MyNotifications.css";

// The tabs, like Instagram's: everything, then people following you, likes and comments on your
// posts, mentions, and academic updates. New messages are not here: they show on Messages.
const TABS = [
  { key: "all", label: "All" },
  { key: "followers", label: "Followers" },
  { key: "activity", label: "Likes & comments" },
  { key: "mentions", label: "Mentions & tags" },
  { key: "updates", label: "Updates" },
];

const TYPE_LABEL = {
  grade_posted: "Grade",
  new_assignment: "Assignment",
  new_message: "Message",
  exam_published: "Exam",
  new_follower: "Follower",
  post_like: "Like",
  post_comment: "Comment",
  mention: "Mention",
  announcement: "Announcement",
  timetable: "Timetable",
  opportunity: "Opportunity",
  schedule_change: "Schedule",
  moderation: "Account",
};

const NO_COUNTS = { all: 0, followers: 0, activity: 0, mentions: 0, updates: 0 };

// Which tab a notification belongs to (the same grouping the server uses).
const categoryOf = (type) => {
  if (type === "new_message") return null;
  if (type === "new_follower") return "followers";
  if (type === "post_like" || type === "post_comment") return "activity";
  if (type === "mention") return "mentions";
  return "updates";
};

const MyNotifications = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [counts, setCounts] = useState(NO_COUNTS);
  const [loading, setLoading] = useState(true);
  const latestRequest = useRef(0);

  const unreadCount = counts[category] || 0;

  const loadNotifications = useCallback(async () => {
    // A slow answer for a tab you have already left must not overwrite the tab you are on.
    const requestId = ++latestRequest.current;
    try {
      setLoading(true);
      const res = await userNotificationService.getMyNotifications(category);
      if (requestId !== latestRequest.current) return;
      setNotifications(res?.data || []);
      setCounts({ ...NO_COUNTS, ...(res?.counts || {}) });
    } catch (error) {
      if (requestId !== latestRequest.current) return;
      toast.error(
        error.response?.data?.message || "Failed to load notifications."
      );
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleClick = async (notification) => {
    if (!notification.read) {
      try {
        await userNotificationService.markNotificationRead(notification._id);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
        // One fewer unread in this notification's own tab, and in All.
        const own = categoryOf(notification.type) || "updates";
        setCounts((prev) => ({
          ...prev,
          all: Math.max(0, prev.all - 1),
          [own]: Math.max(0, prev[own] - 1),
        }));
      } catch (error) {
        // Non-fatal - still navigate even if marking read failed, the
        // notification itself is more important than the read state.
      }
    }

    const destination = resolveWebLink(notification.link);
    if (destination) {
      navigate(destination);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await userNotificationService.markAllRead(category);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked read.");
      loadNotifications(); // the other tabs' counts changed too
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not mark all as read."
      );
    }
  };

  const emptyText =
    category === "all"
      ? "No notifications yet."
      : `No ${TABS.find((t) => t.key === category).label.toLowerCase()} yet.`;

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

      <div className="mn-tabs" role="tablist" aria-label="Notification types">
        {TABS.map((tab) => {
          const count = counts[tab.key] || 0;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={tab.key === category}
              className={`mn-tab ${tab.key === category ? "active" : ""}`}
              onClick={() => setCategory(tab.key)}
            >
              {tab.label}
              {count > 0 && (
                <span className="mn-tab-badge" aria-label={`${count} unread`}>
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading && <p>Loading notifications...</p>}

      {!loading && notifications.length === 0 && (
        <div className="mn-empty">
          <FaBell size={32} />
          <p>{emptyText}</p>
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
