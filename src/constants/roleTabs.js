import { FaHome, FaTools, FaUsers, FaComments, FaUserCircle } from "react-icons/fa";
import { studentTabs } from "./navigation";

// Every role gets the same five tabs as the app: Home, a work hub, Campus, Messages, Me.
// Students keep Academics (see navigation.js). Lecturers get "Lecturer Tools" and admins get
// "Admin Tools"; everything that used to crowd their sidebars now lives inside that hub
// (pages/Lecturer/LecturerTools.js, pages/Admin/AdminTools.js), the same way the student's
// coursework lives inside Academics.
//
// "owns" lists the paths that keep a tab highlighted. A path can belong to different tabs for
// different roles on purpose (for example /lecturer/emergency-reports is a tool for both).

const campus = { key: "campus", title: "Campus", glyph: "\uD83D\uDC65", icon: FaUsers, path: "/feed", owns: ["/feed"] };
const messages = { key: "messages", title: "Messages", glyph: "\uD83D\uDCAC", icon: FaComments, path: "/messages", owns: ["/messages"] };

export const lecturerTabs = [
  { key: "home", title: "Home", glyph: "\u2302", icon: FaHome, path: "/lecturer/dashboard", owns: ["/lecturer/dashboard"] },
  {
    key: "tools",
    title: "Lecturer Tools",
    shortTitle: "Tools",
    glyph: "\uD83D\uDEE0",
    icon: FaTools,
    path: "/lecturer/tools",
    owns: [
      "/lecturer/tools",
      "/lecturer/courses",
      "/lecturer/upload-notes",
      "/lecturer/exams",
      "/lecturer/submissions",
      "/lecturer/announcements",
      "/lecturer/analytics",
      "/lecturer/emergency-reports",
      "/ai-assistant",
    ],
  },
  campus,
  messages,
  {
    key: "me",
    title: "Me",
    glyph: "\uD83D\uDC64",
    icon: FaUserCircle,
    path: "/profile",
    owns: ["/profile", "/notifications-me", "/settings", "/search"],
  },
];

export const adminTabs = [
  { key: "home", title: "Home", glyph: "\u2302", icon: FaHome, path: "/admin/dashboard", owns: ["/admin/dashboard"] },
  {
    key: "tools",
    title: "Admin Tools",
    shortTitle: "Tools",
    glyph: "\uD83D\uDEE0",
    icon: FaTools,
    path: "/admin/tools",
    owns: [
      "/admin/tools",
      "/admin/users",
      "/admin/roles",
      "/notifications",
      "/lecturer/emergency-reports",
      "/lecturer/exams",
      "/lecturer/submissions",
    ],
  },
  campus,
  messages,
  {
    key: "me",
    title: "Me",
    glyph: "\uD83D\uDC64",
    icon: FaUserCircle,
    path: "/profile",
    owns: ["/profile", "/settings", "/search"],
  },
];

export const tabsForRole = (role) => {
  if (role === "student") return studentTabs;
  if (role === "lecturer") return lecturerTabs;
  if (role === "admin" || role === "superadmin") return adminTabs;
  return [];
};

// Which tab a path belongs to for this role (longest owned path wins), or null.
export const activeTabKey = (role, pathname) => {
  let best = { key: null, length: -1 };

  tabsForRole(role).forEach((tab) => {
    tab.owns.forEach((owned) => {
      const hit = pathname === owned || pathname.startsWith(`${owned}/`);

      if (hit && owned.length > best.length) {
        best = { key: tab.key, length: owned.length };
      }
    });
  });

  return best.key;
};
