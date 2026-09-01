import api from "./api";

// Matches the actual backend surface exactly. A previous version of
// this file described a much larger, speculative API (follow/unfollow,
// blocking, reporting, admin suspend/activate, verification flows) —
// none of it exists on the backend; find/grep across every route file
// confirmed zero matching routes. This rewrite only includes what's
// real and confirmed against src/controllers/profile.controller.js.
const userService = {
  // Minimal user lookup — name and role only. Used to resolve
  // conversation participant IDs into display names.
  async getUserSummary(userId) {
    const { data } = await api.get(`/profile/summary/${userId}`);
    return data;
  },
};

export default userService;
