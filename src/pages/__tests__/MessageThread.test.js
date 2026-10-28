import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MessageThread from "../MessageThread";
import messageService from "../../services/messageService";
import { io } from "socket.io-client";

jest.mock("../../services/messageService");
jest.mock("../../services/userService", () => ({ __esModule: true, default: { getUserSummary: jest.fn().mockResolvedValue({ data: { name: "Amina" } }) } }));
jest.mock("../../context/AuthContext", () => ({ useAuth: () => ({ user: { id: "me" } }) }));
jest.mock("react-hot-toast", () => ({ toast: { error: jest.fn() } }));
jest.mock("socket.io-client", () => ({ io: jest.fn() }));
global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;
let socket;
let handlers;

const makeSocket = () => {
  handlers = {};
  socket = {
    connected: true,
    on: jest.fn((event, fn) => { handlers[event] = fn; }),
    emit: jest.fn(),
    disconnect: jest.fn(),
  };
  io.mockReturnValue(socket);
};

const direct = { _id: "c1", type: "direct", participantIds: ["me", "them"] };
const msg = (id, senderId, readBy, text = id) => ({ _id: id, conversationId: "c1", senderId, text, readBy, createdAt: "2026-10-27T10:00:00Z" });

const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); });
const render = async (conversation, messages) => {
  messageService.getConversations.mockResolvedValue({ data: [conversation] });
  messageService.getMessages.mockResolvedValue({ data: messages });
  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={["/messages/c1"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes><Route path="/messages/:conversationId" element={<MessageThread />} /></Routes>
      </MemoryRouter>
    );
  });
  await flush();
};

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  jest.resetAllMocks();
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  localStorage.setItem("token", "jwt");
  makeSocket();
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  localStorage.clear();
});

test("connects with the login token and joins this conversation", async () => {
  await render(direct, [msg("m1", "them", ["them"])]);
  expect(io).toHaveBeenCalledWith(expect.any(String), { auth: { token: "jwt" }, transports: ["websocket"] });
  await act(async () => { handlers.connect(); });
  expect(socket.emit).toHaveBeenCalledWith("conversation:join", "c1");
});

test("shows the typing dots when the other person types, and hides them when they stop", async () => {
  await render(direct, [msg("m1", "them", ["them"])]);
  expect(container.querySelector(".typing-bubble")).toBeNull();
  await act(async () => { handlers["typing:start"]({ conversationId: "c1", userId: "them" }); });
  expect(container.querySelector(".typing-bubble")).not.toBeNull();
  expect(container.querySelectorAll(".typing-dot").length).toBe(3);
  await act(async () => { handlers["typing:stop"]({ conversationId: "c1", userId: "them" }); });
  expect(container.querySelector(".typing-bubble")).toBeNull();
});

test("ignores your own typing and typing in another conversation", async () => {
  await render(direct, [msg("m1", "them", ["them"])]);
  await act(async () => { handlers["typing:start"]({ conversationId: "c1", userId: "me" }); });
  expect(container.querySelector(".typing-bubble")).toBeNull();
  await act(async () => { handlers["typing:start"]({ conversationId: "other", userId: "them" }); });
  expect(container.querySelector(".typing-bubble")).toBeNull();
});

test("tells the other person you are typing, and stops when the box is emptied", async () => {
  await render(direct, [msg("m1", "them", ["them"])]);
  const box = container.querySelector("textarea");
  const setValue = (value) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    setter.call(box, value);
    box.dispatchEvent(new Event("input", { bubbles: true }));
  };
  await act(async () => { setValue("hel"); });
  expect(socket.emit).toHaveBeenCalledWith("typing:start", "c1");
  socket.emit.mockClear();
  await act(async () => { setValue(""); });
  expect(socket.emit).toHaveBeenCalledWith("typing:stop", "c1");
});

test("leaving the chat stops typing, leaves the room and disconnects", async () => {
  await render(direct, [msg("m1", "them", ["them"])]);
  act(() => root.unmount());
  expect(socket.emit).toHaveBeenCalledWith("typing:stop", "c1");
  expect(socket.emit).toHaveBeenCalledWith("conversation:leave", "c1");
  expect(socket.disconnect).toHaveBeenCalled();
  root = createRoot(container);
});

test("Seen appears under only the last message you sent, once they have read it", async () => {
  await render(direct, [msg("m1", "me", ["me", "them"]), msg("m2", "them", ["them", "me"]), msg("m3", "me", ["me", "them"])]);
  const seen = container.querySelectorAll(".message-seen");
  expect(seen.length).toBe(1);
  const bubbles = [...container.querySelectorAll(".thread-message")];
  expect(bubbles[2].querySelector(".message-seen")).not.toBeNull();
  expect(bubbles[0].querySelector(".message-seen")).toBeNull();
});

test("no Seen while they have not read it", async () => {
  await render(direct, [msg("m1", "me", ["me"])]);
  expect(container.querySelector(".message-seen")).toBeNull();
});

test("no Seen in a group chat", async () => {
  await render({ _id: "c1", type: "group", title: "Study", participantIds: ["me", "a", "b"] }, [msg("m1", "me", ["me", "a", "b"])]);
  expect(container.querySelector(".message-seen")).toBeNull();
});

test("does not connect when there is no login token", async () => {
  localStorage.clear();
  await render(direct, [msg("m1", "them", ["them"])]);
  expect(io).not.toHaveBeenCalled();
});
