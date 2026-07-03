import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaClipboardList,
  FaCalendarAlt,
  FaUserGraduate,
  FaUsers,
  FaComments,
  FaBell,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

const studentLinks = [
  {
    name: "Dashboard",
    path: "/student",
    icon: <FaHome />,
  },
  {
    name: "Courses",
    path: "/courses",
    icon: <FaBook />,
  },
  {
    name: "Assignments",
    path: "/assignments",
    icon: <FaClipboardList />,
  },
  {
    name: "Timetable",
    path: "/timetable",
    icon: <FaCalendarAlt />,
  },
  {
    name: "Messages",
    path: "/messages",
    icon: <FaComments />,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: <FaBell />,
  },
];

const lecturerLinks = [
  {
    name: "Dashboard",
    path: "/lecturer",
    icon: <FaHome />,
  },
  {
    name: "My Courses",
    path: "/courses",
    icon: <FaBook />,
  },
  {
    name: "Students",
    path: "/students",
    icon: <FaUserGraduate />,
  },
  {
    name: "Messages",
    path: "/messages",
    icon: <FaComments />,
  },
];

const adminLinks = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: <FaHome />,
  },
  {
    name: "Users",
    path: "/users",
    icon: <FaUsers />,
  },
  {
    name: "Courses",
    path: "/courses",
    icon: <FaBook />,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <FaCog />,
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  let links = [];

  switch (user?.role) {
    case "admin":
      links = adminLinks;
      break;

    case "lecturer":
      links = lecturerLinks;
      break;

    default:
      links = studentLinks;
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        UniLink
      </div>

      <nav className="flex-1 p-4">
        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-600 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}
