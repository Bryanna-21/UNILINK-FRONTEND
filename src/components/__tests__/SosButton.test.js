import { act } from "react";
import { createRoot } from "react-dom/client";
import SosButton, { HOLD_MS, COUNTDOWN_FROM } from "../SosButton";
import emergencyService from "../../services/emergencyService";

jest.mock("../../services/emergencyService", () => ({ __esModule: true, default: { reportEmergency: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const CONTACTS = [{ name: "Emergency services", phone: "999" }, { name: "Mobile emergency", phone: "112" }];

let container;
let root;
beforeEach(() => {
  jest.useFakeTimers();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  emergencyService.reportEmergency.mockReset();
  emergencyService.reportEmergency.mockResolvedValue({ status: "success", data: { notifiedContacts: [] } });
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.useRealTimers();
});

const render = () => act(async () => { root.render(<SosButton contacts={CONTACTS} />); });
const sosButton = () => container.querySelector("button[aria-label^='SOS']");
const fire = (el, type, props = {}) => act(async () => { el.dispatchEvent(Object.assign(new Event(type, { bubbles: true }), props)); });
const advance = (ms) => act(async () => { jest.advanceTimersByTime(ms); });
const text = () => container.textContent;
// Each countdown tick is scheduled after a render, so it is advanced one second at a time.
const ticks = async (n) => { for (let i = 0; i < n; i += 1) await advance(1000); };
const fullCountdown = async () => { await advance(HOLD_MS); await ticks(COUNTDOWN_FROM); await advance(50); };

test("a quick tap does nothing: no countdown and nothing sent", async () => {
  await render();
  await fire(sosButton(), "pointerdown");
  await advance(500);
  await fire(sosButton(), "pointerup");
  await advance(HOLD_MS + 10000);
  expect(text()).not.toMatch(/Sending SOS/);
  expect(emergencyService.reportEmergency).not.toHaveBeenCalled();
});

test("moving off the button before 3 seconds also cancels the hold", async () => {
  await render();
  await fire(sosButton(), "pointerdown");
  await advance(HOLD_MS - 100);
  await fire(sosButton(), "pointerout");
  await advance(5000);
  expect(emergencyService.reportEmergency).not.toHaveBeenCalled();
  expect(sosButton()).not.toBeNull();
});

test("holding for 3 seconds starts a 5 second countdown, which can be cancelled", async () => {
  await render();
  await fire(sosButton(), "pointerdown");
  await advance(HOLD_MS);
  expect(text()).toContain(String(COUNTDOWN_FROM));
  expect(text()).toContain("Sending SOS");
  await ticks(2);
  expect(text()).toContain(String(COUNTDOWN_FROM - 2));
  await act(async () => { [...container.querySelectorAll("button")].find((b) => b.textContent === "Cancel").click(); });
  await advance(10000);
  expect(emergencyService.reportEmergency).not.toHaveBeenCalled();
  expect(sosButton()).not.toBeNull();
});

test("hold, then the full countdown, sends exactly one SOS of type sos with the place", async () => {
  await render();
  const input = container.querySelector("input");
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, "  Library, 2nd floor ");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await fire(sosButton(), "pointerdown");
  await fullCountdown();
  expect(emergencyService.reportEmergency).toHaveBeenCalledTimes(1);
  expect(emergencyService.reportEmergency).toHaveBeenCalledWith({ type: "sos", location: "Library, 2nd floor" });
  expect(text()).toContain("SOS sent");
  await advance(20000);
  expect(emergencyService.reportEmergency).toHaveBeenCalledTimes(1);
});

test("no place typed means no location is sent", async () => {
  await render();
  await fire(sosButton(), "pointerdown");
  await fullCountdown();
  expect(emergencyService.reportEmergency).toHaveBeenCalledWith({ type: "sos", location: undefined });
});

test("after sending, the numbers are dialable links and nothing is called automatically", async () => {
  await render();
  await fire(sosButton(), "pointerdown");
  await fullCountdown();
  const links = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
  expect(links).toEqual(["tel:999", "tel:112"]);
});

test("trusted contacts being alerted is mentioned only when it happened", async () => {
  emergencyService.reportEmergency.mockResolvedValue({ data: { notifiedContacts: ["a"] } });
  await render();
  await fire(sosButton(), "pointerdown");
  await fullCountdown();
  expect(text()).toContain("trusted contacts were also alerted");
});

test("a failure says so, offers the numbers, and lets the person try again", async () => {
  emergencyService.reportEmergency.mockRejectedValue({ response: { data: { message: "You are restricted." } } });
  await render();
  await fire(sosButton(), "pointerdown");
  await fullCountdown();
  expect(text()).toContain("SOS could not be sent");
  expect(text()).toContain("You are restricted.");
  expect(container.querySelectorAll("a[href^='tel:']").length).toBe(2);
  await act(async () => { [...container.querySelectorAll("button")].find((b) => b.textContent === "Try again").click(); });
  expect(sosButton()).not.toBeNull();
});

test("the keyboard works: hold Space for 3 seconds, and releasing early cancels", async () => {
  await render();
  await fire(sosButton(), "keydown", { key: " " });
  await advance(1000);
  await fire(sosButton(), "keyup", { key: " " });
  await advance(10000);
  expect(emergencyService.reportEmergency).not.toHaveBeenCalled();
  await fire(sosButton(), "keydown", { key: "Enter" });
  await advance(HOLD_MS);
  expect(text()).toContain("Sending SOS");
});

test("unmounting in the middle of a hold leaves no timer behind", async () => {
  await render();
  await fire(sosButton(), "pointerdown");
  await advance(1000);
  act(() => root.unmount());
  await advance(HOLD_MS + 10000);
  expect(emergencyService.reportEmergency).not.toHaveBeenCalled();
  root = createRoot(container);
});
