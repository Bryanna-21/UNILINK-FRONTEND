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
      toast.error(result.message);
      return;
    }

    toast.success("Welcome back!");

    const from = location.state?.from?.pathname;

    if (from) {
      navigate(from, { replace: true });
      return;
    }

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
