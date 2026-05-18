import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Auth.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!form.email.trim()) {
      setError("Please enter your email");
      return false;
    }
    if (!form.email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }
    if (!form.password) {
      setError("Please enter your password");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setError("");
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password
      });
      
      // Store token
      localStorage.setItem("token", res.data.token);
      
      // Redirect to feed
      navigate("/feed");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>UniLink Login</h2>
        <p className="subtitle">Welcome back to the network</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="input-field"
          disabled={loading}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="input-field"
          disabled={loading}
        />

        <button 
          onClick={handleLogin} 
          className="auth-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} style={{ cursor: "pointer", color: "#007bff" }}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
