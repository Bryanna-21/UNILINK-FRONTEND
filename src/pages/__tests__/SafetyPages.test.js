import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import BlockedPeople from "../BlockedPeople";
import CommunityStandards from "../CommunityStandards";
import * as people from "../../services/profilePeopleService";

jest.mock("../../services/profilePeopleService");
jest.mock("react-hot-toast", () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
const { toast } = require("react-hot-toast");
global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root;
beforeEach(() => { container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container); jest.resetAllMocks(); window.confirm = jest.fn(() => true); });
afterEach(() => { act(() => root.unmount()); container.remove(); });
const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); });
const render = async (el) => { await act(async () => { root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{el}</MemoryRouter>); }); await flush(); };
const button = (label) => [...container.querySelectorAll("button")].find((b) => b.textContent === label);

describe("Blocked people", () => {
  const blocked = [{ _id: "b1", name: "Brian", username: "brian" }, { _id: "b2", name: "Cate" }];
  test("lists who you blocked", async () => {
    people.listBlocks.mockResolvedValue(blocked);
    await render(<BlockedPeople />);
    expect([...container.querySelectorAll(".safety-list strong")].map((s) => s.textContent)).toEqual(["Brian", "Cate"]);
    expect(container.textContent).toContain("@brian");
  });
  test("an empty list says nobody is blocked", async () => {
    people.listBlocks.mockResolvedValue([]);
    await render(<BlockedPeople />);
    expect(container.textContent).toContain("You haven't blocked anyone.");
  });
  test("Unblock asks first, then removes that person only", async () => {
    people.listBlocks.mockResolvedValue(blocked);
    people.unblock.mockResolvedValue({});
    await render(<BlockedPeople />);
    await act(async () => { container.querySelector(".safety-list button").click(); });
    await flush();
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining("Unblock Brian?"));
    expect(people.unblock).toHaveBeenCalledWith("b1");
    expect([...container.querySelectorAll(".safety-list strong")].map((s) => s.textContent)).toEqual(["Cate"]);
    expect(toast.success).toHaveBeenCalledWith("Brian is unblocked.");
  });
  test("saying no unblocks nobody; a failure keeps the person listed and says why", async () => {
    people.listBlocks.mockResolvedValue(blocked);
    window.confirm = jest.fn(() => false);
    await render(<BlockedPeople />);
    await act(async () => { container.querySelector(".safety-list button").click(); });
    expect(people.unblock).not.toHaveBeenCalled();
    window.confirm = jest.fn(() => true);
    people.unblock.mockRejectedValue({ response: { status: 400, data: { message: "Try later." } } });
    await act(async () => { container.querySelector(".safety-list button").click(); });
    await flush();
    expect(container.querySelectorAll(".safety-list li").length).toBe(2);
    expect(toast.error).toHaveBeenCalledWith("Try later.");
  });
  test("a failed load can be retried", async () => {
    people.listBlocks.mockRejectedValueOnce(new Error("offline")).mockResolvedValue(blocked);
    await render(<BlockedPeople />);
    expect(container.textContent).toContain("Couldn't load this list");
    await act(async () => { button("Try again").click(); });
    await flush();
    expect(container.querySelectorAll(".safety-list li").length).toBe(2);
  });
});

describe("Community Standards", () => {
  const standards = { version: "1.0", effectiveDate: "2026-10-05", title: "UniLink Community Standards", intro: "A space to learn.",
    sections: [{ id: "respect", number: 1, title: "Respect", summary: "Be kind.", rules: ["No bullying.", "No threats."] }, { id: "spam", number: 2, title: "Spam", rules: ["No scams."] }] };
  test("shows the title, version, intro and every section with its rules", async () => {
    people.getStandards.mockResolvedValue(standards);
    await render(<CommunityStandards />);
    expect(container.querySelector("h1").textContent).toBe("UniLink Community Standards");
    expect(container.textContent).toContain("Version 1.0, effective 2026-10-05");
    expect(container.textContent).toContain("A space to learn.");
    expect([...container.querySelectorAll("h2")].map((h) => h.textContent)).toEqual(["1. Respect", "2. Spam"]);
    expect([...container.querySelectorAll("li")].map((l) => l.textContent)).toEqual(["No bullying.", "No threats.", "No scams."]);
  });
  test("a response without sections is treated as a failure, not shown half-empty", async () => {
    people.getStandards.mockResolvedValue({ title: "x" });
    await render(<CommunityStandards />);
    expect(container.textContent).toContain("Couldn't load the standards");
  });
  test("a network failure can be retried", async () => {
    people.getStandards.mockRejectedValueOnce(new Error("offline")).mockResolvedValue(standards);
    await render(<CommunityStandards />);
    await act(async () => { button("Try again").click(); });
    await flush();
    expect(container.querySelector("h1").textContent).toBe("UniLink Community Standards");
  });
});
