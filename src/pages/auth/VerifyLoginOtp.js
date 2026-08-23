import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

import "../../styles/Auth.css";

const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyLoginOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const { verifyLoginOtp, resendOtp } = useAuth();

  const userId = location.state?.userId;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    // Same guard as VerifyOtp - this page requires state that only
    // exists after a real password check in /login. No userId means
    // there's no in-progress login to complete.
    if (!userId) {
      navigate("/login", { replace: true });
      return;
    }

    inputRef.current?.focus();
  }, [userId, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!code.trim() || code.trim().length !== 6) {
      setError("Enter the 6-digit code from your email");
      return;
    }

    setLoading(true);

    const result = await verifyLoginOtp(userId, code.trim());

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    toast.success("Welcome back!");

    switch (result.user.role) {
      case "admin":
        navigate("/admin/dashboard", { replace: true });
        break;

      case "lecturer":
        navigate("/lecturer/dashboard", { replace: true });
        break;

      default:
        navigate("/student/dashboard", { replace: true });
    }
  };

  // resendOtp only knows the "verify_signup" purpose on the backend -
  // there is no dedicated 2FA-login resend endpoint. This is a real
  // gap: clicking resend here would issue a NEW signup-verification
  // code, not a new login code, which is the wrong purpose entirely
  // for an already-verified account mid-login. Disabled rather than
  // wired to the wrong endpoint until a proper /resend-login-otp
  // route exists on the backend.
  const handleResend = () => {
    toast(
      "Resend isn't available for login codes yet - please try logging in again if your code expired.",
      { icon: "⚠️" }
    );
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Two-Factor Verification</h2>
        <p className="subtitle">
          Enter the 6-digit code we sent to your email to complete login. If
          you don't see it, please check your spam or junk folder.
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            name="code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="input-field"
            disabled={loading}
            style={{ textAlign: "center", letterSpacing: "0.5em", fontSize: "1.5rem" }}
            required
          />

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p className="auth-link">
          Code expired or lost?{" "}
          <button
            type="button"
            onClick={handleResend}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            Resend code
          </button>
        </p>

        <p className="auth-link">
          <Link to="/login" style={{ color: "#007bff", textDecoration: "none" }}>
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
