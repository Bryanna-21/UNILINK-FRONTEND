import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const APP = "UniLink";
const DEFAULT_DESCRIPTION =
  "UniLink - Africa's academic social network for Kenyan universities";

// Explicit titles (and, for public pages, descriptions). Anything not
// listed here gets a title derived from its path, so a new route is
// never left as a bare "UniLink".
const PAGES = {
  "/login": ["Sign in", "Sign in to UniLink to reach your units, notes, assignments and campus community."],
  "/register": ["Create your account", "Join UniLink, the academic social network for Kenyan universities."],
  "/forgot-password": ["Reset your password"],
  "/verify-otp": ["Verify your email"],
  "/verify-login-otp": ["Verify your sign-in"],
  "/download": ["Get the app", "Download the UniLink Android app."],
  "/privacy": ["Privacy notice", "How UniLink collects, uses and protects your information."],
  "/unauthorized": ["Access denied"],
  "/student/dashboard": ["Dashboard"],
  "/lecturer/dashboard": ["Dashboard"],
  "/admin/dashboard": ["Dashboard"],
  "/ai-assistant": ["AI Study Assistant"],
  "/notifications-me": ["Notifications"],
  "/student/my-reports": ["My emergency reports"],
  "/lecturer/emergency-reports": ["Emergency reports"],
  "/lost-and-found": ["Lost & Found"],
  "/profile/edit": ["Edit profile"],
  "/events/create": ["Create event"],
  "/communities/create": ["Create community"],
  "/lecturer/exams/create": ["Create exam"],
};

const ROLE_PREFIXES = new Set(["student", "lecturer", "admin", "superadmin"]);
const ID_SEGMENT = /^([0-9a-f]{24}|\d+)$/i;

const titleCase = (slug) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const resolve = (pathname) => {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (PAGES[path]) return PAGES[path];
  if (path === "/") return [null];

  const segments = path
    .split("/")
    .filter(Boolean)
    .filter((segment) => !ID_SEGMENT.test(segment));

  const meaningful = segments.filter((segment, index) =>
    index === 0 && ROLE_PREFIXES.has(segment) ? false : true
  );

  if (meaningful.length === 0) return [null];

  return [meaningful.map(titleCase).join(" · ")];
};

const setMetaDescription = (content) => {
  let tag = document.querySelector('meta[name="description"]');

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

// Mounted once inside the router. Keeps the browser tab title and the
// meta description in step with the current page.
export default function DocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const [title, description] = resolve(pathname);

    document.title = title ? `${title} · ${APP}` : APP;
    setMetaDescription(description || DEFAULT_DESCRIPTION);
  }, [pathname]);

  return null;
}
