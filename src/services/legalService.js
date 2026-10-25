import api from "./api";

// The Privacy Notice lives on the server (GET /api/legal/privacy) so the website and the mobile app always show the same
// text and a wording change never needs a release.

export const getPrivacyNotice = async () => {
  const res = await api.get("/legal/privacy");
  return res.data.data;
};

// Has the signed-in person confirmed they have read the CURRENT version?
export const getLegalStatus = async () => {
  const res = await api.get("/legal/status");
  return res.data.data;
};

// Records that this person confirmed they read this exact version. The server refuses an out-of-date version (409).
export const acknowledgePrivacy = async (version) => {
  const res = await api.post("/legal/acknowledge", { policyType: "privacy", version, source: "web" });
  return res.data.data;
};
