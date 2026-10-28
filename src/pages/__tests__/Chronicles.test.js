import { act } from "react";
import { createRoot } from "react-dom/client";
import Feed from "../Feed";
import API from "../../services/api";

jest.mock("../../services/api", () => ({ __esModule: true, default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() } }));
jest.mock("../../context/AuthContext", () => ({ useAuth: () => ({ user: { id: "u1", role: "student" } }) }));
jest.mock("../../utils/notify", () => ({ notify: { success: jest.fn(), error: jest.fn() } }));
jest.mock("../../components/campus/ReelsFeed", () => () => null);
jest.mock("../../components/campus/CommentsSheet", () => () => null);
jest.mock("../../components/campus/PostComposer", () => () => null);
global.IS_REACT_ACT_ENVIRONMENT = true;

const posts = [
  { _id: "t", title: "Plain text post", content: "hello", media: [] },
  { _id: "i", title: "Photo post", content: "", media: [{ type: "image", url: "https://x/a.jpg", publicId: "a" }] },
  {
    _id: "d",
    title: "File post",
    content: "",
    media: [
      {
        type: "document",
        url: "https://x/notes.pdf",
        publicId: "d",
        originalName: "Unit notes.pdf",
        pageCount: 2,
        pages: [
          { page: 2, url: "https://x/p2.jpg" },
          { page: 1, url: "https://x/p1.jpg" },
        ],
      },
    ],
  },
  { _id: "v", title: "Video post", content: "", media: [{ type: "video", url: "https://x/v.mp4", publicId: "v" }] },
];

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
});

const openChronicles = async (list) => {
  API.get.mockResolvedValue({ data: { data: list } });
  await act(async () => { root.render(<Feed />); });
  await act(async () => { await Promise.resolve(); });
  const button = [...container.querySelectorAll("button")].find((b) => b.textContent === "Chronicles");
  await act(async () => { button.click(); });
};

test("Chronicles shows text, photo and document posts, and leaves video posts to Reels", async () => {
  await openChronicles(posts);
  const text = container.textContent;
  expect(text).toContain("Plain text post");
  expect(text).toContain("Photo post");
  expect(text).toContain("File post");
  expect(text).not.toContain("Video post");
});

test("a document post shows its name, page count, an Open link and its pages in order", async () => {
  await openChronicles(posts);
  const doc = container.querySelector(".post-doc");
  expect(doc).not.toBeNull();
  expect(doc.textContent).toContain("Unit notes.pdf");
  expect(doc.textContent).toContain("2 pages");
  expect(doc.querySelector("a.post-doc__open").getAttribute("href")).toBe("https://x/notes.pdf");
  const pages = [...doc.querySelectorAll("img")].map((img) => img.getAttribute("src"));
  expect(pages).toEqual(["https://x/p1.jpg", "https://x/p2.jpg"]);
});

test("a document is never drawn as a broken image", async () => {
  await openChronicles([posts[2]]);
  expect(container.querySelector("img.post-media")).toBeNull();
});

test("with only video posts, Chronicles says it is empty", async () => {
  await openChronicles([posts[3]]);
  expect(container.textContent).toContain("No chronicles yet");
});
