import {
  FaHome,
  FaBook,
  FaClipboardList,
  FaCalendarAlt,
  FaBookReader,
  FaStore,
  FaSearchLocation,
  FaBookOpen,
  FaPoll,
  FaComments,
  FaBell,
  FaCog,
  FaUsers,
  FaUserGraduate,
  FaChartBar,
  FaLayerGroup,
  FaFileAlt,
  FaCheckCircle,
  FaBullhorn,
  FaUpload,
  FaExclamationTriangle,
  FaRobot,
  FaUserCircle,
  FaSearch,
} from "react-icons/fa";

// The student navigation, grouped into the same five tabs as the mobile
// app: Home, Academics, Campus, Messages, Me. Only pages that exist on
// the web are listed (CATs and Past Papers are app-only for now).
export const studentMenu = [
  {
    key: "home",
    heading: "Home",
    items: [
      { title: "Dashboard", path: "/student/dashboard", icon: FaHome },
    ],
  },
  {
    key: "academics",
    heading: "Academics",
    items: [
      { title: "Academics", path: "/student/academics", icon: FaBook },
      { title: "My Courses", path: "/student/courses", icon: FaBook },
      { title: "My Units", path: "/student/units", icon: FaLayerGroup },
      { title: "Timetable", path: "/student/timetable", icon: FaCalendarAlt },
      { title: "Attendance", path: "/student/attendance", icon: FaCheckCircle },
      { title: "Assignments", path: "/student/assignments", icon: FaClipboardList },
      { title: "Notes", path: "/student/notes", icon: FaFileAlt },
      { title: "Results", path: "/student/results", icon: FaChartBar },
      { title: "Exam Card", path: "/student/exams", icon: FaClipboardList },
      { title: "Library", path: "/library", icon: FaBookOpen },
    ],
  },
  {
    key: "campus",
    heading: "Campus",
    items: [
      { title: "Feed", path: "/feed", icon: FaBookReader },
      { title: "Communities", path: "/communities", icon: FaUsers },
      { title: "Events", path: "/events", icon: FaCalendarAlt },
      { title: "Clubs", path: "/clubs", icon: FaUsers },
      { title: "Study Groups", path: "/study-groups", icon: FaUsers },
      { title: "Polls", path: "/polls", icon: FaPoll },
      { title: "Marketplace", path: "/marketplace", icon: FaStore },
      { title: "Lost & Found", path: "/lost-and-found", icon: FaSearchLocation },
      { title: "Find People", path: "/search", icon: FaSearch },
    ],
  },
  {
    key: "messages",
    heading: "Messages",
    items: [
      { title: "Messages", path: "/messages", icon: FaComments },
      { title: "AI Assistant", path: "/ai-assistant", icon: FaRobot },
    ],
  },
  {
    key: "me",
    heading: "Me",
    items: [
      { title: "Profile", path: "/profile", icon: FaUserCircle },
      { title: "Notifications", path: "/notifications-me", icon: FaBell },
      { title: "My Reports", path: "/student/my-reports", icon: FaExclamationTriangle },
      { title: "Settings", path: "/settings", icon: FaCog },
    ],
  },
];

// The bottom bar shown on phones: the same five tabs, labels and icons
// as the app's tab bar.
export const studentTabs = [
  { key: "home", title: "Home", glyph: "\u2302", path: "/student/dashboard" },
  { key: "academics", title: "Academics", glyph: "\uD83D\uDCDA", path: "/student/academics" },
  { key: "campus", title: "Campus", glyph: "\uD83D\uDC65", path: "/feed" },
  { key: "messages", title: "Messages", glyph: "\uD83D\uDCAC", path: "/messages" },
  { key: "me", title: "Me", glyph: "\uD83D\uDC64", path: "/profile" },
];

// Which tab a path belongs to (longest matching menu path wins).
export const tabForPath = (pathname) => {
  let best = { key: null, length: -1 };

  studentMenu.forEach((group) => {
    group.items.forEach((item) => {
      const hit =
        pathname === item.path || pathname.startsWith(`${item.path}/`);

      if (hit && item.path.length > best.length) {
        best = { key: group.key, length: item.path.length };
      }
    });
  });

  return best.key;
};

export const navigation = {
  student: studentMenu.flatMap((group) => group.items),
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
