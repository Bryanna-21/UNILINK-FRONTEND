import {
  FaHome,
  FaBook,
  FaClipboardList,
  FaComments,
  FaBell,
  FaCog,
  FaUsers,
  FaUserGraduate,
  FaChartBar,
  FaBullhorn,
  FaUpload,
  FaExclamationTriangle,
  FaRobot,
  FaUserCircle,
} from "react-icons/fa";

// The student navigation is the app's five tabs, nothing more: Home,
// Academics, Campus, Messages, Me. Everything else is reached from inside
// a tab, exactly as in the app (Academics holds the coursework pages and
// the Campus Hub, Me holds the profile menu, Messages holds the AI
// assistant). "owns" lists the paths that keep a tab highlighted.
export const studentTabs = [
  {
    key: "home",
    title: "Home",
    glyph: "\u2302",
    icon: FaHome,
    path: "/student/dashboard",
    owns: ["/student/dashboard"],
  },
  {
    key: "academics",
    title: "Academics",
    glyph: "\uD83D\uDCDA",
    icon: FaBook,
    path: "/student/academics",
    owns: [
      "/student/academics",
      "/student/courses",
      "/student/units",
      "/student/timetable",
      "/student/attendance",
      "/student/assignments",
      "/student/notes",
      "/student/results",
      "/student/exams",
      "/library",
      // Campus Hub, a segment of the Academics tab in the app
      "/clubs",
      "/study-groups",
      "/polls",
      "/communities",
      "/events",
      "/marketplace",
      "/lost-and-found",
    ],
  },
  {
    key: "campus",
    title: "Campus",
    glyph: "\uD83D\uDC65",
    icon: FaUsers,
    path: "/feed",
    owns: ["/feed"],
  },
  {
    key: "messages",
    title: "Messages",
    glyph: "\uD83D\uDCAC",
    icon: FaComments,
    path: "/messages",
    owns: ["/messages", "/ai-assistant"],
  },
  {
    key: "me",
    title: "Me",
    glyph: "\uD83D\uDC64",
    icon: FaUserCircle,
    path: "/profile",
    owns: [
      "/profile",
      "/notifications-me",
      "/student/my-reports",
      "/settings",
      "/search",
    ],
  },
];

// Which tab a path belongs to (longest owned path wins).
export const tabForPath = (pathname) => {
  let best = { key: null, length: -1 };

  studentTabs.forEach((tab) => {
    tab.owns.forEach((owned) => {
      const hit = pathname === owned || pathname.startsWith(`${owned}/`);

      if (hit && owned.length > best.length) {
        best = { key: tab.key, length: owned.length };
      }
    });
  });

  return best.key;
};

export const navigation = {
  student: studentTabs,
  lecturer: [
    { title: "Dashboard", path: "/lecturer/dashboard", icon: FaHome },
    { title: "My Courses", path: "/lecturer/courses", icon: FaBook },
    { title: "Upload Notes", path: "/lecturer/upload-notes", icon: FaUpload },
    { title: "Exams", path: "/lecturer/exams", icon: FaClipboardList },
    { title: "Submissions", path: "/lecturer/submissions", icon: FaUserGraduate },
    { title: "Emergency Reports", path: "/lecturer/emergency-reports", icon: FaExclamationTriangle },
    { title: "AI Assistant", path: "/ai-assistant", icon: FaRobot },
    { title: "Announcements", path: "/lecturer/announcements", icon: FaBullhorn },
    { title: "Analytics", path: "/lecturer/analytics", icon: FaChartBar },
    { title: "Messages", path: "/messages", icon: FaComments },
    { title: "Notifications", path: "/notifications-me", icon: FaBell },
    { title: "Settings", path: "/settings", icon: FaCog },
  ],
  admin: [
    { title: "Dashboard", path: "/admin/dashboard", icon: FaHome },
    { title: "Users", path: "/admin/users", icon: FaUsers },
    { title: "Notifications", path: "/notifications", icon: FaBell },
    { title: "Analytics", path: "/lecturer/analytics", icon: FaChartBar },
    { title: "Settings", path: "/settings", icon: FaCog },
  ],
};
