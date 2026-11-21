import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import ChangePassword from "../ChangePassword";

const mockAuth = { requestPasswordChange: jest.fn(), confirmPasswordChange: jest.fn(), logout: jest.fn() };
jest.mock("../../context/AuthContext", () => ({ useAuth: () => mockAuth }));
global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  Object.values(mockAuth).forEach((fn) => fn.mockReset());
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});
const mount = () => act(async () => { root.render(<MemoryRouter><ChangePassword /></MemoryRouter>); });
const type = (id, value) => act(async () => {
  const el = container.querySelector(`#${id}`);
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
});
const submit = () => act(async () => { container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); });
const alertText = () => container.querySelector('[role="alert"]')?.textContent || "";
const fillForm = async (cur = "OldPass-123", n = "Brand-New-Pass-9", a = n) => { await type("cp-current", cur); await type("cp-new", n); await type("cp-again", a); };

test("it asks for all three passwords before sending anything", async () => {
  await mount();
  await submit();
  expect(alertText()).toMatch(/fill in all three/);
  expect(mockAuth.requestPasswordChange).not.toHaveBeenCalled();
});

test("a new password under 8 characters, or two that differ, is refused here before the server is asked", async () => {
  await mount();
  await fillForm("OldPass-123", "short1", "short1");
  await submit();
  expect(alertText()).toMatch(/at least 8/);
  await fillForm("OldPass-123", "Brand-New-Pass-9", "Different-Pass-9");
  await submit();
  expect(alertText()).toMatch(/do not match/);
  expect(mockAuth.requestPasswordChange).not.toHaveBeenCalled();
});

test("a rejection from the server (for example a common password) is shown and the form stays", async () => {
  mockAuth.requestPasswordChange.mockResolvedValue({ success: false, message: "That password is very common and easy to guess. Choose something less predictable." });
  await mount();
  await fillForm("OldPass-123", "Password1234", "Password1234");
  await submit();
  expect(alertText()).toMatch(/very common/);
  expect(container.querySelector("#cp-code")).toBeNull();
});

test("the full flow: passwords, then the emailed code, then 'Sign in again' signs out", async () => {
  mockAuth.requestPasswordChange.mockResolvedValue({ success: true, message: "A code was sent to your email." });
  mockAuth.confirmPasswordChange.mockResolvedValue({ success: true, message: "Password changed. Please sign in again with your new password.", signedOut: true });
  await mount();
  await fillForm();
  await submit();
  expect(mockAuth.requestPasswordChange).toHaveBeenCalledWith("OldPass-123", "Brand-New-Pass-9", "Brand-New-Pass-9");
  expect(container.querySelector("#cp-code")).not.toBeNull();

  await type("cp-code", "12ab");
  await submit();
  expect(alertText()).toMatch(/6-digit code/);
  expect(mockAuth.confirmPasswordChange).not.toHaveBeenCalled();

  await type("cp-code", "123456");
  await submit();
  expect(mockAuth.confirmPasswordChange).toHaveBeenCalledWith("123456");
  expect(container.querySelector('[role="status"]').textContent).toMatch(/sign in again/i);
  expect(mockAuth.logout).not.toHaveBeenCalled();
  await act(async () => { [...container.querySelectorAll("button")].find((b) => /Sign in again/.test(b.textContent)).click(); });
  expect(mockAuth.logout).toHaveBeenCalledTimes(1);
});

test("a wrong code shows the server's message and stays on the code step", async () => {
  mockAuth.requestPasswordChange.mockResolvedValue({ success: true, message: "Sent." });
  mockAuth.confirmPasswordChange.mockResolvedValue({ success: false, message: "Invalid or expired code" });
  await mount();
  await fillForm();
  await submit();
  await type("cp-code", "000000");
  await submit();
  expect(alertText()).toBe("Invalid or expired code");
  expect(container.querySelector("#cp-code")).not.toBeNull();
});
