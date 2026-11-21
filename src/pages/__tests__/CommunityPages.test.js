import { act } from "react";
import { createRoot } from "react-dom/client";
import StudentAnnouncements from "../Student/Announcements";
import Projects from "../Projects";
import announcementService from "../../services/announcementService";
import projectService from "../../services/projectService";

jest.mock("../../services/announcementService", () => ({ __esModule: true, default: { getAnnouncements: jest.fn() } }));
jest.mock("../../services/projectService", () => ({ __esModule: true, default: { getProjects: jest.fn(), createProject: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  jest.resetAllMocks();
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});
const mount = (el) => act(async () => { root.render(el); });
const type = (selector, value, proto = HTMLInputElement) => act(async () => {
  const el = container.querySelector(selector);
  Object.getOwnPropertyDescriptor(proto.prototype, "value").set.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
});

test("announcements are listed newest as the server sends them, as plain text", async () => {
  announcementService.getAnnouncements.mockResolvedValue({ data: [
    { _id: "a1", title: "Exams start Monday", body: "Bring your card.\n<b>not bold</b>", createdAt: "2026-11-14T10:00:00Z" },
    { _id: "a2", title: "Library hours", body: "Open until 9pm.", createdAt: "2026-11-10T10:00:00Z" },
  ] });
  await mount(<StudentAnnouncements />);
  expect(container.querySelectorAll("li").length).toBe(2);
  expect(container.textContent).toContain("Exams start Monday");
  expect(container.querySelector("li b")).toBeNull();
  expect(container.textContent).toContain("<b>not bold</b>");
});

test("no announcements says so, and a failure says so with a retry", async () => {
  announcementService.getAnnouncements.mockResolvedValueOnce({ data: [] });
  await mount(<StudentAnnouncements />);
  expect(container.textContent).toContain("No announcements yet.");
  announcementService.getAnnouncements.mockRejectedValueOnce({ response: { status: 500 } });
  await mount(<div />);
  await mount(<StudentAnnouncements />);
  expect(container.querySelector('[role="alert"]').textContent).toMatch(/couldn't load announcements/i);
  announcementService.getAnnouncements.mockResolvedValueOnce({ data: [{ _id: "a1", title: "Back online", body: "Hi", createdAt: "2026-11-14T10:00:00Z" }] });
  await act(async () => { [...container.querySelectorAll("button")].find((b) => /Try again/.test(b.textContent)).click(); });
  expect(container.textContent).toContain("Back online");
});

test("projects are listed with their status and contributors", async () => {
  projectService.getProjects.mockResolvedValue({ data: [
    { _id: "p1", title: "Campus Map", description: "A map app", status: "active", contributorIds: ["a", "b"] },
    { _id: "p2", title: "Study App", status: "planning", contributorIds: ["a"] },
  ] });
  await mount(<Projects />);
  const items = container.querySelectorAll("li");
  expect(items[0].textContent).toContain("Campus Map");
  expect(items[0].textContent).toContain("Active");
  expect(items[0].textContent).toContain("2 contributors");
  expect(items[1].textContent).toContain("1 contributor");
  expect(items[1].textContent).not.toContain("1 contributors");
});

test("a project needs a title; a good one is created and shown at the top", async () => {
  projectService.getProjects.mockResolvedValue({ data: [{ _id: "p1", title: "Old", status: "active", contributorIds: [] }] });
  projectService.createProject.mockResolvedValue({ data: { _id: "p9", title: "New idea", status: "planning", contributorIds: ["me"] } });
  await mount(<Projects />);
  await act(async () => { container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); });
  expect(container.querySelector('[role="alert"]').textContent).toMatch(/title/);
  expect(projectService.createProject).not.toHaveBeenCalled();

  await type("#proj-title", "  New idea  ");
  await act(async () => { container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); });
  expect(projectService.createProject).toHaveBeenCalledWith({ title: "New idea", description: "", status: "planning" });
  expect(container.querySelectorAll("li")[0].textContent).toContain("New idea");
  expect(container.querySelector("#proj-title").value).toBe("");
});

test("a server refusal while creating a project is shown", async () => {
  projectService.getProjects.mockResolvedValue({ data: [] });
  projectService.createProject.mockRejectedValue({ response: { status: 400, data: { message: "Title is too long" } } });
  await mount(<Projects />);
  await type("#proj-title", "x");
  await act(async () => { container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); });
  expect(container.querySelector('[role="alert"]').textContent).toBe("Title is too long");
});
