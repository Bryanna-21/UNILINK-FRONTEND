import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        const { data } = await api.get("/auth/me");

        setUser(data.user);
      } catch (error) {
        console.error("Authentication initialization failed:", error);

        logout();
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);

      setToken(data.token);
      setUser(data.user);

      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to login. Please try again.",
      };
    }
  };

  const register = async (payload) => {
    try {
      const { data } = await api.post("/auth/register", payload);

      localStorage.setItem("token", data.token);

      setToken(data.token);
      setUser(data.user);

      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    delete api.defaults.headers.common.Authorization;

    setUser(null);
    setToken("");
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get("/auth/me");

      setUser(data.user);

      return true;
    } catch {
      logout();
      return false;
    }
  };

  const isAuthenticated = !!user && !!token;

  const isAdmin = user?.role === "admin";

  const isLecturer = user?.role === "lecturer";

  const isStudent = user?.role === "student";

  const value = {
    user,
    token,
    loading,

    login,
    logout,
    register,
    refreshUser,

    isAuthenticated,
    isAdmin,
    isLecturer,
    isStudent,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
