// The web app's security headers live in vercel.json. This reads the real file, so a typo or a loosened policy fails here.
const fs = require("fs");
const path = require("path");

const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), "vercel.json"), "utf8"));
const headers = Object.fromEntries(config.headers.find((h) => h.source === "/(.*)").headers.map((h) => [h.key, h.value]));
const csp = Object.fromEntries(headers["Content-Security-Policy"].split(";").map((d) => d.trim()).filter(Boolean).map((d) => { const [k, ...v] = d.split(/\s+/); return [k, v]; }));

test("every page is served with the full set of security headers", () => {
  for (const key of ["Content-Security-Policy", "Strict-Transport-Security", "X-Frame-Options", "X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "Cross-Origin-Opener-Policy"]) {
    expect(headers[key]).toBeTruthy();
  }
  expect(headers["X-Frame-Options"]).toBe("DENY");
  expect(headers["X-Content-Type-Options"]).toBe("nosniff");
  expect(headers["Strict-Transport-Security"]).toMatch(/max-age=\d{7,}/);
});

test("scripts may only come from the site itself: no inline scripts, no eval, no other hosts", () => {
  expect(csp["script-src"]).toEqual(["'self'"]);
  expect(JSON.stringify(csp)).not.toMatch(/unsafe-eval/);
});

test("the page cannot be framed, cannot load plugins, and cannot be pointed at another base address or form target", () => {
  expect(csp["frame-ancestors"]).toEqual(["'none'"]);
  expect(csp["object-src"]).toEqual(["'none'"]);
  expect(csp["base-uri"]).toEqual(["'self'"]);
  expect(csp["form-action"]).toEqual(["'self'"]);
  expect(csp["default-src"]).toEqual(["'self'"]);
});

test("what the app really needs still works: photos and videos over https, the API over https and wss", () => {
  expect(csp["img-src"]).toEqual(expect.arrayContaining(["'self'", "data:", "blob:", "https:"]));
  expect(csp["media-src"]).toEqual(expect.arrayContaining(["'self'", "https:"]));
  expect(csp["connect-src"]).toEqual(expect.arrayContaining(["'self'", "https:", "wss:"]));
});

test("single-page-app links still work: every path falls back to index.html", () => {
  expect(config.rewrites).toEqual([{ source: "/(.*)", destination: "/index.html" }]);
});

test("the built page really has no inline script that the policy would block", () => {
  const indexPath = path.join(process.cwd(), "build", "index.html");
  if (!fs.existsSync(indexPath)) return; // only checked when a build exists
  const html = fs.readFileSync(indexPath, "utf8");
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].filter((m) => m[1].trim() !== "");
  expect(inline).toEqual([]);
});
