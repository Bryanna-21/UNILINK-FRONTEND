import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

import api from "../../services/api";
import "../../styles/Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [universities, setUniversities] = useState([]);
  const [universitiesLoading, setUniversitiesLoading] = useState(true);
  const [campuses, setCampuses] = useState([]);
  const [campusesLoading, setCampusesLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    universityId: "",
    campusId: "",
  });

  useEffect(() => {
    let cancelled = false;

    const loadUniversities = async () => {
      try {
        const response = await api.get("/auth/universities");
        const data = response.data?.data;

        if (!cancelled) {
          setUniversities(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load universities. Please refresh and try again.");
        }
      } finally {
        if (!cancelled) {
          setUniversitiesLoading(false);
        }
      }
    };

    loadUniversities();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setCampuses([]);

    if (!form.universityId) {
      setCampusesLoading(false);
      return () => { cancelled = true; };
    }

    setCampusesLoading(true);
    setForm((prev) => ({ ...prev, campusId: "" }));

    const loadCampuses = async () => {
      try {
        const response = await api.get(
          `/auth/universities/${form.universityId}/campuses`
        );
        const data = response.data?.data;
        if (!cancelled) setCampuses(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) {
          setCampuses([]);
          setError("Unable to load campuses. Please select your university again.");
        }
      } finally {
        if (!cancelled) setCampusesLoading(false);
      }
    };

    loadCampuses();
    return () => { cancelled = true; };
  }, [form.universityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "universityId" ? { campusId: "" } : {}),
    }));
  };

  const validateForm = () => {
    if (!form.universityId) {
      setError("Please select your university");
      return false;
    }
    if (!form.campusId) {
      setError("Please select your campus");
      return false;
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      universityId: form.universityId,
      campusId: form.campusId,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Registration never returns a token - the account exists but is
    // unverified. Route to the OTP screen with the userId the backend
    // just gave us, instead of discarding it and sending the user to
    // /login where they'd only hit "please verify your email" anyway.
    toast.success(result.message || "Account created! Check your email for a code.");

    navigate("/verify-otp", {
      state: { userId: result.userId },
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>UniLink Registration</h2>
        <p className="subtitle">Create your account to get started</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <select
            name="universityId"
            value={form.universityId}
            onChange={handleChange}
            className="input-field"
            disabled={loading || universitiesLoading || universities.length === 0}
            required
          >
            <option value="">
              {universitiesLoading
                ? "Loading universities..."
                : universities.length === 0
                  ? "No universities available"
                  : "Select your university"}
            </option>
            {universities.map((university) => (
              <option key={university._id} value={university._id}>
                {university.name}
                {university.country ? ` (${university.country})` : ""}
              </option>
            ))}
          </select>

          <select
            name="campusId"
            value={form.campusId}
            onChange={handleChange}
            className="input-field"
            disabled={!form.universityId || campusesLoading || campuses.length === 0 || loading}
            required
          >
            <option value="">
              {!form.universityId
                ? "Select your university first"
                : campusesLoading
                  ? "Loading campuses..."
                  : campuses.length === 0
                    ? "No active campuses available"
                    : "Select your campus"}
            </option>
            {campuses.map((campus) => (
              <option key={campus._id} value={campus._id}>
                {campus.name}
              </option>
            ))}
          </select>

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="input-field"
            disabled={loading}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="input-field"
            disabled={loading}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            className="input-field"
            disabled={loading}
            required
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="input-field"
            disabled={loading}
            required
          />

          <button
            type="submit"
            className="auth-button"
            disabled={loading || universitiesLoading || universities.length === 0 || campusesLoading || campuses.length === 0 || !form.universityId || !form.campusId}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/login" style={{ cursor: "pointer", color: "#007bff", textDecoration: "none" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
