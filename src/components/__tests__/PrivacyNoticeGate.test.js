import { act } from "react";
import { createRoot } from "react-dom/client";
import PrivacyNoticeGate from "../PrivacyNoticeGate";
import { acknowledgePrivacy, getLegalStatus } from "../../services/legalService";

jest.mock("../../services/legalService");
const mockLogout = jest.fn();
jest.mock("../../hooks/useAuth", () => () => ({ logout: mockLogout }));

global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;
const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); });
const render = async () => {
  await act(async () => { root.render(<PrivacyNoticeGate />); });
  await flush();
};
const buttons = () => Array.from(container.querySelectorAll("button"));
const byText = (t) => buttons().find((b) => b.textContent.includes(t));
const needs = (extra = {}) => ({ policyType: "privacy", currentVersion: "1.0", acknowledgedVersion: null, needsAcknowledgement: true, ...extra });

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

test("shows nothing when the current notice is already confirmed", async () => {
  getLegalStatus.mockResolvedValue(needs({ needsAcknowledgement: false, acknowledgedVersion: "1.0" }));
  await render();
  expect(container.innerHTML).toBe("");
});

test("fails open: if the status cannot be loaded the person is not blocked", async () => {
  getLegalStatus.mockRejectedValue(new Error("offline"));
  await render();
  expect(container.innerHTML).toBe("");
});

test("a new person sees a dialog with a link to the full notice and nothing pre-confirmed", async () => {
  getLegalStatus.mockResolvedValue(needs());
  await render();
  const dialog = container.querySelector('[role="dialog"]');
  expect(dialog).not.toBeNull();
  expect(dialog.getAttribute("aria-modal")).toBe("true");
  expect(dialog.textContent).toMatch(/Before you continue/);
  const link = container.querySelector('a[href="/privacy"]');
  expect(link.getAttribute("target")).toBe("_blank");
  expect(link.getAttribute("rel")).toMatch(/noopener/);
  expect(container.querySelector("input[type=checkbox]")).toBeNull();
  expect(acknowledgePrivacy).not.toHaveBeenCalled();
});

test("someone who confirmed an older version is told the notice changed", async () => {
  getLegalStatus.mockResolvedValue(needs({ acknowledgedVersion: "0.9" }));
  await render();
  expect(container.textContent).toMatch(/Privacy Notice has changed/);
});

test("confirming sends exactly the version shown, then the dialog goes away", async () => {
  getLegalStatus.mockResolvedValue(needs({ currentVersion: "2.0" }));
  acknowledgePrivacy.mockResolvedValue({ recorded: true });
  await render();
  await act(async () => { byText("I have read").click(); });
  await flush();
  expect(acknowledgePrivacy).toHaveBeenCalledTimes(1);
  expect(acknowledgePrivacy).toHaveBeenCalledWith("2.0");
  expect(container.innerHTML).toBe("");
});

test("if saving fails the dialog stays, says so, and nothing is treated as confirmed", async () => {
  getLegalStatus.mockResolvedValue(needs());
  acknowledgePrivacy.mockRejectedValue(new Error("network"));
  await render();
  await act(async () => { byText("I have read").click(); });
  await flush();
  expect(container.querySelector('[role="dialog"]')).not.toBeNull();
  expect(container.querySelector('[role="alert"]').textContent).toMatch(/couldn.t save/i);
  expect(byText("I have read").disabled).toBe(false);
});

test("an out-of-date version (409) reloads the status and asks the person to read the latest", async () => {
  getLegalStatus.mockResolvedValueOnce(needs({ currentVersion: "1.0" })).mockResolvedValue(needs({ currentVersion: "1.1" }));
  acknowledgePrivacy.mockRejectedValue({ response: { status: 409 } });
  await render();
  await act(async () => { byText("I have read").click(); });
  await flush();
  expect(getLegalStatus).toHaveBeenCalledTimes(2);
  expect(container.querySelector('[role="alert"]').textContent).toMatch(/just updated/);
  await act(async () => { acknowledgePrivacy.mockResolvedValue({}); byText("I have read").click(); });
  await flush();
  expect(acknowledgePrivacy).toHaveBeenLastCalledWith("1.1");
});

test("the person can log out instead, and Escape does not dismiss the dialog", async () => {
  getLegalStatus.mockResolvedValue(needs());
  await render();
  await act(async () => { document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
  expect(container.querySelector('[role="dialog"]')).not.toBeNull();
  await act(async () => { byText("Log out").click(); });
  expect(mockLogout).toHaveBeenCalledTimes(1);
  expect(acknowledgePrivacy).not.toHaveBeenCalled();
});

test("both buttons are disabled while saving, so a double click cannot record twice", async () => {
  getLegalStatus.mockResolvedValue(needs());
  let release;
  acknowledgePrivacy.mockReturnValue(new Promise((r) => { release = r; }));
  await render();
  await act(async () => { byText("I have read").click(); });
  expect(byText("Saving").disabled).toBe(true);
  expect(byText("Log out").disabled).toBe(true);
  await act(async () => { release({}); });
  await flush();
  expect(acknowledgePrivacy).toHaveBeenCalledTimes(1);
});
