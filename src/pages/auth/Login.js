import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

import "../../styles/pages/login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!form.password.trim()) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);

    const result = await login(form.email, form.password);

    setLoading(false);

    if (!result.success) {
      // Two of the three failure shapes aren't really failures - they're
      // mid-flow states that need to route somewhere with context, not
      // just show an error toast and go nowhere.
      if (result.reason === "requiresVerification") {
        toast(result.message || "Please verify your email first.");
        navigate("/verify-otp", {
          state: { userId: result.userId },
        });
        return;
      }

      if (result.reason === "requiresTwoFactor") {
        toast(result.message || "A login code has been sent to your email.");
        navigate("/verify-login-otp", {
          state: { userId: result.userId },
        });
        return;
      }

      toast.error(result.message);
      return;
    }

    toast.success("Welcome back!");

    // Role-based home route is the source of truth. A `from` redirect
    // (set by ProtectedRoute when an unauthenticated user hits a guarded
    // URL) is only honored if it actually falls under that role's section
    // of the app - otherwise a lecturer bounced from /admin/dashboard
    // would get sent right back into a route their role can't access,
    // producing a 403 that only "clears" on refresh once state settles
    // against a route that's still wrong for them.
    const roleHome = {
      admin: "/admin/dashboard",
      lecturer: "/lecturer/dashboard",
      student: "/student/dashboard",
    };

    const homePath = roleHome[result.user.role] || "/student/dashboard";
    const roleSection = homePath.split("/dashboard")[0]; // e.g. "/admin"

    const from = location.state?.from?.pathname;
    const target = from && from.startsWith(roleSection) ? from : homePath;

    navigate(target, { replace: true });
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          <h1>UniLink</h1>
          <p>University Management Platform</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <FaEnvelope className="input-icon" />

            <input
              type="email"
              name="email"
              placeholder="University Email"
              value={form.email}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>

          </div>

          <div className="remember-row">

            <label>

              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />

              Remember Me

            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          <button
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
          </button>

        </form>

        <div className="login-footer">

          <span>Don't have an account?</span>

          <Link to="/register">
            Register
          </Link>

        </div>

      </div>

    </div>
  );
}
