import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

import "../../styles/Auth.css";

const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const { verifyOtp, resendOtp } = useAuth();

  const userId = location.state?.userId;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    // This page is meaningless without a userId to verify against -
    // someone landing here directly (typed URL, refresh after the
    // state was lost) has nowhere to go. Send them back to register
    // rather than render a form that can never succeed.
    if (!userId) {
      navigate("/register", { replace: true });
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

    const result = await verifyOtp(userId, code.trim());

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    toast.success("Account verified!");

    navigate("/student/dashboard", { replace: true });
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);

    const result = await resendOtp(userId);

    setResending(false);

    if (result.success) {
      toast.success(result.message || "A new code has been sent.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } else {
      toast.error(result.message);
    }
  };

  if (!userId) {
    // Render nothing while the redirect above is taking effect.
    return null;
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Verify Your Email</h2>
        <p className="subtitle">
          Enter the 6-digit code we sent to your email. If you don't see it,
          please check your spam or junk folder.
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
          Didn't get a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            style={{
              background: "none",
              border: "none",
              color: cooldown > 0 ? "#999" : "#007bff",
              cursor: cooldown > 0 ? "default" : "pointer",
              textDecoration: cooldown > 0 ? "none" : "underline",
              padding: 0,
            }}
          >
            {resending
              ? "Sending..."
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend code"}
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
