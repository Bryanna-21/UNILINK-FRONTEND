import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.Authorization;
    }
  }, [token]);

  const initializeAuth = async () => {
    try {
      const savedToken = localStorage.getItem("token");

      const savedUser = localStorage.getItem("user");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      setToken(savedToken);

      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error(error);

      logout();
    } finally {
      setLoading(false);
    }
  };

  const completeAuth = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      if (data.requiresTwoFactor) {
        return {
          success: false,
          reason: "requiresTwoFactor",
          userId: data.userId,
          message: data.message,
        };
      }

      completeAuth(data);

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      const data = error.response?.data;

      if (data?.requiresVerification) {
        return {
          success: false,
          reason: "requiresVerification",
          userId: data.userId,
          message: data.message,
        };
      }

      return {
        success: false,
        reason: "error",
        message: data?.message || "Login failed.",
      };
    }
  };

  const register = async (payload) => {
    try {
      const response = await api.post("/auth/register", payload);

      const data = response.data;

      return {
        success: true,
        userId: data.userId,
        email: data.email,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Registration failed.",
      };
    }
  };

  const verifyOtp = async (userId, code) => {
    try {
      const response = await api.post("/auth/verify-otp", {
        userId,
        code,
      });

      const data = response.data;

      completeAuth(data);

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Verification failed.",
      };
    }
  };

  const verifyLoginOtp = async (userId, code) => {
    try {
      const response = await api.post("/auth/verify-login-otp", {
        userId,
        code,
      });

      const data = response.data;

      completeAuth(data);

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Verification failed.",
      };
    }
  };

  const resendOtp = async (userId) => {
    try {
      const response = await api.post("/auth/resend-otp", { userId });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Could not resend the code.",
      };
    }
  };

  const requestPasswordChange = async (
    currentPassword,
    newPassword,
    confirmNewPassword
  ) => {
    try {
      const response = await api.post("/auth/request-password-change", {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Could not start the password change.",
      };
    }
  };

  const confirmPasswordChange = async (code) => {
    try {
      const response = await api.post("/auth/confirm-password-change", {
        code,
      });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Could not confirm the password change.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

    setToken("");

    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");

      const updatedUser = response.data.user;

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };

  const hasRole = (...roles) => {
    if (!user) return false;

    return roles.includes(user.role);
  };

  const value = useMemo(
    () => ({
      user,

      token,

      loading,

      isAuthenticated,

      login,

      logout,

      register,

      verifyOtp,

      verifyLoginOtp,

      resendOtp,

      requestPasswordChange,

      confirmPasswordChange,

      refreshUser,

      updateUser,

      hasRole,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      user,
      token,
      loading,
      isAuthenticated,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
