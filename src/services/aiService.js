import api from "./api";

// Matches the real backend contract exactly (src/controllers/ai.controller.js).
// Single endpoint - POST /api/ai/ask - any authenticated role, rate
// limited server-side (30/day per user) via an atomic upsert-and-
// increment, not something the client can influence or bypass.
const aiService = {
  // history is optional: an array of { role: "user"|"assistant", content }
  // representing the visible conversation so far. The backend caps it
  // to the last 10 turns and sanitizes content length itself - the
  // frontend can pass its full local log without worrying about that.
  async ask(message, history = []) {
    const { data } = await api.post("/ai/ask", { message, history });
    return data;
  },
};

export default aiService;
