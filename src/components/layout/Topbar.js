import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./../../styles/layout/topbar.css";

import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import userNotificationService from "../../services/userNotificationService";

// The notifications page is for students and lecturers only.
const HAS_NOTIFICATIONS = ["student", "lecturer"];

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [unread, setUnread] = useState(0);

  const showBell = HAS_NOTIFICATIONS.includes(user?.role);

  // The badge is the real unread count, and is hidden at zero or when
  // the count can't be loaded. It never shows a made-up number.
  useEffect(() => {
    if (!showBell) return undefined;

    let cancelled = false;

    userNotificationService
      .getMyNotifications()
      .then((response) => {
        if (!cancelled) setUnread(Number(response?.unreadCount) || 0);
      })
      .catch(() => {
        if (!cancelled) setUnread(0);
      });

    return () => {
      cancelled = true;
    };
  }, [showBell]);

  const handleSearch = (event) => {
    event.preventDefault();

    const value = search.trim();
    if (!value) return;

    navigate(`/search?q=${encodeURIComponent(value)}`);
    setSearch("");
  };

  return (
    <header className="topbar">
      <button
        type="button"
        className="lg:hidden text-slate-700 text-2xl mr-3 flex-shrink-0"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <FaBars />
      </button>

      <form className="search-box" onSubmit={handleSearch} role="search">
        <FaSearch />
        <input
          type="text"
          placeholder="Find people by @username..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Find people by username"
        />
      </form>

      <div className="topbar-right">
        {showBell && (
          <Link
            to="/notifications-me"
            className="notification-btn"
            aria-label={
              unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
            }
          >
            <FaBell />
            {unread > 0 && (
              <span className="notification-badge">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>
        )}

        <div className="profile-box">
          <FaUserCircle size={35} />
          <div>
            <h4>{user?.name}</h4>
            <p>{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
