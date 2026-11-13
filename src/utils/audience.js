// Who a post is for. The server decides (backend src/utils/postAudience.js); this file only names the choices
// for the screens. A post with no audience is a post from before audiences existed: it is for the author's
// university. The mobile app has the same list (src/utils/audience.ts).

export const AUDIENCE_OPTIONS = [
  { kind: "everyone", icon: "🌍", label: "Everyone", hint: "Anyone on UniLink, at any university" },
  { kind: "university", icon: "🎓", label: "My university", hint: "Only people at your university" },
  { kind: "universities", icon: "🏛️", label: "Chosen universities", hint: "Pick the universities that can see it" },
  { kind: "followers", icon: "👥", label: "Followers", hint: "People who follow you" },
  { kind: "friends", icon: "🤝", label: "Friends", hint: "People you follow who follow you back" },
  { kind: "people", icon: "🔒", label: "Specific people", hint: "Only the people you pick" },
];

export const DEFAULT_AUDIENCE = { kind: "university", universities: [], people: [] };

export const audienceOption = (kind) =>
  AUDIENCE_OPTIONS.find((o) => o.kind === kind) || AUDIENCE_OPTIONS[1];

export function describeAudience(value) {
  const option = audienceOption(value.kind);
  if (value.kind === "universities") return `${option.label} (${value.universities.length})`;
  if (value.kind === "people") return `${option.label} (${value.people.length})`;
  return option.label;
}

// The two list audiences need at least one pick.
export function audienceIsComplete(value) {
  if (value.kind === "universities") return value.universities.length > 0;
  if (value.kind === "people") return value.people.length > 0;
  return true;
}

// What the server wants. Lists travel as JSON text, which works in a multipart form.
export function audienceFields(value) {
  const fields = { audience: value.kind };
  if (value.kind === "universities") fields.audienceUniversityIds = JSON.stringify(value.universities.map((u) => u._id));
  if (value.kind === "people") fields.audienceUserIds = JSON.stringify(value.people.map((p) => p._id));
  return fields;
}

// The small label on a post. The default (university) says nothing, because most posts are that.
export function audienceBadge(audience) {
  if (!audience || audience === "university") return null;
  const o = audienceOption(audience);
  return `${o.icon} ${o.label}`;
}
