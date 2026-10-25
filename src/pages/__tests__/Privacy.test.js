import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import Privacy from "../Privacy";
import { getPrivacyNotice } from "../../services/legalService";

jest.mock("../../services/legalService");
global.IS_REACT_ACT_ENVIRONMENT = true;

const notice = (extra = {}) => ({
  version: "1.0",
  effectiveDate: "2026-10-24",
  reviewStatus: "draft",
  complete: false,
  openItems: ["contact email"],
  notice: {
    title: "UniLink Privacy Notice",
    intro: "Intro text.",
    sections: [
      { id: "who", number: 1, title: "Who is responsible", blocks: [{ p: "Contact: [Owner to provide: contact email]" }] },
      { id: "rights", number: 9, title: "Your rights", blocks: [{ ul: ["Complain to https://www.odpc.go.ke"] }, { p: "<script>alert(1)</script>" }] },
    ],
  },
  ...extra,
});

let container;
let root;
const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); });
const render = async () => {
  await act(async () => { root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Privacy /></MemoryRouter>); });
  await flush();
};

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  jest.resetAllMocks();
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

test("renders the served notice: title, version, numbered sections and clickable https links", async () => {
  getPrivacyNotice.mockResolvedValue(notice());
  await render();
  expect(container.querySelector("h1").textContent).toBe("UniLink Privacy Notice");
  expect(container.textContent).toMatch(/Version 1\.0/);
  expect(Array.from(container.querySelectorAll("h2")).map((h) => h.textContent)).toEqual(["1. Who is responsible", "9. Your rights"]);
  const link = container.querySelector('a[href="https://www.odpc.go.ke"]');
  expect(link).not.toBeNull();
  expect(link.getAttribute("rel")).toMatch(/noopener/);
});

test("a draft notice says it is a draft, and unfilled owner details stay visibly unfilled", async () => {
  getPrivacyNotice.mockResolvedValue(notice());
  await render();
  expect(container.querySelector('[role="note"]').textContent).toMatch(/not yet been reviewed by a lawyer/);
  expect(container.textContent).toMatch(/\[Owner to provide: contact email\]/);
});

test("a notice the owner has marked reviewed shows no draft banner", async () => {
  getPrivacyNotice.mockResolvedValue(notice({ reviewStatus: "reviewed", complete: true, openItems: [] }));
  await render();
  expect(container.querySelector('[role="note"]')).toBeNull();
});

test("notice text is shown as text, never as markup", async () => {
  getPrivacyNotice.mockResolvedValue(notice());
  await render();
  expect(container.querySelector("script")).toBeNull();
  expect(container.textContent).toContain("<script>alert(1)</script>");
});

test("if the notice cannot be loaded, the page says so and offers a retry that works", async () => {
  getPrivacyNotice.mockRejectedValueOnce(new Error("down")).mockResolvedValue(notice());
  await render();
  expect(container.querySelector('[role="alert"]').textContent).toMatch(/could not be loaded/);
  const retry = Array.from(container.querySelectorAll("button")).find((b) => b.textContent === "Try again");
  await act(async () => { retry.click(); });
  await flush();
  expect(container.querySelector("h1").textContent).toBe("UniLink Privacy Notice");
});
