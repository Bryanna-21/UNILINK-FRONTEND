import api from "./api";

// Matches the actual backend surface in UNILINK-BACKEND's
// message.controller.js / message.routes.js exactly. A previous
// version of this file described a much larger, speculative API
// (typing indicators, reactions, message editing, blocking, archive,
// search) that was never built on the backend — none of those
// functions worked, since the routes never existed. This rewrite only
// includes endpoints that are real and have been curl-verified.
const messageService = {
  // ── Conversations ──────────────────────────────────────────────

  // Returns every conversation (direct, course, or group) the current
  // user is a participant in, sorted by most recent activity.
  async getConversations() {
    const { data } = await api.get("/messages");
    return data;
  },

  // otherUserId -> find-or-create a direct conversation.
  // courseId -> find-or-create a course conversation shell (does NOT
  //   add the caller as a participant; call joinConversation after).
  // title (alone) -> create a standalone discussion group (DOES add
  //   the caller as the first participant/creator immediately).
  async startConversation({ otherUserId, courseId, title } = {}) {
    const { data } = await api.post("/messages/start", {
      otherUserId,
      courseId,
      title,
    });
    return data;
  },

  // Look up a course's conversation without requiring the caller
  // already be a participant — used to show "Join Course Chat" vs
  // "Open Chat" before the user has joined. Returns { data: null }
  // if no course conversation has been created yet.
  async getCourseConversation(courseId) {
    const { data } = await api.get(`/messages/course/${courseId}`);
    return data;
  },

  // Self-join. type "course" ONLY — will 400 if called on a group or
  // direct conversation.
  async joinConversation(conversationId) {
    const { data } = await api.post(`/messages/${conversationId}/join`);
    return data;
  },

  // Add someone else to a standalone group. type "group" ONLY. Caller
  // must already be a participant.
  async addMember(conversationId, targetUserId) {
    const { data } = await api.post(`/messages/${conversationId}/members`, {
      targetUserId,
    });
    return data;
  },

  // Voluntary leave. Valid for "course" and "group", NOT "direct".
  async leaveConversation(conversationId) {
    const { data } = await api.post(`/messages/${conversationId}/leave`);
    return data;
  },

  // ── Messages ───────────────────────────────────────────────────

  async getMessages(conversationId) {
    const { data } = await api.get(`/messages/${conversationId}/messages`);
    return data;
  },

  async sendMessage(conversationId, text) {
    const { data } = await api.post(`/messages/${conversationId}/messages`, {
      text,
    });
    return data;
  },
};

export default messageService;
