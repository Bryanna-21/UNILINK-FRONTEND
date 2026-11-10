import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import Settings from "../Settings";
import Search from "../Search";
import peopleService from "../../services/peopleService";

jest.mock("../../components/PrivacySettingsCard", () => () => <div id="privacy-card">privacy card</div>);
jest.mock("../../services/peopleService");
global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root;
beforeEach(() => { container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container); jest.useFakeTimers(); jest.resetAllMocks(); });
afterEach(() => { act(() => root.unmount()); container.remove(); jest.useRealTimers(); });
const router = (el, path = "/") => <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{el}</MemoryRouter>;

test("Settings shows the real privacy card and the Safety links", async () => {
  await act(async () => { root.render(router(<Settings />)); });
  expect(container.querySelector("#privacy-card")).not.toBeNull();
  const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
  expect(hrefs).toContain("/settings/blocked");
  expect(hrefs).toContain("/community-standards");
  expect(container.textContent).not.toContain("Read the privacy notice");
});

test("a search result opens that person's profile", async () => {
  peopleService.search.mockResolvedValue({ data: [{ _id: "u1", name: "Amina", username: "amina", role: "student" }] });
  await act(async () => { root.render(router(<Search />, "/search?q=amina")); });
  await act(async () => { jest.advanceTimersByTime(400); await Promise.resolve(); await Promise.resolve(); });
  const link = container.querySelector("a.list-card-link");
  expect(link.getAttribute("href")).toBe("/user/u1");
  expect(link.getAttribute("aria-label")).toBe("Open Amina's profile");
});
