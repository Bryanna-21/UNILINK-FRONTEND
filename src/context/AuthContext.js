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

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setToken(data.token);

      setUser(data.user);

      setIsAuthenticated(true);

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed.",
      };
    }
  };

  const register = async (payload) => {
    try {
      const response = await api.post(
        "/auth/register",
        payload
      );

      const data = response.data;

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setToken(data.token);

      setUser(data.user);

      setIsAuthenticated(true);

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
