import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import PostCard from "../PostCard";

jest.mock("../../services/api", () => ({ __esModule: true, default: { get: jest.fn(), delete: jest.fn() } }));
jest.mock("../../context/AuthContext", () => ({ useAuth: () => ({ user: { id: "me", role: "student" } }) }));
global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root;
beforeEach(() => { container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); });
const post = { _id: "p1", userId: "u2", authorName: "Amina", title: "Notes", content: "", media: [] };

test("inside the app the author's name opens their profile", async () => {
  await act(async () => { root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><PostCard post={post} /></MemoryRouter>); });
  const link = container.querySelector("a.post-author-link");
  expect(link.getAttribute("href")).toBe("/user/u2");
  expect(link.textContent).toBe("Amina");
  expect(container.querySelector(".post-author").textContent).toBe("Posted by Amina");
});

test("without a router it is plain text, and never crashes", async () => {
  await act(async () => { root.render(<PostCard post={post} />); });
  expect(container.querySelector("a.post-author-link")).toBeNull();
  expect(container.querySelector(".post-author").textContent).toBe("Posted by Amina");
});

test("a post with no author id or name still reads correctly", async () => {
  await act(async () => { root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><PostCard post={{ ...post, userId: undefined, authorName: undefined }} /></MemoryRouter>); });
  expect(container.querySelector("a.post-author-link")).toBeNull();
  expect(container.querySelector(".post-author").textContent).toBe("Posted by Unknown user");
});
