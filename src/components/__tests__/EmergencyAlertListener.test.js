import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import EmergencyAlertListener from "../EmergencyAlertListener";
import { io } from "socket.io-client";
import { createAlarm } from "../../utils/alarm";

jest.mock("socket.io-client", () => ({ io: jest.fn() }));
jest.mock("../../utils/alarm", () => ({ createAlarm: jest.fn() }));
let mockRole = "admin";
jest.mock("../../context/AuthContext", () => ({ useAuth: () => ({ user: { id: "me", role: mockRole } }) }));
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({ ...jest.requireActual("react-router-dom"), useNavigate: () => mockNavigate }));
global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root; let handlers; let socket; let alarm;
const alert = (extra = {}) => ({
  reportId: "r1", kind: "sos", ring: "1", title: "🚨 SOS from Amina", body: "Library", student: "Amina", message: "I am hurt",
  location: "Library", phone: "0711 111 111", numbers: JSON.stringify([{ label: "Police, ambulance and fire", number: "999" }, { label: "General emergency (112)", number: "112" }]), ...extra,
});
const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); });
const render = async () => { await act(async () => { root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><EmergencyAlertListener /></MemoryRouter>); }); };
const fire = async (payload) => { await act(async () => { await handlers["emergency:alert"](payload); }); await flush(); };
const button = (label) => [...container.querySelectorAll("button")].find((b) => b.textContent === label);

beforeEach(() => {
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
  jest.resetAllMocks();
  mockRole = "admin";
  handlers = {};
  socket = { on: jest.fn((e, fn) => { handlers[e] = fn; }), disconnect: jest.fn() };
  io.mockReturnValue(socket);
  alarm = { start: jest.fn().mockResolvedValue(true), stop: jest.fn(), resume: jest.fn().mockResolvedValue(true), isSupported: true };
  createAlarm.mockReturnValue(alarm);
  localStorage.setItem("token", "jwt");
});
afterEach(() => { act(() => root.unmount()); container.remove(); localStorage.clear(); });

test("connects with the login token and shows nothing until an alert arrives", async () => {
  await render();
  expect(io).toHaveBeenCalledWith(expect.any(String), { auth: { token: "jwt" }, transports: ["websocket"] });
  expect(container.querySelector("[role=alertdialog]")).toBeNull();
});

test("an SOS takes over the screen with who, what, where, and a way to call", async () => {
  await render();
  await fire(alert());
  const dialog = container.querySelector("[role=alertdialog]");
  expect(dialog.textContent).toContain("SOS from Amina");
  expect(dialog.textContent).toContain("Amina needs help");
  expect(dialog.textContent).toContain("I am hurt");
  expect(dialog.textContent).toContain("Location: Library");
  const links = [...dialog.querySelectorAll("a")].map((a) => a.getAttribute("href"));
  expect(links).toEqual(["tel:0711111111", "tel:999", "tel:112"]);
  expect(alarm.start).toHaveBeenCalledTimes(1);
});

test("Silence stops the sound but keeps the details; Dismiss closes everything", async () => {
  await render();
  await fire(alert());
  await act(async () => { button("Silence").click(); });
  expect(alarm.stop).toHaveBeenCalled();
  expect(container.querySelector("[role=alertdialog]")).not.toBeNull();
  await act(async () => { button("Dismiss").click(); });
  expect(container.querySelector("[role=alertdialog]")).toBeNull();
});

test("the same report is never shown twice", async () => {
  await render();
  await fire(alert());
  await act(async () => { button("Dismiss").click(); });
  await fire(alert());
  expect(container.querySelector("[role=alertdialog]")).toBeNull();
  await fire(alert({ reportId: "r2" }));
  expect(container.querySelector("[role=alertdialog]")).not.toBeNull();
});

test("a quiet alert (a confidential report) shows no alarm and no Silence button", async () => {
  await render();
  await fire({ reportId: "r3", kind: "abuse", ring: "0", title: "New confidential report", body: "A confidential report was filed. Open UniLink to read it.", numbers: "[]" });
  expect(alarm.start).not.toHaveBeenCalled();
  expect(button("Silence")).toBeUndefined();
  expect(container.textContent).toContain("A confidential report was filed");
});

test("staff can open the reports page; an emergency contact cannot", async () => {
  await render();
  await fire(alert());
  await act(async () => { button("Open reports").click(); });
  expect(mockNavigate).toHaveBeenCalledWith("/lecturer/emergency-reports");
  expect(container.querySelector("[role=alertdialog]")).toBeNull();
});

test("a student who is someone's emergency contact sees no reports button", async () => {
  mockRole = "student";
  await render();
  await fire(alert());
  expect(button("Open reports")).toBeUndefined();
  expect(container.textContent).toContain("Call 999");
});

test("bad or unsafe numbers are dropped, never turned into links", async () => {
  await render();
  await fire(alert({ phone: "", numbers: JSON.stringify([{ label: "x", number: "javascript:alert(1)" }, { label: "ok", number: "112" }, { label: "no", number: 5 }]) }));
  const links = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
  expect(links).toEqual(["tel:112"]);
  act(() => root.unmount());
  root = createRoot(container);
  await render();
  await fire(alert({ reportId: "r9", numbers: "not json" }));
  expect(container.querySelector("[role=alertdialog]")).not.toBeNull();
});

test("when the browser blocks sound it asks for a click, and a click turns the sound on", async () => {
  alarm.start.mockResolvedValue(false);
  alarm.resume.mockResolvedValue(true);
  await render();
  await fire(alert());
  expect(container.textContent).toContain("waiting for a click");
  await act(async () => { document.dispatchEvent(new Event("pointerdown")); });
  await flush();
  expect(alarm.resume).toHaveBeenCalled();
  expect(container.textContent).not.toContain("waiting for a click");
});

test("a browser that cannot play sound at all is not asked for a click", async () => {
  alarm.start.mockResolvedValue(false);
  alarm.isSupported = false;
  await render();
  await fire(alert());
  expect(container.textContent).not.toContain("waiting for a click");
});

test("does not connect without a login token", async () => {
  localStorage.clear();
  await render();
  expect(io).not.toHaveBeenCalled();
});

test("leaving the page disconnects and silences", async () => {
  await render();
  await fire(alert());
  act(() => root.unmount());
  expect(socket.disconnect).toHaveBeenCalled();
  expect(alarm.stop).toHaveBeenCalled();
  root = createRoot(container);
});
