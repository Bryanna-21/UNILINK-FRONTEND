// "Save" on a post (web): every photo, video or document in it is downloaded to the computer or phone.
// Fetching the file and saving it as a blob makes the browser download it instead of opening it. If the
// browser refuses to fetch it (another site's rules), the file opens in a new tab and can be saved from there.

const extensionOf = (url) => {
  const m = String(url).split("?")[0].match(/\.([a-zA-Z0-9]{2,5})$/);
  return m ? m[1].toLowerCase() : "";
};

const clean = (text) =>
  String(text || "")
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

// A readable file name. Documents keep their own name; photos and videos are named after the author.
export function saveFileName(post, item, index, total) {
  const ext = extensionOf(item.url);
  if (item.type === "document" && item.originalName) return clean(item.originalName) || `document${ext ? `.${ext}` : ""}`;
  const base = clean(`${post.authorName || "UniLink"} post`) || "UniLink post";
  const numbered = total > 1 ? `${base} ${index + 1}` : base;
  return ext ? `${numbered}.${ext}` : numbered;
}

async function saveOne(url, fileName) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`download failed (${response.status})`);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    return "saved";
  } catch {
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    return opened ? "opened" : "failed";
  }
}

// Resolves to { saved, opened, failed } so the screen can say what happened.
export async function savePostMedia(post, media) {
  const result = { saved: 0, opened: 0, failed: 0 };
  for (let i = 0; i < media.length; i += 1) {
    const outcome = await saveOne(media[i].url, saveFileName(post, media[i], i, media.length));
    result[outcome] += 1;
  }
  return result;
}
