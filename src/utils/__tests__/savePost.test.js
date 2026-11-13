import { saveFileName, savePostMedia } from "../savePost";

const post = { authorName: "Amina Wanjiru" };

test("a document keeps its own name; photos are named after the author and numbered", () => {
  expect(saveFileName(post, { type: "document", originalName: "Week 3: Notes?.pdf", url: "https://x/a.pdf" }, 0, 1)).toBe("Week 3 Notes.pdf");
  expect(saveFileName(post, { type: "image", url: "https://x/a.jpg?v=1" }, 0, 1)).toBe("Amina Wanjiru post.jpg");
  expect(saveFileName(post, { type: "image", url: "https://x/a.jpg" }, 1, 3)).toBe("Amina Wanjiru post 2.jpg");
  expect(saveFileName({}, { type: "video", url: "https://x/v" }, 0, 1)).toBe("UniLink post");
});

describe("saving", () => {
  const realFetch = global.fetch;
  const realCreate = URL.createObjectURL;
  const realRevoke = URL.revokeObjectURL;
  let clicks;
  beforeEach(() => {
    clicks = [];
    URL.createObjectURL = jest.fn(() => "blob:fake");
    URL.revokeObjectURL = jest.fn();
    jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function click() { clicks.push(this.download); });
  });
  afterEach(() => {
    global.fetch = realFetch;
    URL.createObjectURL = realCreate;
    URL.revokeObjectURL = realRevoke;
    jest.restoreAllMocks();
  });

  test("every file is fetched and downloaded under a readable name", async () => {
    global.fetch = jest.fn(async () => ({ ok: true, status: 200, blob: async () => new Blob(["x"]) }));
    const result = await savePostMedia(post, [{ type: "image", url: "https://x/1.jpg" }, { type: "document", originalName: "Notes.pdf", url: "https://x/n.pdf" }]);
    expect(result).toEqual({ saved: 2, opened: 0, failed: 0 });
    expect(clicks).toEqual(["Amina Wanjiru post 1.jpg", "Notes.pdf"]);
  });

  test("when the browser will not fetch the file, it opens in a new tab instead", async () => {
    global.fetch = jest.fn(async () => { throw new TypeError("blocked by CORS"); });
    jest.spyOn(window, "open").mockImplementation(() => ({}));
    const result = await savePostMedia(post, [{ type: "image", url: "https://x/1.jpg" }]);
    expect(result).toEqual({ saved: 0, opened: 1, failed: 0 });
    expect(window.open).toHaveBeenCalledWith("https://x/1.jpg", "_blank", "noopener,noreferrer");
  });

  test("a file that cannot be fetched or opened is reported as failed, not thrown", async () => {
    global.fetch = jest.fn(async () => ({ ok: false, status: 404 }));
    jest.spyOn(window, "open").mockImplementation(() => null);
    const result = await savePostMedia(post, [{ type: "image", url: "https://x/1.jpg" }]);
    expect(result).toEqual({ saved: 0, opened: 0, failed: 1 });
  });
});
