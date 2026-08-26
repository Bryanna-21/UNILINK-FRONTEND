import "./../../styles/layout/topbar.css";
import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <button
        className="lg:hidden text-slate-700 text-2xl mr-3 flex-shrink-0"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <FaBars />
      </button>

      <div className="search-box">
        <FaSearch />
        <input type="text" placeholder="Search anything..." />
      </div>

      <div className="topbar-right">
        <button className="notification-btn">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>
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
