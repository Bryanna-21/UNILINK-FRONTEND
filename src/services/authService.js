import api from "./api";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const authService = {
  // ==========================
  // Authentication
  // ==========================

  async login(credentials) {
    const response = await api.post("/auth/login", credentials);

    const { token, user } = response.data;

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }

    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return response.data;
  },

  async register(userData) {
    const response = await api.post("/auth/register", userData);

    return response.data;
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout endpoint unavailable.");
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async forgotPassword(email) {
    const response = await api.post("/auth/forgot-password", {
      email,
    });

    return response.data;
  },

  async resetPassword(data) {
    const response = await api.post(
      "/auth/reset-password",
      data
    );

    return response.data;
  },

  async verifyEmail(token) {
    const response = await api.get(
      `/auth/verify-email/${token}`
    );

    return response.data;
  },

  async refreshToken() {
    const response = await api.post("/auth/refresh");

    if (response.data.token) {
      localStorage.setItem(
        TOKEN_KEY,
        response.data.token
      );
    }

    return response.data;
  },

  // ==========================
  // User
  // ==========================

  async getCurrentUser() {
    const response = await api.get("/users/me");

    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put(
      "/users/me",
      data
    );

    if (response.data.user) {
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(response.data.user)
      );
    }

    return response.data;
  },

  async changePassword(data) {
    const response = await api.put(
      "/users/change-password",
      data
    );

    return response.data;
  },

  // ==========================
  // Storage Helpers
  // ==========================

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  getUser() {
    const user = localStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;
  },

  setUser(user) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );
  },

  removeUser() {
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  isAdmin() {
    const user = this.getUser();

    if (!user) return false;

    return (
      user.role === "admin" ||
      user.role === "super_admin"
    );
  },

  isStudent() {
    const user = this.getUser();

    if (!user) return false;

    return user.role === "student";
  },

  isLecturer() {
    const user = this.getUser();

    if (!user) return false;

    return user.role === "lecturer";
  }
};

export default authService;
