import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import LecturerTools from "../Lecturer/LecturerTools";
import AdminTools from "../Admin/AdminTools";
import { navigation } from "../../constants/navigation";
global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root;
beforeEach(() => { container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); });
const render = (el) => act(async () => { root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{el}</MemoryRouter>); });
const links = () => [...container.querySelectorAll("a.sh-nav-card")].map((a) => a.getAttribute("href"));

test("Lecturer Tools leads to every lecturer page", async () => {
  await render(<LecturerTools />);
  expect(container.querySelector("h1").textContent).toBe("Lecturer Tools");
  expect(links()).toEqual(["/lecturer/courses", "/lecturer/upload-notes", "/lecturer/exams", "/lecturer/submissions", "/lecturer/announcements", "/lecturer/analytics", "/ai-assistant", "/lecturer/emergency-reports"]);
});

test("Admin Tools leads to the admin pages an admin can open", async () => {
  await render(<AdminTools />);
  expect(container.querySelector("h1").textContent).toBe("Admin Tools");
  expect(links()).toEqual(["/admin/users", "/lecturer/emergency-reports", "/notifications", "/notifications-me"]);
});

test("the Tools tab of each role opens its hub", () => {
  expect(navigation.lecturer.find((t) => t.key === "tools").path).toBe("/lecturer/tools");
  expect(navigation.admin.find((t) => t.key === "tools").path).toBe("/admin/tools");
});
