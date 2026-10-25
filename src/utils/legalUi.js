// Small pure helpers for the legal screens.

// Splits text into plain pieces and https:// links so a URL in the notice is clickable. Only https links are made
// clickable, and React escapes everything, so notice text can never inject markup.
export function linkify(text) {
  const parts = [];
  const re = /(https:\/\/[^\s<>"')]+[^\s<>"').,;:!?])/g;
  let last = 0;
  let m;
  const s = String(text == null ? "" : text);
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) parts.push({ type: "text", value: s.slice(last, m.index) });
    parts.push({ type: "link", value: m[0] });
    last = m.index + m[0].length;
  }
  if (last < s.length) parts.push({ type: "text", value: s.slice(last) });
  return parts;
}

// The prompt shows only when the server says this person has not confirmed the current version. If the status could not
// be loaded (offline, server down) we do NOT block them: an outage must never lock people out of their account.
export const needsGate = (status) => !!status && status.needsAcknowledgement === true;

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
