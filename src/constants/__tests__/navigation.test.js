import { navigation, tabForPath, studentTabs, lecturerTabs, adminTabs } from "../navigation";

const keys = (tabs) => tabs.map((t) => t.key);
const FIVE = ["home", "tools", "campus", "messages", "me"];

test("every role gets exactly five tabs", () => {
  expect(keys(studentTabs)).toEqual(["home", "academics", "campus", "messages", "me"]);
  expect(keys(lecturerTabs)).toEqual(FIVE);
  expect(keys(adminTabs)).toEqual(FIVE);
  expect(navigation.student).toBe(studentTabs);
  expect(navigation.lecturer).toBe(lecturerTabs);
  expect(navigation.admin).toBe(adminTabs);
  expect(navigation.superadmin).toBeUndefined();
});

test("students are unchanged: the default tabs", () => {
  expect(tabForPath("/student/dashboard")).toBe("home");
  expect(tabForPath("/student/courses/abc")).toBe("academics");
  expect(tabForPath("/clubs")).toBe("academics");
  expect(tabForPath("/feed")).toBe("campus");
  expect(tabForPath("/messages/c1")).toBe("messages");
  expect(tabForPath("/notifications-me")).toBe("me");
  expect(tabForPath("/nowhere")).toBeNull();
});

test("lecturer pages belong to Tools, except the dashboard, which is Home", () => {
  for (const path of ["/lecturer/courses", "/lecturer/upload-notes", "/lecturer/exams/123", "/lecturer/submissions", "/lecturer/announcements", "/lecturer/analytics", "/lecturer/emergency-reports", "/lecturer/tools"]) {
    expect(tabForPath(path, lecturerTabs)).toBe("tools");
  }
  expect(tabForPath("/lecturer/dashboard", lecturerTabs)).toBe("home");
  expect(tabForPath("/feed", lecturerTabs)).toBe("campus");
  expect(tabForPath("/messages", lecturerTabs)).toBe("messages");
  expect(tabForPath("/ai-assistant", lecturerTabs)).toBe("messages");
  expect(tabForPath("/profile/edit", lecturerTabs)).toBe("me");
  expect(tabForPath("/notifications-me", lecturerTabs)).toBe("me");
});

test("admin pages belong to Tools, except the dashboard; emergency reports are a tool for admins too", () => {
  for (const path of ["/admin/users", "/admin/tools", "/notifications", "/lecturer/emergency-reports"]) {
    expect(tabForPath(path, adminTabs)).toBe("tools");
  }
  expect(tabForPath("/admin/dashboard", adminTabs)).toBe("home");
  expect(tabForPath("/messages", adminTabs)).toBe("messages");
  expect(tabForPath("/notifications-me", adminTabs)).toBe("me");
});

test("an admin's /notifications (admin alerts) is not mistaken for /notifications-me", () => {
  expect(tabForPath("/notifications", adminTabs)).toBe("tools");
  expect(tabForPath("/notifications-me", adminTabs)).toBe("me");
});

test("every tab has a title, a path, an icon and a glyph", () => {
  for (const tab of [...studentTabs, ...lecturerTabs, ...adminTabs]) {
    expect(tab.title && tab.path && tab.glyph).toBeTruthy();
    expect(typeof tab.icon).toBe("function");
    expect(tab.owns.length).toBeGreaterThan(0);
  }
});
