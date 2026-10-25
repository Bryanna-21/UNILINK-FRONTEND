import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import PrivacySettingsCard from "../PrivacySettingsCard";
import { getLegalStatus } from "../../services/legalService";

jest.mock("../../services/legalService");
global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;
const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); });
const render = async () => {
  await act(async () => { root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><PrivacySettingsCard /></MemoryRouter>); });
  await flush();
};
beforeEach(() => { container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container); jest.resetAllMocks(); });
afterEach(() => { act(() => root.unmount()); container.remove(); });

test("shows which version was confirmed and when", async () => {
  getLegalStatus.mockResolvedValue({ acknowledgedVersion: "1.0", acknowledgedAt: "2026-10-24T10:00:00.000Z", needsAcknowledgement: false });
  await render();
  expect(container.textContent).toMatch(/confirmed you read version 1\.0 on .*2026/);
});
test("says so plainly when the current notice has not been confirmed", async () => {
  getLegalStatus.mockResolvedValue({ acknowledgedVersion: null, needsAcknowledgement: true });
  await render();
  expect(container.textContent).toMatch(/haven.t confirmed/);
});
test("says it could not check, and does not claim a state, when the server is unreachable", async () => {
  getLegalStatus.mockRejectedValue(new Error("down"));
  await render();
  expect(container.textContent).toMatch(/couldn.t check/);
  expect(container.textContent).not.toMatch(/confirmed you read/);
});
test("always links to the notice, and is honest that the website cannot delete an account yet", async () => {
  getLegalStatus.mockResolvedValue({ acknowledgedVersion: "1.0", needsAcknowledgement: false });
  await render();
  expect(container.querySelector('a[href="/privacy"]')).not.toBeNull();
  expect(container.textContent).toMatch(/website can.t do this yet/);
  expect(container.textContent).not.toMatch(/Coming soon/);
});
