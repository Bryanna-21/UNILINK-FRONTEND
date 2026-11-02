import { act } from "react";
import { createRoot } from "react-dom/client";
import ManageRoles from "../ManageRoles";
import roleService from "../../../services/roleService";

jest.mock("../../../services/roleService", () => ({ __esModule: true, default: { searchUsers: jest.fn(), changeRole: jest.fn() } }));
jest.mock("react-hot-toast", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const STUDENT = { id: "s1", name: "Amina Otieno", email: "amina@uni.ac.ke", username: "amina", role: "student" };
const LECTURER = { id: "l1", name: "Dr Kamau", email: "kamau@uni.ac.ke", username: "", role: "lecturer" };

let container;
let root;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  roleService.searchUsers.mockReset();
  roleService.changeRole.mockReset();
  roleService.searchUsers.mockResolvedValue({ data: [STUDENT, LECTURER] });
  roleService.changeRole.mockResolvedValue({ status: "success" });
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const type = (el, value) =>
  act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
const submit = () => act(async () => { container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); });
const button = (label) => [...container.querySelectorAll("button")].find((b) => b.textContent.trim() === label);
const click = (el) => act(async () => { el.click(); });
const render = () => act(async () => { root.render(<ManageRoles />); });
const searchFor = async (q) => { await type(container.querySelector("input[aria-label='Search users']"), q); await submit(); };

test("it asks for a search first and never loads everyone", async () => {
  await render();
  expect(container.textContent).toContain("Search for the person first.");
  expect(roleService.searchUsers).not.toHaveBeenCalled();
});

test("a search under 2 letters is refused on the page, without calling the server", async () => {
  await render();
  await searchFor("a");
  expect(container.textContent).toContain("at least 2 letters");
  expect(roleService.searchUsers).not.toHaveBeenCalled();
});

test("results show each person's role and the right single action", async () => {
  await render();
  await searchFor("am");
  expect(roleService.searchUsers).toHaveBeenCalledWith({ q: "am" });
  expect(container.textContent).toContain("Amina Otieno");
  expect(button("Make lecturer")).toBeTruthy();
  expect(button("Make student")).toBeTruthy();
  expect(button("Make admin")).toBeUndefined();
});

test("nothing changes until Confirm is pressed, and Cancel backs out", async () => {
  await render();
  await searchFor("am");
  await click(button("Make lecturer"));
  expect(container.textContent).toContain("signed out and must sign in again");
  expect(roleService.changeRole).not.toHaveBeenCalled();
  await click(button("Cancel"));
  expect(roleService.changeRole).not.toHaveBeenCalled();
  expect(button("Make lecturer")).toBeTruthy();
});

test("confirming makes a student a lecturer with the department, and the row updates", async () => {
  await render();
  await searchFor("am");
  await click(button("Make lecturer"));
  await type(container.querySelector("input[aria-label='Department, optional']"), "  Computer Science ");
  await click(button("Confirm"));
  expect(roleService.changeRole).toHaveBeenCalledWith("s1", { role: "lecturer", department: "Computer Science" });
  expect(container.querySelectorAll(".mr-badge")[0].textContent).toBe("lecturer");
  expect(button("Make student")).toBeTruthy();
});

test("a lecturer is turned back into a student with no department field", async () => {
  await render();
  await searchFor("ka");
  const buttons = [...container.querySelectorAll("button")].filter((b) => b.textContent === "Make student");
  await click(buttons[0]);
  expect(container.querySelector("input[aria-label='Department, optional']")).toBeNull();
  await click(button("Confirm"));
  expect(roleService.changeRole).toHaveBeenCalledWith("l1", { role: "student" });
});

test("a server refusal is shown on that person and nothing changes on screen", async () => {
  roleService.changeRole.mockRejectedValue({ response: { data: { message: "Only active accounts can be promoted." } } });
  await render();
  await searchFor("am");
  await click(button("Make lecturer"));
  await click(button("Confirm"));
  expect(container.textContent).toContain("Only active accounts can be promoted.");
  expect(container.querySelectorAll(".mr-badge")[0].textContent).toBe("student");
});

test("a failed search shows the server's message", async () => {
  roleService.searchUsers.mockRejectedValue({ response: { data: { message: "Admins only." } } });
  await render();
  await searchFor("am");
  expect(container.textContent).toContain("Admins only.");
});

test("an empty result says so", async () => {
  roleService.searchUsers.mockResolvedValue({ data: [] });
  await render();
  await searchFor("zz");
  expect(container.textContent).toContain("No matching students or lecturers");
});
