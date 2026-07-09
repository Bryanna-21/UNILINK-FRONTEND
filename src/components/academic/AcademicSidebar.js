import React from "react";
import { NavLink } from "react-router-dom";
import "./AcademicSidebar.css";

import {
  FaBookOpen,
  FaLayerGroup,
  FaFileAlt,
  FaClipboardList,
  FaClock,
  FaChartLine,
  FaFilePdf,
  FaCheckCircle,
} from "react-icons/fa";

const menuItems = [
  {
    title: "Courses",
    path: "/student/courses",
    icon: <FaBookOpen />,
  },
  {
    title: "Units",
    path: "/student/units",
    icon: <FaLayerGroup />,
  },
  {
    title: "Notes",
    path: "/student/notes",
    icon: <FaFileAlt />,
  },
  {
    title: "Assignments",
    path: "/student/assignments",
    icon: <FaClipboardList />,
  },
  {
    title: "Past Papers",
    path: "/student/past-papers",
    icon: <FaFilePdf />,
  },
  {
    title: "Timetable",
    path: "/student/timetable",
    icon: <FaClock />,
  },
  {
    title: "Attendance",
    path: "/student/attendance",
    icon: <FaCheckCircle />,
  },
  {
    title: "Results",
    path: "/student/results",
    icon: <FaChartLine />,
  },
];

const AcademicSidebar = () => {
  return (
    <aside className="academic-sidebar">
      <div className="academic-sidebar-header">
        <h2>Academic Portal</h2>
        <p>Your learning workspace</p>
      </div>

      <nav className="academic-sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "academic-sidebar-link active"
                : "academic-sidebar-link"
            }
          >
            <span className="sidebar-icon">{item.icon}</span>

            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AcademicSidebar;
