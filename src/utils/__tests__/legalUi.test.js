import { formatDate, linkify, needsGate } from "../legalUi";

describe("linkify", () => {
  test("turns an https URL into a link and keeps the text around it", () => {
    expect(linkify("Complain to the ODPC: https://www.odpc.go.ke today")).toEqual([
      { type: "text", value: "Complain to the ODPC: " },
      { type: "link", value: "https://www.odpc.go.ke" },
      { type: "text", value: " today" },
    ]);
  });
  test("does not swallow the full stop at the end of a sentence", () => {
    const parts = linkify("See https://www.odpc.go.ke.");
    expect(parts[1]).toEqual({ type: "link", value: "https://www.odpc.go.ke" });
    expect(parts[2]).toEqual({ type: "text", value: "." });
  });
  test("only https is clickable; javascript:, http and mailto stay plain text", () => {
    for (const s of ["javascript:alert(1)", "http://example.com", "mailto:a@b.c", "data:text/html,<b>x</b>"]) {
      expect(linkify(s)).toEqual([{ type: "text", value: s }]);
    }
  });
  test("handles empty and non-string input", () => {
    expect(linkify("")).toEqual([]);
    expect(linkify(null)).toEqual([]);
    expect(linkify(undefined)).toEqual([]);
  });
});

describe("needsGate", () => {
  test("only an explicit true from the server shows the prompt", () => {
    expect(needsGate({ needsAcknowledgement: true })).toBe(true);
    expect(needsGate({ needsAcknowledgement: false })).toBe(false);
    expect(needsGate({})).toBe(false);
  });
  test("an unavailable status never blocks anyone (fail open)", () => {
    expect(needsGate(null)).toBe(false);
    expect(needsGate(undefined)).toBe(false);
  });
});

describe("formatDate", () => {
  test("formats a date and tolerates bad input", () => {
    expect(formatDate("2026-10-24")).toMatch(/2026/);
    expect(formatDate("")).toBe("");
    expect(formatDate("not a date")).toBe("");
    expect(formatDate(null)).toBe("");
  });
});
