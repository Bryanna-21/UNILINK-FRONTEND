// Date helpers shared by the academic pages. Always computed from the
// real value, never from a hard-coded string.
export const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// YYYY-MM-DD in the viewer's own timezone, the format the attendance
// endpoint expects.
export const todayLocalISO = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};

// Only http(s) links are ever opened from stored file URLs.
export const isSafeUrl = (url) => /^https?:\/\//i.test(String(url || ""));

export const unitLabel = (course) =>
  course ? [course.code, course.title].filter(Boolean).join(" - ") : "";
