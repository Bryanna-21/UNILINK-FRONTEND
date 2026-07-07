import api from "./api";

const userService = {
  // ==========================================
  // Current User
  // ==========================================

  async getMyProfile() {
    const response = await api.get("/users/me");
    return response.data;
  },

  async updateMyProfile(profileData) {
    const response = await api.put("/users/me", profileData);
    return response.data;
  },

  async uploadProfilePhoto(formData) {
    const response = await api.post(
      "/users/profile/photo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // ==========================================
  // User Lookup
  // ==========================================

  async getUserById(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async getUsers(page = 1, limit = 20) {
    const response = await api.get("/users", {
      params: {
        page,
        limit,
      },
    });

    return response.data;
  },

  async searchUsers(keyword) {
    const response = await api.get("/users/search", {
      params: {
        q: keyword,
      },
    });

    return response.data;
  },

  // ==========================================
  // Follow System
  // ==========================================

  async followUser(userId) {
    const response = await api.post(
      `/users/${userId}/follow`
    );

    return response.data;
  },

  async unfollowUser(userId) {
    const response = await api.delete(
      `/users/${userId}/follow`
    );

    return response.data;
  },

  async getFollowers(userId) {
    const response = await api.get(
      `/users/${userId}/followers`
    );

    return response.data;
  },

  async getFollowing(userId) {
    const response = await api.get(
      `/users/${userId}/following`
    );

    return response.data;
  },

  // ==========================================
  // Reports
  // ==========================================

  async reportUser(userId, reason) {
    const response = await api.post(
      `/users/${userId}/report`,
      {
        reason,
      }
    );

    return response.data;
  },

  async blockUser(userId) {
    const response = await api.post(
      `/users/${userId}/block`
    );

    return response.data;
  },

  async unblockUser(userId) {
    const response = await api.delete(
      `/users/${userId}/block`
    );

    return response.data;
  },

  // ==========================================
  // Verification
  // ==========================================

  async verifyStudent(studentNumber) {
    const response = await api.post(
      "/users/verify/student",
      {
        studentNumber,
      }
    );

    return response.data;
  },

  async verifyLecturer(employeeNumber) {
    const response = await api.post(
      "/users/verify/lecturer",
      {
        employeeNumber,
      }
    );

    return response.data;
  },

  async verifyUniversity(universityId) {
    const response = await api.post(
      "/users/verify/university",
      {
        universityId,
      }
    );

    return response.data;
  },

  // ==========================================
  // Admin
  // ==========================================

  async suspendUser(userId) {
    const response = await api.patch(
      `/admin/users/${userId}/suspend`
    );

    return response.data;
  },

  async activateUser(userId) {
    const response = await api.patch(
      `/admin/users/${userId}/activate`
    );

    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(
      `/admin/users/${userId}`
    );

    return response.data;
  },

  async getReportedUsers() {
    const response = await api.get(
      "/admin/users/reported"
    );

    return response.data;
  },

  async getSuspendedUsers() {
    const response = await api.get(
      "/admin/users/suspended"
    );

    return response.data;
  },

  async getUserStatistics() {
    const response = await api.get(
      "/admin/users/statistics"
    );

    return response.data;
  },
};

export default userService;
