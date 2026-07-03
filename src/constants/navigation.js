import {
  FaHome,
  FaBook,
  FaClipboardList,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBookReader,
  FaBed,
  FaComments,
  FaBell,
  FaCog,
  FaUsers,
  FaUserGraduate,
  FaChartBar,
  FaRobot,
} from "react-icons/fa";

export const navigation = {
  student: [
    {
      title: "Dashboard",
      path: "/student",
      icon: FaHome,
    },
    {
      title: "Courses",
      path: "/courses",
      icon: FaBook,
    },
    {
      title: "Assignments",
      path: "/assignments",
      icon: FaClipboardList,
    },
    {
      title: "Timetable",
      path: "/timetable",
      icon: FaCalendarAlt,
    },
    {
      title: "Results",
      path: "/results",
      icon: FaChartBar,
    },
    {
      title: "Finance",
      path: "/finance",
      icon: FaMoneyBillWave,
    },
    {
      title: "Library",
      path: "/library",
      icon: FaBookReader,
    },
    {
      title: "Hostel",
      path: "/hostel",
      icon: FaBed,
    },
    {
      title: "Messages",
      path: "/messages",
      icon: FaComments,
    },
    {
      title: "Notifications",
      path: "/notifications",
      icon: FaBell,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: FaCog,
    },
  ],

  lecturer: [
    {
      title: "Dashboard",
      path: "/lecturer",
      icon: FaHome,
    },
    {
      title: "My Courses",
      path: "/courses",
      icon: FaBook,
    },
    {
      title: "Assignments",
      path: "/assignments",
      icon: FaClipboardList,
    },
    {
      title: "Students",
      path: "/students",
      icon: FaUserGraduate,
    },
    {
      title: "Messages",
      path: "/messages",
      icon: FaComments,
    },
    {
      title: "Notifications",
      path: "/notifications",
      icon: FaBell,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: FaCog,
    },
  ],

  admin: [
    {
      title: "Dashboard",
      path: "/admin",
      icon: FaHome,
    },
    {
      title: "Users",
      path: "/users",
      icon: FaUsers,
    },
    {
      title: "Courses",
      path: "/courses",
      icon: FaBook,
    },
    {
      title: "Analytics",
      path: "/analytics",
      icon: FaChartBar,
    },
    {
      title: "AI Center",
      path: "/ai",
      icon: FaRobot,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: FaCog,
    },
  ],
};
