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

export const getDashboardStats = async () => {
  const { data } = await api.get("/admin/dashboard-stats");
  return data.data;
};

const adminService = {
  getUsers,
  getDashboardStats,
};

export default adminService;
