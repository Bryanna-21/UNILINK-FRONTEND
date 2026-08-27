import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaKey, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

import "../../styles/pages/login.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword, resetPassword } = useAuth();

  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleRequestCode = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setStep("reset");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Code is required");
      return;
    }

    if (!newPassword.trim() || !confirmNewPassword.trim()) {
      toast.error("Please fill in both password fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await resetPassword(
      email,
      code,
      newPassword,
      confirmNewPassword
    );
    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    navigate("/login", { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <h1>UniLink</h1>
          <p>University Management Platform</p>
        </div>

        {step === "email" ? (
          <form onSubmit={handleRequestCode}>
            <p style={{ marginBottom: "20px", opacity: 0.8, textAlign: "center" }}>
              Enter your email and we'll send you a code to reset your password.
            </p>

            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="University Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button className="login-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <p style={{ marginBottom: "20px", opacity: 0.8, textAlign: "center" }}>
              Enter the code sent to {email} and choose a new password.
            </p>

            <div className="input-group">
              <FaKey className="input-icon" />
              <input
                type="text"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>

            <button className="login-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="login-footer">
          <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <FaArrowLeft size={12} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
