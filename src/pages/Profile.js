import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "../styles/pages/studentHome.css";

// The web counterpart of the app's Me tab: who you are, Edit Profile,
// then a short menu. Items that exist only in the app (Following &
// Followers, Achievements, Hidden Posts) are not listed.
const MENU = {
  student: [
    ["Timetable", "/student/timetable"],
    ["Find People", "/search"],
    ["Notifications", "/notifications-me"],
    ["My Reports", "/student/my-reports"],
    ["Settings", "/settings"],
  ],
  lecturer: [
    ["Lecturer Tools", "/lecturer/dashboard"],
    ["Find People", "/search"],
    ["Notifications", "/notifications-me"],
    ["Settings", "/settings"],
  ],
  admin: [
    ["Admin Tools", "/admin/dashboard"],
    ["Notifications", "/notifications"],
    ["Settings", "/settings"],
  ],
};

export default function Profile() {
  // AuthContext already holds the signed-in user, so no extra fetch.
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="sh-page">
        <div className="sh-empty">Loading profile...</div>
      </div>
    );
  }

  const items = MENU[user.role] || [["Settings", "/settings"]];

  return (
    <div className="sh-page">
      <section className="me-card">
        <div className="me-avatar" aria-hidden="true">
          {(user.name || "?").trim().charAt(0).toUpperCase()}
        </div>

        <div className="me-details">
          <h1>{user.name}</h1>
          <span className="list-badge">{user.role}</span>
          {user.email && <p>{user.email}</p>}
          {user.bio && <p>{user.bio}</p>}
        </div>

        <Link className="list-btn" to="/profile/edit">
          Edit Profile
        </Link>
      </section>

      <nav className="sh-stack me-menu" aria-label="Me">
        {items.map(([label, path]) => (
          <Link className="sh-nav-card me-menu-item" to={path} key={path}>
            <strong>{label}</strong>
            <span aria-hidden="true">›</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
