import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import NewMessageAlerts, { POLL_VISIBLE_MS } from "../NewMessageAlerts";
import messageService from "../../services/messageService";

jest.mock("../../services/messageService");
jest.mock("../../context/AuthContext", () => ({ useAuth: () => ({ user: { id: "me" } }) }));
const mockToast = { custom: jest.fn(), dismiss: jest.fn() };
jest.mock("react-hot-toast", () => ({ toast: new Proxy(function () {}, { get: (_, k) => mockToast[k] }) }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const conv = (id, unread, extra = {}) => ({ _id: id, type: "direct", unreadCount: unread, participantProfiles: [{ id: "u2", name: "Amina" }], lastMessage: { preview: "See you at 2" }, ...extra });
let container; let root;
beforeEach(() => {
  jest.useFakeTimers();
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
  jest.resetAllMocks();
  document.title = "UniLink";
});
afterEach(() => { act(() => root.unmount()); container.remove(); jest.useRealTimers(); });

const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); });
const render = async (path = "/feed") => { await act(async () => { root.render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><NewMessageAlerts /></MemoryRouter>); }); await flush(); };
const tick = async (ms = POLL_VISIBLE_MS) => { await act(async () => { jest.advanceTimersByTime(ms); }); await flush(); };
const toasts = () => mockToast.custom.mock.calls;

test("the first answer is only a baseline: no toast for messages you already had, but the title shows them", async () => {
  messageService.getConversations.mockResolvedValue({ data: [conv("c1", 3)] });
  await render();
  expect(toasts().length).toBe(0);
  expect(document.title).toBe("(3) UniLink");
});

test("a new message in a chat you are not looking at pops a toast with who and what", async () => {
  messageService.getConversations.mockResolvedValueOnce({ data: [conv("c1", 0)] }).mockResolvedValue({ data: [conv("c1", 1)] });
  await render();
  await tick();
  expect(toasts().length).toBe(1);
  expect(toasts()[0][1].id).toBe("msg-c1");
  const t = toasts()[0][0]({ id: "t1", visible: true });
  expect(JSON.stringify(t)).toContain("New message from Amina");
  expect(JSON.stringify(t)).toContain("See you at 2");
  expect(document.title).toBe("(1) UniLink");
});

test("no toast for the chat that is open in front of you", async () => {
  messageService.getConversations.mockResolvedValueOnce({ data: [conv("c1", 0)] }).mockResolvedValue({ data: [conv("c1", 2)] });
  await render("/messages/c1");
  await tick();
  expect(toasts().length).toBe(0);
});

test("unread going down or staying the same is silent", async () => {
  messageService.getConversations.mockResolvedValueOnce({ data: [conv("c1", 3)] }).mockResolvedValueOnce({ data: [conv("c1", 3)] }).mockResolvedValue({ data: [conv("c1", 1)] });
  await render();
  await tick();
  await tick();
  expect(toasts().length).toBe(0);
  expect(document.title).toBe("(1) UniLink");
});

test("several chats at once give one summary toast; a new chat counts from zero", async () => {
  messageService.getConversations.mockResolvedValueOnce({ data: [conv("c1", 0)] }).mockResolvedValue({ data: [conv("c1", 1), conv("c2", 2, { participantProfiles: [{ id: "u3", name: "Brian" }] })] });
  await render();
  await tick();
  expect(toasts().length).toBe(1);
  expect(toasts()[0][1].id).toBe("msg-many");
  expect(JSON.stringify(toasts()[0][0]({ id: "t", visible: true }))).toContain("2 conversations have new messages");
});

test("a group is named by its title", async () => {
  messageService.getConversations.mockResolvedValueOnce({ data: [conv("g1", 0, { type: "group", title: "Study group" })] }).mockResolvedValue({ data: [conv("g1", 1, { type: "group", title: "Study group" })] });
  await render();
  await tick();
  expect(JSON.stringify(toasts()[0][0]({ id: "t", visible: true }))).toContain("New message from Study group");
});

test("a failed poll is silent and the next one still works", async () => {
  messageService.getConversations.mockResolvedValueOnce({ data: [conv("c1", 0)] }).mockRejectedValueOnce(new Error("offline")).mockResolvedValue({ data: [conv("c1", 1)] });
  await render();
  await tick();
  expect(toasts().length).toBe(0);
  await tick();
  expect(toasts().length).toBe(1);
});

test("a page changing the title does not lose the count", async () => {
  messageService.getConversations.mockResolvedValue({ data: [conv("c1", 2)] });
  await render();
  document.title = "Settings - UniLink";
  await tick();
  expect(document.title).toBe("(2) Settings - UniLink");
});

test("leaving removes the count from the title and stops polling", async () => {
  messageService.getConversations.mockResolvedValue({ data: [conv("c1", 2)] });
  await render();
  act(() => root.unmount());
  expect(document.title).toBe("UniLink");
  const calls = messageService.getConversations.mock.calls.length;
  await tick(POLL_VISIBLE_MS * 4);
  expect(messageService.getConversations.mock.calls.length).toBe(calls);
  root = createRoot(container);
});
