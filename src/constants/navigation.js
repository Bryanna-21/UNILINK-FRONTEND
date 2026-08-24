import { FaHome, FaBook, FaClipboardList, FaCalendarAlt, FaFileAlt, FaChartBar, FaComments, FaBell, FaCog, FaRobot, FaSearch } from "react-icons/fa";

export const navigation = [
  { title: "Home", path: "/student/dashboard", icon: FaHome },
  { title: "Courses", path: "/student/courses", icon: FaBook },
  { title: "Community", path: "/feed", icon: FaComments },
  { title: "Explore", path: "/search", icon: FaSearch },
  { title: "AI", path: "/ai", icon: FaRobot, emphasis: true },
  { title: "Assignments", path: "/student/assignments", icon: FaClipboardList },
  { title: "Timetable", path: "/student/timetable", icon: FaCalendarAlt },
  { title: "Notes", path: "/student/notes", icon: FaFileAlt },
  { title: "Results", path: "/student/results", icon: FaChartBar },
  { title: "Notifications", path: "/notifications", icon: FaBell },
  { title: "Settings", path: "/settings", icon: FaCog },
];
