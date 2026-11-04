import api from "./api";

// Admin/Users.js's own comment named this exact function
// (adminService.getUsers()) as what should eventually replace its
// hardcoded demo data. Nothing under this name existed anywhere in
// the codebase until now — not a broken path, a service that was
// never written.

export const getUsers = async ({ search, role } = {}) => {
  const { data } = await api.get("/admin/users", {
    params: { search, role },
  });
  return data.data;
};

// Change a person's role directly. An admin can make a student a lecturer; only a superadmin can
// make admins (the server decides, see the backend's utils/roleChange.rules.js). The person is
// signed out everywhere and signs in again to see their new tools.
export const changeUserRole = async (userId, role, reason) => {
  const { data } = await api.patch(`/admin/users/${userId}/role`, { role, reason });
  return data;
};

export const getDashboardStats = async () => {
  const { data } = await api.get("/admin/dashboard-stats");
  return data.data;
};

const adminService = {
  getUsers,
  getDashboardStats,
};

export default adminService;
