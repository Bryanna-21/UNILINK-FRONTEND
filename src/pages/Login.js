import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.email.trim() || !form.password) {
      setError("Please enter email and password");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      login(res.data.user, res.data.token);
      navigate("/feed");
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back to UniLink</h2>
        <p className="subtitle">Sign in to continue</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleInputChange}
            className="input-field"
            disabled={loading}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleInputChange}
            className="input-field"
            disabled={loading}
            required
          />

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account?{" "}
          <span 
            onClick={() => navigate("/register")} 
            style={{ cursor: "pointer", color: "#007bff" }}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
