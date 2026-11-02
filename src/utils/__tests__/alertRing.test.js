import { shouldRing, playSiren } from "../alertRing";

test("no alerts means no ring", () => {
  expect(shouldRing([], new Set())).toBe(false);
  expect(shouldRing(undefined, undefined)).toBe(false);
  expect(shouldRing(null, [])).toBe(false);
});

test("an alert that is not muted rings", () => {
  expect(shouldRing([{ _id: "a" }], new Set())).toBe(true);
  expect(shouldRing([{ _id: "a" }], undefined)).toBe(true);
});

test("a muted alert is quiet, but a new one rings again", () => {
  const muted = new Set(["a"]);
  expect(shouldRing([{ _id: "a" }], muted)).toBe(false);
  expect(shouldRing([{ _id: "a" }, { _id: "b" }], muted)).toBe(true);
  expect(shouldRing([{ _id: "a" }], ["a"])).toBe(false);
});

test("the siren never throws when audio is missing or closed", () => {
  expect(playSiren(null)).toBe(false);
  expect(playSiren({ state: "closed" })).toBe(false);
  expect(playSiren({ state: "running", currentTime: 0, createGain: () => { throw new Error("no audio"); } })).toBe(false);
});

test("the siren builds and starts a tone on a working context", () => {
  const calls = [];
  const param = { setValueAtTime: (...a) => calls.push(["set", ...a]), exponentialRampToValueAtTime: () => {} };
  const ctx = {
    state: "running",
    currentTime: 5,
    destination: {},
    createGain: () => ({ gain: param, connect: () => {} }),
    createOscillator: () => ({ type: "", frequency: param, connect: () => {}, start: (t) => calls.push(["start", t]), stop: (t) => calls.push(["stop", t]) }),
  };
  expect(playSiren(ctx)).toBe(true);
  expect(calls).toContainEqual(["start", 5]);
  expect(calls).toContainEqual(["stop", 6]);
});
