import fs from "fs";
import path from "path";
import { tabsForRole, activeTabKey, lecturerTabs, adminTabs } from "../roleTabs";
import { tabForPath, studentTabs } from "../navigation";
import { LECTURER_TOOL_GROUPS, ADMIN_TOOL_GROUPS } from "../toolHubs";

const routesSource = fs.readFileSync(path.join(__dirname, "../../routes/AppRoutes.js"), "utf8");

// The roles allowed on a route, read straight from AppRoutes.js: null = any signed-in role,
// undefined = no such route.
function allowedRoles(pathname) {
  const chunk = routesSource.split("<Route").find((c) => new RegExp(`^\\s+path="${pathname}"`).test(c));
  if (!chunk) return undefined;
  const guard = /<RoleGuard roles=\{\[([^\]]*)\]\}/.exec(chunk);
  return guard ? guard[1].split(",").map((r) => r.replace(/["'\s]/g, "")).filter(Boolean) : null;
}
const canOpen = (pathname, role) => {
  const roles = allowedRoles(pathname);
  return roles === undefined ? false : roles === null || roles.includes(role);
};

test("every role has exactly the app's five tabs", () => {
  expect(tabsForRole("student").map((t) => t.key)).toEqual(["home", "academics", "campus", "messages", "me"]);
  expect(tabsForRole("lecturer").map((t) => t.key)).toEqual(["home", "tools", "campus", "messages", "me"]);
  expect(tabsForRole("admin").map((t) => t.key)).toEqual(["home", "tools", "campus", "messages", "me"]);
  expect(tabsForRole("superadmin")).toBe(adminTabs);
});

test("an unknown or missing role has no tabs and highlights nothing", () => {
  for (const role of [undefined, null, "", "guest"]) {
    expect(tabsForRole(role)).toEqual([]);
    expect(activeTabKey(role, "/feed")).toBeNull();
  }
});

test("students are unchanged: the new lookup agrees with the old one for every path they own", () => {
  const paths = studentTabs.flatMap((t) => t.owns).flatMap((p) => [p, `${p}/abc`, `${p}/abc/def`]).concat(["/nowhere", "/"]);
  for (const p of paths) expect(activeTabKey("student", p)).toBe(tabForPath(p));
});

test("each tab opens a page its own role may open, and is highlighted there", () => {
  for (const [role, tabs] of [["lecturer", lecturerTabs], ["admin", adminTabs]]) {
    for (const tab of tabs) {
      expect(canOpen(tab.path, role)).toBe(true);
      expect(tab.owns).toContain(tab.path);
      expect(activeTabKey(role, tab.path)).toBe(tab.key);
    }
  }
});

test("every card in the Lecturer Tools hub points at a page a lecturer can open", () => {
  for (const [, , to] of LECTURER_TOOL_GROUPS.flatMap((g) => g.cards)) {
    expect({ to, ok: canOpen(to, "lecturer") }).toEqual({ to, ok: true });
  }
});

test("every card in the Admin Tools hub points at a page an admin can open", () => {
  for (const [, , to] of ADMIN_TOOL_GROUPS.flatMap((g) => g.cards)) {
    expect({ to, ok: canOpen(to, "admin") }).toEqual({ to, ok: true });
  }
});

test("nothing the old sidebars offered is lost: each old page is in the hub, a tab, or the Me menu", () => {
  const lecturerOld = ["/lecturer/dashboard", "/lecturer/courses", "/lecturer/upload-notes", "/lecturer/exams", "/lecturer/submissions", "/lecturer/emergency-reports", "/ai-assistant", "/lecturer/announcements", "/lecturer/analytics", "/messages", "/notifications-me", "/settings"];
  const meMenu = fs.readFileSync(path.join(__dirname, "../../pages/Profile.js"), "utf8");
  const reachable = new Set([
    ...lecturerTabs.map((t) => t.path),
    ...LECTURER_TOOL_GROUPS.flatMap((g) => g.cards.map((c) => c[2])),
    ...["/notifications-me", "/settings"].filter((p) => meMenu.includes(`"${p}"`)),
  ]);
  for (const p of lecturerOld) expect({ p, found: reachable.has(p) }).toEqual({ p, found: true });
});

test("paths inside a tab keep that tab lit, and the longest match wins", () => {
  expect(activeTabKey("lecturer", "/lecturer/exams/create")).toBe("tools");
  expect(activeTabKey("lecturer", "/lecturer/dashboard")).toBe("home");
  expect(activeTabKey("lecturer", "/ai-assistant")).toBe("tools");
  expect(activeTabKey("admin", "/lecturer/emergency-reports")).toBe("tools");
  expect(activeTabKey("admin", "/admin/users")).toBe("tools");
  expect(activeTabKey("admin", "/admin/dashboard")).toBe("home");
  expect(activeTabKey("admin", "/messages/abc")).toBe("messages");
  expect(activeTabKey("lecturer", "/admin/usersX")).toBeNull();
});

test("tab titles fit a phone tab bar", () => {
  for (const t of [...lecturerTabs, ...adminTabs]) expect((t.shortTitle || t.title).length).toBeLessThanOrEqual(10);
});
