import { act } from "react";
import { createRoot } from "react-dom/client";
import PostCard from "../PostCard";
import API from "../../services/api";

jest.mock("../../services/api", () => ({ __esModule: true, default: { get: jest.fn(), delete: jest.fn() } }));
jest.mock("../../context/AuthContext", () => ({ useAuth: () => ({ user: { id: "u1", role: "student" } }) }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const pages = (n) => Array.from({ length: n }, (_, i) => ({ page: i + 1, url: `https://x/p${i + 1}.jpg` }));
const docPost = (media = {}) => ({
  _id: "post1",
  userId: "u2",
  title: "Notes",
  content: "",
  createdAt: "2026-10-27T10:00:00Z",
  media: [{ type: "document", url: "https://x/n.pdf", publicId: "d1", originalName: "Notes.pdf", pageCount: 3, processingStatus: "ready", pages: pages(3), ...media }],
});

let container;
let root;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  API.get.mockReset();
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.useRealTimers();
});
const render = (post) => act(async () => { root.render(<PostCard post={post} />); });
const click = (el) => act(async () => { el.click(); });
const counter = () => container.querySelector(".doc-pager__count").textContent;

test("a multi-page document shows page 1 of N, with Next enabled and Previous disabled", async () => {
  await render(docPost());
  expect(counter()).toBe("1 / 3");
  expect(container.querySelector('button[aria-label="Previous page"]').disabled).toBe(true);
  expect(container.querySelector('button[aria-label="Next page"]').disabled).toBe(false);
});

test("Next and Previous move one page at a time and stop at the ends", async () => {
  await render(docPost());
  const next = container.querySelector('button[aria-label="Next page"]');
  const prev = container.querySelector('button[aria-label="Previous page"]');
  await click(next);
  expect(counter()).toBe("2 / 3");
  await click(next);
  expect(counter()).toBe("3 / 3");
  expect(next.disabled).toBe(true);
  await click(prev);
  expect(counter()).toBe("2 / 3");
});

test("the arrow keys turn the page", async () => {
  await render(docPost());
  const track = container.querySelector(".doc-pager__track");
  await act(async () => { track.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })); });
  expect(counter()).toBe("2 / 3");
  await act(async () => { track.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })); });
  expect(counter()).toBe("1 / 3");
});

test("a one-page document has no page controls", async () => {
  await render(docPost({ pageCount: 1, pages: pages(1) }));
  expect(container.querySelector(".doc-pager")).not.toBeNull();
  expect(container.querySelector(".doc-pager__nav")).toBeNull();
  expect(container.querySelector(".doc-pager__count")).toBeNull();
});

test("every document has the same header: name, page count and Open", async () => {
  for (const media of [{}, { pages: [], pageCount: 0, processingStatus: "failed" }, { pages: [], pageCount: 0, processingStatus: "pending" }, { pages: [], pageCount: 0, processingStatus: "ready" }]) {
    await render(docPost(media));
    const doc = container.querySelector(".post-doc");
    expect(doc.textContent).toContain("Notes.pdf");
    expect(doc.querySelector("a.post-doc__open").getAttribute("href")).toBe("https://x/n.pdf");
  }
});

test("a document without pages says why, in plain words", async () => {
  await render(docPost({ pages: [], pageCount: 0, processingStatus: "failed" }));
  expect(container.querySelector(".post-doc__note").textContent).toMatch(/could not be prepared/);
  await render(docPost({ pages: [], pageCount: 0, processingStatus: "pending" }));
  expect(container.querySelector(".post-doc__note").textContent).toMatch(/Preparing the pages/);
  await render(docPost({ pages: [], pageCount: 0, processingStatus: "ready" }));
  expect(container.querySelector(".post-doc__note").textContent).toMatch(/not ready yet/);
});

test("a document that is still being prepared gets its pages by itself", async () => {
  jest.useFakeTimers();
  const pending = docPost({ pages: [], pageCount: 0, processingStatus: "pending" });
  API.get.mockResolvedValue({ data: { data: docPost().media ? { media: docPost().media } : {} } });
  await render(pending);
  expect(container.querySelector(".doc-pager")).toBeNull();
  await act(async () => { jest.advanceTimersByTime(6000); await Promise.resolve(); await Promise.resolve(); });
  expect(API.get).toHaveBeenCalledWith("/posts/post1");
  expect(container.querySelector(".doc-pager")).not.toBeNull();
  expect(counter()).toBe("1 / 3");
  // Once the pages are there, it stops asking.
  API.get.mockClear();
  await act(async () => { jest.advanceTimersByTime(30000); await Promise.resolve(); });
  expect(API.get).not.toHaveBeenCalled();
});

test("a document that is ready is never polled", async () => {
  jest.useFakeTimers();
  await render(docPost());
  await act(async () => { jest.advanceTimersByTime(60000); });
  expect(API.get).not.toHaveBeenCalled();
});
