import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function getDeviceId() {
  const key = "unilink_device_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `${window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => { initializeAuth(); }, []);
  useEffect(() => {
    if (token) api.defaults.headers.Authorization = `Bearer ${token}`;
    else delete api.defaults.headers.Authorization;
  }, [token]);

  const initializeAuth = async () => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (!savedToken || !savedUser) return;
      const parsed = JSON.parse(savedUser);
      if (parsed?.role && parsed.role !== "student") { logout(); return; }
      setToken(savedToken); setUser(parsed); setIsAuthenticated(true);
    } catch { logout(); } finally { setLoading(false); }
  };

  const completeAuth = (data) => {
    if (data?.user?.role && data.user.role !== "student") throw new Error("This application is for students.");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token); setUser(data.user); setIsAuthenticated(true);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password, deviceId: getDeviceId() });
      const data = response.data;
      if (data.requiresTwoFactor || data.requiresLoginOtp) return { success:false, reason:"requiresTwoFactor", userId:data.userId, message:data.message || "We sent a verification code to your email." };
      completeAuth(data);
      return { success:true, user:data.user };
    } catch (error) {
      const data = error.response?.data;
      if (data?.requiresVerification) return { success:false, reason:"requiresVerification", userId:data.userId, message:data.message };
      return { success:false, reason:"error", message:data?.message || "Unable to sign in. Please check your details and try again." };
    }
  };

  const register = async (payload) => {
    try {
      const response = await api.post("/auth/register", { ...payload, role:"student" });
      return { success:true, userId:response.data.userId, email:response.data.email, message:response.data.message };
    } catch (error) { return { success:false, message:error.response?.data?.message || "Registration failed." }; }
  };

  const verifyOtp = async (userId, code) => {
    try { const { data } = await api.post("/auth/verify-otp", { userId, code }); completeAuth(data); return { success:true, user:data.user }; }
    catch (error) { return { success:false, message:error.response?.data?.message || "Verification failed." }; }
  };

  const verifyLoginOtp = async (userId, code) => {
    try { const { data } = await api.post("/auth/verify-login-otp", { userId, code, deviceId:getDeviceId() }); completeAuth(data); return { success:true, user:data.user }; }
    catch (error) { return { success:false, message:error.response?.data?.message || "Verification failed." }; }
  };

  const resendOtp = async (userId, purpose="signup") => {
    try { const { data } = await api.post(purpose === "login" ? "/auth/resend-login-otp" : "/auth/resend-otp", { userId }); return { success:true, message:data.message }; }
    catch (error) { return { success:false, message:error.response?.data?.message || "Could not resend the code." }; }
  };

  const requestPasswordChange = async (currentPassword, newPassword, confirmNewPassword) => {
    try { const { data } = await api.post("/auth/request-password-change", { currentPassword, newPassword, confirmNewPassword }); return { success:true, message:data.message }; }
    catch (error) { return { success:false, message:error.response?.data?.message || "Could not start the password change." }; }
  };

  const confirmPasswordChange = async (code) => {
    try { const { data } = await api.post("/auth/confirm-password-change", { code }); return { success:true, message:data.message }; }
    catch (error) { return { success:false, message:error.response?.data?.message || "Could not confirm the password change." }; }
  };

  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null); setToken(""); setIsAuthenticated(false); };
  const refreshUser = async () => { try { const {data}=await api.get("/auth/me"); if(data.user?.role !== "student") return false; setUser(data.user); localStorage.setItem("user",JSON.stringify(data.user)); return true; } catch { return false; } };
  const updateUser = (updatedUser) => { if(updatedUser?.role !== "student") return; setUser(updatedUser); localStorage.setItem("user",JSON.stringify(updatedUser)); };
  const hasRole = (...roles) => !!user && roles.includes(user.role);

  const value = useMemo(() => ({ user, token, loading, isAuthenticated, login, logout, register, verifyOtp, verifyLoginOtp, resendOtp, requestPasswordChange, confirmPasswordChange, refreshUser, updateUser, hasRole }), [user, token, loading, isAuthenticated]);
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
export default AuthContext;
