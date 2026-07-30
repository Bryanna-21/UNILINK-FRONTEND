import {
  FaHome,
  FaBook,
  FaClipboardList,
  FaCalendarAlt,
  FaBookReader,
  FaComments,
  FaBell,
  FaCog,
  FaUsers,
  FaUserGraduate,
  FaChartBar,
} from "react-icons/fa";

export const navigation = {
  student: [
    {
      title: "Dashboard",
      path: "/student/dashboard",
      icon: FaHome,
    },
    {
      title: "Courses",
      path: "/student/courses",
      icon: FaBook,
    },
    {
      title: "Assignments",
      path: "/student/assignments",
      icon: FaClipboardList,
    },
    {
      title: "Timetable",
      path: "/student/timetable",
      icon: FaCalendarAlt,
    },
    {
      title: "Results",
      path: "/student/results",
      icon: FaChartBar,
    },
    {
      title: "Feed",
      path: "/feed",
      icon: FaBookReader,
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
      path: "/lecturer/dashboard",
      icon: FaHome,
    },
    {
      title: "My Courses",
      path: "/lecturer/courses",
      icon: FaBook,
    },
    {
      title: "Exams",
      path: "/lecturer/exams",
      icon: FaClipboardList,
    },
    {
      title: "Submissions",
      path: "/lecturer/submissions",
      icon: FaUserGraduate,
    },
    {
      title: "Analytics",
      path: "/lecturer/analytics",
      icon: FaChartBar,
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
      path: "/admin/dashboard",
      icon: FaHome,
    },
    {
      title: "Users",
      path: "/admin/users",
      icon: FaUsers,
    },
    {
      title: "Analytics",
      path: "/lecturer/analytics",
      icon: FaChartBar,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: FaCog,
    },
  ],
};
