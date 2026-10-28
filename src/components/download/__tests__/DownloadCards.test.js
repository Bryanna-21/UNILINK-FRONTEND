import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import DownloadCards from "../DownloadCards";

jest.mock("../../../utils/notify", () => ({ notify: { success: jest.fn(), error: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;
const original = process.env.REACT_APP_APK_URL;
beforeEach(() => { container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  if (original === undefined) delete process.env.REACT_APP_APK_URL; else process.env.REACT_APP_APK_URL = original;
});
const render = () => act(async () => { root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><DownloadCards signedIn /></MemoryRouter>); });

test("the live Android download button carries the glow class", async () => {
  process.env.REACT_APP_APK_URL = "https://example.com/unilink.apk";
  await render();
  const link = container.querySelector("a.dl-btn");
  expect(link.className).toContain("dl-btn--glow");
  expect(link.getAttribute("href")).toBe("https://example.com/unilink.apk");
});

test("the disabled coming-soon button does not glow", async () => {
  delete process.env.REACT_APP_APK_URL;
  await render();
  const button = container.querySelector("button.dl-btn");
  expect(button.disabled).toBe(true);
  expect(button.className).not.toContain("glow");
  expect(container.querySelector("a.dl-btn")).toBeNull();
});
