import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import MyNotifications from "../MyNotifications";
import service from "../../services/userNotificationService";

jest.mock("../../services/userNotificationService");
jest.mock("react-hot-toast", () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({ ...jest.requireActual("react-router-dom"), useNavigate: () => mockNavigate }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const note = (id, type, title, read = false, link = "") => ({ _id: id, type, title, read, link, createdAt: "2026-10-27T10:00:00Z" });
const counts = { all: 5, followers: 1, activity: 2, mentions: 1, updates: 1 };

let container;
let root;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  jest.resetAllMocks();
  service.getMyNotifications.mockResolvedValue({ data: [note("n1", "new_follower", "Amina started following you", false, "/user/u1")], counts });
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); });
const render = async () => { await act(async () => { root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><MyNotifications /></MemoryRouter>); }); await flush(); };
const tab = (label) => [...container.querySelectorAll("button.mn-tab")].find((b) => b.textContent.startsWith(label));

test("has the five tabs, with unread counts on the ones that have any", async () => {
  await render();
  const labels = [...container.querySelectorAll("button.mn-tab")].map((b) => b.textContent.replace(/\d+$/, ""));
  expect(labels).toEqual(["All", "Followers", "Likes & comments", "Mentions & tags", "Updates"]);
  expect(tab("All").querySelector(".mn-tab-badge").textContent).toBe("5");
  expect(tab("Likes & comments").querySelector(".mn-tab-badge").textContent).toBe("2");
});

test("starts on All, and asks the server for the tab you pick", async () => {
  await render();
  expect(service.getMyNotifications).toHaveBeenLastCalledWith("all");
  await act(async () => { tab("Followers").click(); });
  await flush();
  expect(service.getMyNotifications).toHaveBeenLastCalledWith("followers");
  expect(tab("Followers").getAttribute("aria-selected")).toBe("true");
  await act(async () => { tab("Mentions").click(); });
  await flush();
  expect(service.getMyNotifications).toHaveBeenLastCalledWith("mentions");
});

test("an empty tab says which tab is empty", async () => {
  service.getMyNotifications.mockResolvedValue({ data: [], counts: { all: 0, followers: 0, activity: 0, mentions: 0, updates: 0 } });
  await render();
  expect(container.textContent).toContain("No notifications yet.");
  await act(async () => { tab("Likes").click(); });
  await flush();
  expect(container.textContent).toContain("No likes & comments yet.");
});

test("opening one marks it read, lowers its tab and All, and a follower has nowhere to go", async () => {
  service.markNotificationRead.mockResolvedValue({});
  await render();
  await act(async () => { container.querySelector(".mn-item").click(); });
  await flush();
  expect(service.markNotificationRead).toHaveBeenCalledWith("n1");
  expect(tab("All").querySelector(".mn-tab-badge").textContent).toBe("4");
  expect(tab("Followers")).toBeDefined();
  expect(tab("Followers").querySelector(".mn-tab-badge")).toBeNull();
  expect(mockNavigate).not.toHaveBeenCalled();
});

test("a like or comment opens the Campus feed", async () => {
  service.getMyNotifications.mockResolvedValue({ data: [note("n2", "post_like", "Brian liked your post", true, "/post/p1")], counts });
  await render();
  await act(async () => { container.querySelector(".mn-item").click(); });
  await flush();
  expect(mockNavigate).toHaveBeenCalledWith("/feed");
});

test("Mark all read clears only the tab you are on, then reloads the counts", async () => {
  service.markAllRead.mockResolvedValue({});
  await render();
  await act(async () => { tab("Followers").click(); });
  await flush();
  await act(async () => { container.querySelector(".mn-mark-all").click(); });
  await flush();
  expect(service.markAllRead).toHaveBeenCalledWith("followers");
  expect(service.getMyNotifications.mock.calls.length).toBeGreaterThanOrEqual(3);
});

test("the Mark all read button hides when the current tab has nothing unread", async () => {
  service.getMyNotifications.mockResolvedValue({ data: [], counts: { ...counts, followers: 0 } });
  await render();
  await act(async () => { tab("Followers").click(); });
  await flush();
  expect(container.querySelector(".mn-mark-all")).toBeNull();
});
