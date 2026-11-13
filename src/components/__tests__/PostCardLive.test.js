import { act } from "react";
import { createRoot } from "react-dom/client";
import PostCard from "../PostCard";
import API from "../../services/api";

jest.mock("../../services/api", () => ({ __esModule: true, default: { get: jest.fn(), delete: jest.fn() } }));
jest.mock("../../context/AuthContext", () => ({ useAuth: () => ({ user: { id: "u1", role: "student" } }) }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const pages = (n) => Array.from({ length: n }, (_, i) => ({ page: i + 1, url: `https://x/p${i + 1}.jpg` }));
const doc = (media = {}) => ({ type: "document", url: "https://x/n.pdf", publicId: "d1", originalName: "Notes.pdf", pageCount: 5, processingStatus: "pending", pages: pages(2), ...media });
const post = (media, extra = {}) => ({ _id: "post1", userId: "u2", title: "Notes", content: "", createdAt: "2026-10-27T10:00:00Z", media: media ? [media] : [], ...extra });

let container;
let root;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  API.get.mockReset();
  jest.useFakeTimers();
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.useRealTimers();
});
const render = (p) => act(async () => { root.render(<PostCard post={p} />); });
const tick = (ms) => act(async () => { jest.advanceTimersByTime(ms); await Promise.resolve(); await Promise.resolve(); });
const counter = () => container.querySelector(".doc-pager__count").textContent;
const slides = () => container.querySelectorAll(".doc-pager__slide").length;

test("a document with only its first pages shows page 1 of the full length, and says more are coming", async () => {
  API.get.mockResolvedValue({ data: { data: { media: [doc()] } } });
  await render(post(doc()));
  expect(counter()).toBe("1 / 5");
  expect(slides()).toBe(2);
  expect(container.querySelector(".doc-pager__hint").textContent).toMatch(/Preparing more pages/);
  // Next stops at the last page that exists, not at one that does not.
  const next = container.querySelector('button[aria-label="Next page"]');
  await act(async () => { next.click(); });
  expect(counter()).toBe("2 / 5");
  expect(next.disabled).toBe(true);
});

test("it keeps asking while pages are still being drawn, and stops when the document is ready", async () => {
  API.get
    .mockResolvedValueOnce({ data: { data: { media: [doc({ pages: pages(4) })] } } })
    .mockResolvedValueOnce({ data: { data: { media: [doc({ pages: pages(5), processingStatus: "ready" })] } } });
  await render(post(doc()));
  await tick(4000);
  expect(slides()).toBe(4);
  expect(container.querySelector(".doc-pager__hint").textContent).toMatch(/Preparing more pages/);
  await tick(4000);
  expect(slides()).toBe(5);
  expect(container.querySelector(".doc-pager__hint").textContent).toMatch(/Swipe, drag/);
  API.get.mockClear();
  await tick(60000);
  expect(API.get).not.toHaveBeenCalled();
});

test("the page being read does not jump when nothing has changed", async () => {
  API.get.mockResolvedValue({ data: { data: { media: [doc()] } } });
  await render(post(doc()));
  const next = container.querySelector('button[aria-label="Next page"]');
  await act(async () => { next.click(); });
  expect(counter()).toBe("2 / 5");
  await tick(4000);
  expect(counter()).toBe("2 / 5");
});

test("a render that stopped part-way says so and keeps the pages it has", async () => {
  await render(post(doc({ processingStatus: "failed" })));
  expect(slides()).toBe(2);
  expect(container.querySelector(".post-doc__note").textContent).toMatch(/Some pages could not be prepared/);
  expect(API.get).not.toHaveBeenCalled();
});

test("a very long document says how much of it is shown", async () => {
  await render(post(doc({ pageCount: 100, totalPages: 340, pages: pages(100), processingStatus: "ready" })));
  expect(container.querySelector(".post-doc__meta span").textContent).toBe("Showing the first 100 of 340 pages");
});

test("the audience shows on a post unless it is the usual one", async () => {
  await render(post(null, { audience: "everyone" }));
  expect(container.querySelector(".post-footer small").textContent).toMatch(/Everyone/);
  await render(post(null, { audience: "university" }));
  expect(container.querySelector(".post-footer small").textContent).not.toMatch(/·/);
  await render(post(null));
  expect(container.querySelector(".post-footer small").textContent).not.toMatch(/·/);
});

test("Save appears only on a post with files", async () => {
  await render(post(null));
  expect(container.querySelector(".save-btn")).toBeNull();
  await render(post({ type: "image", url: "https://x/a.jpg", publicId: "i1" }));
  expect(container.querySelector(".save-btn")).not.toBeNull();
});
