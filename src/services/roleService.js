import api from "./api";

// Backend: src/controllers/roleAdmin.controller.js
const roleService = {
  // People the caller is allowed to promote or demote. Needs 2+ letters, or a role.
  async searchUsers({ q, role } = {}) {
    const { data } = await api.get("/admin/roles/users", { params: { q: q || undefined, role: role || undefined } });
    return data;
  },

  // { role: "lecturer" | "student" | "admin", department?, universityId?, platformWide? }
  async changeRole(userId, payload) {
    const { data } = await api.patch(`/admin/roles/${userId}`, payload);
    return data;
  },
};

export default roleService;
