import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import EmergencyAlertBanner from "../EmergencyAlertBanner";
import emergencyAlertService from "../../services/emergencyAlertService";
import emergencyService from "../../services/emergencyService";

let mockRole = "admin";
jest.mock("../../context/AuthContext", () => ({ useAuth: () => ({ user: { id: "u1", role: mockRole } }) }));
jest.mock("../../services/emergencyAlertService", () => ({ __esModule: true, default: { getActiveAlerts: jest.fn() } }));
jest.mock("../../services/emergencyService", () => ({ __esModule: true, default: { acknowledgeReport: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const ALERT = { _id: "r1", studentName: "Amina Otieno", studentPhone: "0712345678", location: "Library", createdAt: "2026-10-31T10:00:00Z" };
const RESPONSE = { status: "success", count: 1, numbers: [{ name: "Emergency services", phone: "999" }], data: [ALERT] };

let container;
let root;
beforeEach(() => {
  jest.useFakeTimers();
  mockRole = "admin";
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  emergencyAlertService.getActiveAlerts.mockReset();
  emergencyService.acknowledgeReport.mockReset();
  emergencyAlertService.getActiveAlerts.mockResolvedValue(RESPONSE);
  emergencyService.acknowledgeReport.mockResolvedValue({});
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.useRealTimers();
});

const render = () => act(async () => { root.render(<MemoryRouter><EmergencyAlertBanner /></MemoryRouter>); });
const advance = (ms) => act(async () => { jest.advanceTimersByTime(ms); });
const button = (label) => [...container.querySelectorAll("button")].find((b) => b.textContent.includes(label));

test("an admin sees who needs help, where, a dialable phone, and the emergency numbers", async () => {
  await render();
  expect(container.textContent).toContain("SOS ALERT");
  expect(container.textContent).toContain("Amina Otieno");
  expect(container.textContent).toContain("Library");
  const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
  expect(hrefs).toContain("tel:0712345678");
  expect(hrefs).toContain("tel:999");
  expect(container.querySelector("[role='alert']")).not.toBeNull();
});

test("students and lecturers never see it and never ask the server", async () => {
  for (const role of ["student", "lecturer"]) {
    mockRole = role;
    emergencyAlertService.getActiveAlerts.mockClear();
    await render();
    expect(container.textContent).toBe("");
    expect(emergencyAlertService.getActiveAlerts).not.toHaveBeenCalled();
  }
});

test("nothing is shown when there is no active alert", async () => {
  emergencyAlertService.getActiveAlerts.mockResolvedValue({ status: "success", count: 0, numbers: [], data: [] });
  await render();
  expect(container.textContent).toBe("");
});

test("it asks again every 10 seconds, and a new SOS appears without a page reload", async () => {
  emergencyAlertService.getActiveAlerts.mockResolvedValueOnce({ data: [], numbers: [] });
  await render();
  expect(container.textContent).toBe("");
  await advance(10000);
  expect(container.textContent).toContain("Amina Otieno");
  expect(emergencyAlertService.getActiveAlerts.mock.calls.length).toBeGreaterThanOrEqual(2);
});

test("a failed check does not crash or clear what is on screen", async () => {
  await render();
  emergencyAlertService.getActiveAlerts.mockRejectedValue(new Error("offline"));
  await advance(10000);
  expect(container.textContent).toContain("Amina Otieno");
});

test("acknowledging calls the server for that report and removes it", async () => {
  await render();
  await act(async () => { button("Acknowledge").click(); });
  expect(emergencyService.acknowledgeReport).toHaveBeenCalledWith("r1");
  expect(container.textContent).toBe("");
});

test("a failed acknowledge keeps the alert visible and says why", async () => {
  emergencyService.acknowledgeReport.mockRejectedValue({ response: { data: { message: "Not allowed." } } });
  await render();
  await act(async () => { button("Acknowledge").click(); });
  expect(container.textContent).toContain("Amina Otieno");
  expect(container.textContent).toContain("Not allowed.");
});

test("with no audio unlocked yet, it says so instead of staying silently quiet", async () => {
  await render();
  expect(button("Turn on alert sound")).toBeTruthy();
});
