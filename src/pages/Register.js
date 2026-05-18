import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Auth.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (!form.email.trim()) {
      setError("Please enter your email");
      return false;
    }
    if (!form.email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }
    if (!form.password) {
      setError("Please enter a password");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!form.confirmPassword) {
      setError("Please confirm your password");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    setError("");
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword
      });
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      
      alert("Registered successfully! Redirecting to login...");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.message || "Error registering. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>UniLink Registration</h2>
        <p className="subtitle">Create your account to get started</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleInputChange}
          className="input-field"
          disabled={loading}
        />
        
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleInputChange}
          className="input-field"
          disabled={loading}
        />
        
        <input
          name="password"
          type="password"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={handleInputChange}
          className="input-field"
          disabled={loading}
        />
        
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleInputChange}
          className="input-field"
          disabled={loading}
        />

        <button 
          onClick={handleRegister} 
          className="auth-button"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="auth-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#007bff" }}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
