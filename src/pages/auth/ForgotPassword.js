import { Link } from "react-router-dom";
import { FaLock, FaArrowLeft } from "react-icons/fa";
import "../../styles/pages/login.css";

export default function ForgotPassword() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <h1>UniLink</h1>
          <p>University Management Platform</p>
        </div>

        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <FaLock size={40} style={{ marginBottom: "20px", opacity: 0.6 }} />

          <h2 style={{ marginBottom: "12px" }}>Password Reset Unavailable</h2>

          <p style={{ marginBottom: "24px", opacity: 0.8 }}>
            Self-service password reset isn't set up yet. If you're locked
            out of your account, please contact your system administrator
            for help resetting your password.
          </p>

          <Link to="/login" className="login-btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none" }}>
            <FaArrowLeft />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
