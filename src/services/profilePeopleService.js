import api from "./api";

// What the profile page, the blocked-people list and the Community Standards page need, using only
// endpoints that exist (the same ones the app calls):
//   GET    /profile/summary/:id    name, role, avatar, bio, username, posts/followers/following counts
//   GET    /follow/:id/status      { isFollowing }
//   POST   /follow/:id             follow          DELETE /follow/:id   unfollow
//   GET    /posts/user/:id         that person's posts (with author names)
//   POST   /messages/start         { otherUserId } find-or-create a direct chat
//   GET    /people/blocks          the people you blocked
//   POST   /people/blocks/:id      block           DELETE /people/blocks/:id   unblock
//   GET    /safety/standards       the Community Standards (public)

export const getSummary = async (id) => (await api.get(`/profile/summary/${id}`)).data?.data ?? null;

export const getFollowStatus = async (id) =>
  (await api.get(`/follow/${id}/status`)).data?.data?.isFollowing === true;

export const follow = async (id) => (await api.post(`/follow/${id}`)).data;
export const unfollow = async (id) => (await api.delete(`/follow/${id}`)).data;

export const getPosts = async (id) => {
  const list = (await api.get(`/posts/user/${id}`)).data?.data;
  return Array.isArray(list) ? list : [];
};

// Returns the conversation id to open.
export const startChat = async (otherUserId) =>
  (await api.post("/messages/start", { otherUserId })).data?.data?._id ?? null;

export const listBlocks = async () => {
  const list = (await api.get("/people/blocks")).data?.data;
  return Array.isArray(list) ? list : [];
};
export const block = async (id) => (await api.post(`/people/blocks/${id}`)).data;
export const unblock = async (id) => (await api.delete(`/people/blocks/${id}`)).data;

export const getStandards = async () => (await api.get("/safety/standards")).data?.data ?? null;
