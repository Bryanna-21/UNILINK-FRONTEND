import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import SecurityCard from "../SecurityCard";

const mockAuth = { logoutEverywhere: jest.fn() };
jest.mock("../../context/AuthContext", () => ({ useAuth: () => mockAuth }));
global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  mockAuth.logoutEverywhere.mockReset();
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.restoreAllMocks();
});
const mount = () => act(async () => { root.render(<MemoryRouter><SecurityCard /></MemoryRouter>); });
const signOutButton = () => [...container.querySelectorAll("button")].find((b) => /Sign out of all devices/.test(b.textContent));

test("it links to the change-password page", async () => {
  await mount();
  expect(container.querySelector('a[href="/settings/change-password"]')).not.toBeNull();
});

test("signing out of all devices asks first, and does nothing if the person says no", async () => {
  jest.spyOn(window, "confirm").mockReturnValue(false);
  await mount();
  await act(async () => { signOutButton().click(); });
  expect(window.confirm).toHaveBeenCalledTimes(1);
  expect(mockAuth.logoutEverywhere).not.toHaveBeenCalled();
});

test("when confirmed it signs out everywhere", async () => {
  jest.spyOn(window, "confirm").mockReturnValue(true);
  mockAuth.logoutEverywhere.mockResolvedValue({ success: true });
  await mount();
  await act(async () => { signOutButton().click(); });
  expect(mockAuth.logoutEverywhere).toHaveBeenCalledTimes(1);
  expect(container.querySelector('[role="alert"]')).toBeNull();
});

test("a failure is shown, not hidden", async () => {
  jest.spyOn(window, "confirm").mockReturnValue(true);
  mockAuth.logoutEverywhere.mockResolvedValue({ success: false, message: "Could not sign out of all devices. Please try again." });
  await mount();
  await act(async () => { signOutButton().click(); });
  expect(container.querySelector('[role="alert"]').textContent).toMatch(/Could not sign out/);
});

test("rendered without a sign-in context it still shows the card and does not crash", async () => {
  const real = jest.requireMock("../../context/AuthContext");
  const original = real.useAuth;
  real.useAuth = () => null;
  try {
    await mount();
    expect(container.textContent).toContain("Security");
    jest.spyOn(window, "confirm").mockReturnValue(true);
    await act(async () => { signOutButton().click(); });
    expect(mockAuth.logoutEverywhere).not.toHaveBeenCalled();
  } finally {
    real.useAuth = original;
  }
});
