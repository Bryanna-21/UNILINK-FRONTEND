import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import UserProfile from "../UserProfile";
import * as people from "../../services/profilePeopleService";

jest.mock("../../services/profilePeopleService");
jest.mock("../../components/PostCard", () => ({ post }) => <div className="post-stub">{post.title} by {post.authorName}</div>);
jest.mock("react-hot-toast", () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
const { toast } = require("react-hot-toast");
let mockUserId = "me";
jest.mock("../../context/AuthContext", () => ({ useAuth: () => ({ user: { id: mockUserId, role: "student" } }) }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const summary = { _id: "u2", name: "Amina Otieno", role: "student", username: "amina", bio: "Nursing, year 2", avatarUrl: null, postsCount: 2, followersCount: 5, followingCount: 7 };
let container; let root;
beforeEach(() => {
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
  jest.resetAllMocks();
  mockUserId = "me";
  people.getSummary.mockResolvedValue(summary);
  people.getFollowStatus.mockResolvedValue(false);
  people.getPosts.mockResolvedValue([{ _id: "p1", title: "Notes", userId: "u2" }, { _id: "p2", title: "Hello", userId: "u2", authorName: "Amina Otieno" }]);
  window.confirm = jest.fn(() => true);
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); });
const render = async (id = "u2") => {
  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={[`/user/${id}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/profile" element={<div id="own">own profile</div>} />
          <Route path="/search" element={<div id="search">search</div>} />
          <Route path="/messages/:cid" element={<div id="chat">chat</div>} />
        </Routes>
      </MemoryRouter>
    );
  });
  await flush();
};
const button = (label) => [...container.querySelectorAll("button")].find((b) => b.textContent === label);
const stat = (label) => [...container.querySelectorAll(".up-stats div")].find((d) => d.querySelector("dt").textContent === label).querySelector("dd").textContent;

test("shows who the person is, their numbers and their posts", async () => {
  await render();
  expect(container.querySelector("h1").textContent).toBe("Amina Otieno");
  expect(container.textContent).toContain("@amina");
  expect(container.textContent).toContain("Nursing, year 2");
  expect([stat("Posts"), stat("Followers"), stat("Following")]).toEqual(["2", "5", "7"]);
  const posts = [...container.querySelectorAll(".post-stub")].map((p) => p.textContent);
  expect(posts).toEqual(["Notes by Amina Otieno", "Hello by Amina Otieno"]);
});

test("Follow turns into Following at once, adds one follower, and tells the server", async () => {
  people.follow.mockResolvedValue({});
  await render();
  await act(async () => { button("Follow").click(); });
  await flush();
  expect(people.follow).toHaveBeenCalledWith("u2");
  expect(button("Following")).toBeDefined();
  expect(stat("Followers")).toBe("6");
});

test("a person you follow can be unfollowed", async () => {
  people.getFollowStatus.mockResolvedValue(true);
  people.unfollow.mockResolvedValue({});
  await render();
  await act(async () => { button("Following").click(); });
  await flush();
  expect(people.unfollow).toHaveBeenCalledWith("u2");
  expect(button("Follow")).toBeDefined();
  expect(stat("Followers")).toBe("4");
});

test("if following fails, everything goes back exactly as it was and the person is told", async () => {
  people.follow.mockRejectedValue({ response: { status: 403, data: { message: "You cannot follow this person." } } });
  await render();
  await act(async () => { button("Follow").click(); });
  await flush();
  expect(button("Follow")).toBeDefined();
  expect(stat("Followers")).toBe("5");
  expect(toast.error).toHaveBeenCalledWith("You cannot follow this person.");
});

test("a double click follows only once", async () => {
  let release;
  people.follow.mockReturnValue(new Promise((r) => { release = r; }));
  await render();
  const b = button("Follow");
  await act(async () => { b.click(); b.click(); });
  expect(people.follow).toHaveBeenCalledTimes(1);
  await act(async () => { release({}); });
});

test("Message opens a direct conversation with them", async () => {
  people.startChat.mockResolvedValue("c9");
  await render();
  await act(async () => { button("Message").click(); });
  await flush();
  expect(people.startChat).toHaveBeenCalledWith("u2");
  expect(container.querySelector("#chat")).not.toBeNull();
});

test("Message that cannot start says so and stays here", async () => {
  people.startChat.mockRejectedValue({ response: { status: 403, data: { message: "You can't message this person." } } });
  await render();
  await act(async () => { button("Message").click(); });
  await flush();
  expect(toast.error).toHaveBeenCalledWith("You can't message this person.");
  expect(container.querySelector("h1")).not.toBeNull();
});

test("Block asks first, then blocks and leaves", async () => {
  people.block.mockResolvedValue({});
  await render();
  await act(async () => { button("Block").click(); });
  await flush();
  expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining("Block Amina Otieno?"));
  expect(people.block).toHaveBeenCalledWith("u2");
  expect(container.querySelector("#search")).not.toBeNull();
});

test("saying no at the Block question blocks nobody", async () => {
  window.confirm = jest.fn(() => false);
  await render();
  await act(async () => { button("Block").click(); });
  expect(people.block).not.toHaveBeenCalled();
});

test("your own profile sends you to the Profile page and loads nothing", async () => {
  mockUserId = "u2";
  await render("u2");
  expect(container.querySelector("#own")).not.toBeNull();
  expect(people.getSummary).not.toHaveBeenCalled();
});

test("a person who is not available says so, with a way to try again", async () => {
  people.getSummary.mockRejectedValue({ response: { status: 404 } });
  await render();
  expect(container.textContent).toContain("This person isn't available.");
  people.getSummary.mockResolvedValue(summary);
  await act(async () => { button("Try again").click(); });
  await flush();
  expect(container.querySelector("h1").textContent).toBe("Amina Otieno");
});

test("if only the posts fail to load, the profile still shows", async () => {
  people.getPosts.mockRejectedValue(new Error("boom"));
  await render();
  expect(container.querySelector("h1").textContent).toBe("Amina Otieno");
  expect(container.textContent).toContain("No posts yet.");
});
