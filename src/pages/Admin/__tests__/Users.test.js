import { act } from "react";
import { createRoot } from "react-dom/client";
import Users from "../Users";
import { getUsers, changeUserRole } from "../../../services/adminService";

jest.mock("../../../services/adminService");
jest.mock("react-hot-toast", () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;
const { toast } = require("react-hot-toast");

const people = () => [
  { id: "s1", name: "Amina", email: "a@x.test", role: "student", status: "active", university: "UoN", assignableRoles: ["lecturer"] },
  { id: "l1", name: "Cate", email: "c@x.test", role: "lecturer", status: "active", university: "UoN", assignableRoles: [] },
  { id: "s2", name: "Dan", email: "d@x.test", role: "student", status: "active", university: "UoN", assignableRoles: ["lecturer", "admin"] },
];

let container; let root;
beforeEach(() => {
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
  jest.resetAllMocks();
  getUsers.mockResolvedValue(people());
  window.confirm = jest.fn(() => true);
});
afterEach(() => { act(() => root.unmount()); container.remove(); });
const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); });
const render = async () => { await act(async () => { root.render(<Users />); }); await flush(); };
const rowFor = (name) => [...container.querySelectorAll("tbody tr")].find((r) => r.textContent.includes(name));
const buttons = (name) => [...rowFor(name).querySelectorAll(".role-btn")].map((b) => b.textContent);

test("each person shows only the role buttons that will work", async () => {
  await render();
  expect(buttons("Amina")).toEqual(["Make lecturer"]);
  expect(buttons("Cate")).toEqual([]);
  expect(buttons("Dan")).toEqual(["Make lecturer", "Make admin"]);
});

test("making a student a lecturer asks first, calls the server, and refreshes the list", async () => {
  changeUserRole.mockResolvedValue({ message: "Amina is now a lecturer. They will need to sign in again." });
  await render();
  getUsers.mockResolvedValue([{ ...people()[0], role: "lecturer", assignableRoles: [] }, people()[1], people()[2]]);
  await act(async () => { rowFor("Amina").querySelector(".role-btn").click(); });
  await flush();
  expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining("Make Amina a lecturer?"));
  expect(changeUserRole).toHaveBeenCalledWith("s1", "lecturer");
  expect(toast.success).toHaveBeenCalledWith("Amina is now a lecturer. They will need to sign in again.");
  expect(buttons("Amina")).toEqual([]);
  expect(rowFor("Amina").textContent).toContain("Lecturer");
});

test("saying no at the confirmation changes nothing", async () => {
  window.confirm = jest.fn(() => false);
  await render();
  await act(async () => { rowFor("Amina").querySelector(".role-btn").click(); });
  expect(changeUserRole).not.toHaveBeenCalled();
});

test("a refusal from the server is shown to the person who asked", async () => {
  changeUserRole.mockRejectedValue({ response: { data: { message: "You can only change roles at your own university." } } });
  await render();
  await act(async () => { rowFor("Amina").querySelector(".role-btn").click(); });
  await flush();
  expect(toast.error).toHaveBeenCalledWith("You can only change roles at your own university.");
});

test("the table has a Change role column", async () => {
  await render();
  expect([...container.querySelectorAll("thead th")].map((th) => th.textContent.trim())).toEqual(["User", "Role", "University", "Status", "Change role"]);
});
