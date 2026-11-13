import { act, useState } from "react";
import { createRoot } from "react-dom/client";
import AudienceSelect from "../campus/AudienceSelect";
import API from "../../services/api";
import { DEFAULT_AUDIENCE } from "../../utils/audience";

jest.mock("../../services/api", () => ({ __esModule: true, default: { get: jest.fn() } }));
jest.mock("../../context/AuthContext", () => ({ useAuth: () => ({ user: { id: "me1", role: "student" } }) }));
global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;
let latest;
function Harness() {
  const [value, setValue] = useState(DEFAULT_AUDIENCE);
  latest = value;
  return <AudienceSelect value={value} onChange={setValue} />;
}
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
const mount = () => act(async () => { root.render(<Harness />); });
const setSelect = (value) => act(async () => {
  const el = container.querySelector("#audience-kind");
  const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set;
  setter.call(el, value);
  el.dispatchEvent(new Event("change", { bubbles: true }));
});
const type = (selector, text) => act(async () => {
  const el = container.querySelector(selector);
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  setter.call(el, text);
  el.dispatchEvent(new Event("input", { bubbles: true }));
});
const flush = (ms) => act(async () => { jest.advanceTimersByTime(ms); await Promise.resolve(); await Promise.resolve(); });

test("it starts on 'My university' with all six choices offered", async () => {
  await mount();
  const options = [...container.querySelectorAll("#audience-kind option")].map((o) => o.value);
  expect(options).toEqual(["everyone", "university", "universities", "followers", "friends", "people"]);
  expect(container.querySelector("#audience-kind").value).toBe("university");
  expect(container.querySelector(".audience__finder")).toBeNull();
});

test("choosing universities: type 3+ letters, pick results, remove a pick", async () => {
  API.get.mockResolvedValue({ data: { data: [{ _id: "u1", name: "University of Nairobi" }, { _id: "u2", name: "Maseno University" }] } });
  await mount();
  await setSelect("universities");
  expect(latest.kind).toBe("universities");
  await type('input[aria-label="Search universities"]', "un");
  await flush(400);
  expect(API.get).not.toHaveBeenCalled();
  await type('input[aria-label="Search universities"]', "univ");
  await flush(400);
  expect(API.get).toHaveBeenCalledWith("/auth/universities", { params: { search: "univ" } });
  const rows = container.querySelectorAll(".audience-row");
  await act(async () => { rows[0].click(); });
  await act(async () => { container.querySelectorAll(".audience-row")[1].click(); });
  expect(latest.universities.map((u) => u._id)).toEqual(["u1", "u2"]);
  await act(async () => { container.querySelector('button[aria-label="Remove University of Nairobi"]').click(); });
  expect(latest.universities.map((u) => u._id)).toEqual(["u2"]);
});

test("choosing specific people lists who you follow, and username search finds anyone", async () => {
  API.get.mockImplementation(async (url) => {
    if (url === "/follow/me1/following") return { data: { data: [{ _id: "f1", name: "Amina", username: "amina" }] } };
    if (url === "/people/search") return { data: { data: [{ _id: "s1", name: "Brian Otieno", username: "brianotieno" }] } };
    return { data: { data: [] } };
  });
  await mount();
  await setSelect("people");
  await flush(0);
  expect(container.textContent).toContain("People you follow");
  expect(container.textContent).toContain("Amina");
  await act(async () => { container.querySelector(".audience-row").click(); });
  expect(latest.people.map((p) => p._id)).toEqual(["f1"]);
  await type('input[aria-label="Search people"]', "@brian");
  await flush(400);
  expect(API.get).toHaveBeenCalledWith("/people/search", { params: { q: "brian" } });
  expect(container.textContent).toContain("Brian Otieno");
});
