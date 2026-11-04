import {
  FaHome,
  FaBook,
  FaClipboardList,
  FaComments,
  FaUsers,
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

// Lecturers and admins get the same five tabs, with a Tools tab where students have Academics.
// Lecturer Tools and Admin Tools are pages of cards that lead to everything the role can do.
export const lecturerTabs = [
  { key: "home", title: "Home", glyph: "\u2302", icon: FaHome, path: "/lecturer/dashboard", owns: ["/lecturer/dashboard"] },
  {
    key: "tools",
    title: "Tools",
    glyph: "\uD83D\uDEE0",
    icon: FaBook,
    path: "/lecturer/tools",
    // "/lecturer" catches every lecturer page; the longer "/lecturer/dashboard" wins for Home.
    owns: ["/lecturer"],
  },
  { key: "campus", title: "Campus", glyph: "\uD83D\uDC65", icon: FaUsers, path: "/feed", owns: ["/feed", "/communities", "/events"] },
  { key: "messages", title: "Messages", glyph: "\uD83D\uDCAC", icon: FaComments, path: "/messages", owns: ["/messages", "/ai-assistant"] },
  { key: "me", title: "Me", glyph: "\uD83D\uDC64", icon: FaUserCircle, path: "/profile", owns: ["/profile", "/notifications-me", "/settings", "/search"] },
];

export const adminTabs = [
  { key: "home", title: "Home", glyph: "\u2302", icon: FaHome, path: "/admin/dashboard", owns: ["/admin/dashboard"] },
  {
    key: "tools",
    title: "Tools",
    glyph: "\uD83D\uDEE0",
    icon: FaClipboardList,
    path: "/admin/tools",
    owns: ["/admin", "/notifications", "/lecturer/emergency-reports"],
  },
  { key: "campus", title: "Campus", glyph: "\uD83D\uDC65", icon: FaUsers, path: "/feed", owns: ["/feed", "/communities", "/events"] },
  { key: "messages", title: "Messages", glyph: "\uD83D\uDCAC", icon: FaComments, path: "/messages", owns: ["/messages"] },
  { key: "me", title: "Me", glyph: "\uD83D\uDC64", icon: FaUserCircle, path: "/profile", owns: ["/profile", "/notifications-me", "/settings", "/search"] },
];

// Which tab a path belongs to (longest owned path wins). Students by default; pass another
// role's tabs for lecturers and admins.
export const tabForPath = (pathname, tabs = studentTabs) => {
  let best = { key: null, length: -1 };

  tabs.forEach((tab) => {
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
  lecturer: lecturerTabs,
  admin: adminTabs,
};
