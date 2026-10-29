import { isDeadSession } from "../sessionErrors";
import { resolveWebLink } from "../notificationLinks";

const err = (status, message) => ({ response: { status, data: { message } } });

describe("isDeadSession", () => {
  test.each(["Invalid token", "Session expired. Please login again.", "No token provided"])("401 '%s' ends the session", (m) => {
    expect(isDeadSession(err(401, m))).toBe(true);
  });
  test("a wrong password on the login form does not", () => {
    expect(isDeadSession(err(401, "Invalid email or password"))).toBe(false);
  });
  test("a busy server (503) does not", () => {
    expect(isDeadSession(err(503, "The server is busy for a moment. Please try again."))).toBe(false);
    expect(isDeadSession(err(503, "Invalid token"))).toBe(false);
  });
  test("a 401 with no message, or no response at all, does not", () => {
    expect(isDeadSession({ response: { status: 401, data: {} } })).toBe(false);
    expect(isDeadSession({ response: { status: 401 } })).toBe(false);
    expect(isDeadSession({})).toBe(false);
    expect(isDeadSession(undefined)).toBe(false);
  });
});

describe("resolveWebLink", () => {
  test("posts open the Campus feed, people have no web page yet", () => {
    expect(resolveWebLink("/post/abc123")).toBe("/feed");
    expect(resolveWebLink("/user/abc123")).toBeNull();
  });
  test("existing web routes pass through; empty links go nowhere", () => {
    expect(resolveWebLink("/messages/abc123")).toBe("/messages/abc123");
    expect(resolveWebLink("/exams/abc123")).toBe("/exams/abc123");
    expect(resolveWebLink("")).toBeNull();
    expect(resolveWebLink(undefined)).toBeNull();
  });
});
