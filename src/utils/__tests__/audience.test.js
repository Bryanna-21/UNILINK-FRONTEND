import { AUDIENCE_OPTIONS, DEFAULT_AUDIENCE, audienceBadge, audienceFields, audienceIsComplete, audienceOption, describeAudience } from "../audience";

test("the default is the author's university, the same as every older post", () => {
  expect(DEFAULT_AUDIENCE.kind).toBe("university");
  expect(audienceFields(DEFAULT_AUDIENCE)).toEqual({ audience: "university" });
});

test("the six choices the server understands are all offered", () => {
  expect(AUDIENCE_OPTIONS.map((o) => o.kind)).toEqual(["everyone", "university", "universities", "followers", "friends", "people"]);
});

test("the list audiences send their picks as JSON text, and nothing extra for the others", () => {
  const unis = { kind: "universities", universities: [{ _id: "a1", name: "Uni A" }, { _id: "b2", name: "Uni B" }], people: [{ _id: "x", name: "stray" }] };
  expect(audienceFields(unis)).toEqual({ audience: "universities", audienceUniversityIds: JSON.stringify(["a1", "b2"]) });
  const people = { kind: "people", universities: [{ _id: "stray", name: "x" }], people: [{ _id: "p1", name: "Amina" }] };
  expect(audienceFields(people)).toEqual({ audience: "people", audienceUserIds: JSON.stringify(["p1"]) });
  expect(audienceFields({ kind: "everyone", universities: [], people: [] })).toEqual({ audience: "everyone" });
});

test("a list audience with nobody picked is not complete", () => {
  expect(audienceIsComplete({ kind: "universities", universities: [], people: [] })).toBe(false);
  expect(audienceIsComplete({ kind: "people", universities: [], people: [] })).toBe(false);
  expect(audienceIsComplete({ kind: "people", universities: [], people: [{ _id: "p", name: "P" }] })).toBe(true);
  expect(audienceIsComplete({ kind: "followers", universities: [], people: [] })).toBe(true);
});

test("the label says how many were picked", () => {
  expect(describeAudience({ kind: "universities", universities: [{ _id: "1", name: "A" }, { _id: "2", name: "B" }], people: [] })).toBe("Chosen universities (2)");
  expect(describeAudience({ kind: "friends", universities: [], people: [] })).toBe("Friends");
});

test("the badge says nothing for the usual case and names every other audience", () => {
  expect(audienceBadge(undefined)).toBeNull();
  expect(audienceBadge("university")).toBeNull();
  expect(audienceBadge("everyone")).toContain("Everyone");
  expect(audienceBadge("people")).toContain("Specific people");
  expect(audienceOption("nonsense").kind).toBe("university");
});
