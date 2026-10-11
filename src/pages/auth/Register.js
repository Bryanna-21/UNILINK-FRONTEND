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
  const [universitiesLoading, setUniversitiesLoading] = useState(false);
  const [universityQuery, setUniversityQuery] = useState("");
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
    const query = universityQuery.trim();
    let cancelled = false;

    if (query.length < 2) {
      setUniversities([]);
      setUniversitiesLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setUniversitiesLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await api.get("/auth/universities", {
          params: { search: query },
        });

        if (!cancelled) {
          const data = response.data?.data;
          setUniversities(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) {
          setUniversities([]);
          setError("Unable to search universities. Please try again.");
        }
      } finally {
        if (!cancelled) setUniversitiesLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [universityQuery]);

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

  const handleUniversityQueryChange = (e) => {
    const value = e.target.value;
    setUniversityQuery(value);
    setUniversities([]);
    setError("");
    setForm((prev) => ({
      ...prev,
      universityId: "",
      campusId: "",
    }));
    setCampuses([]);
  };

  const handleUniversitySelect = (university) => {
    setUniversityQuery(
      university.name +
        (university.country ? ` (${university.country})` : "")
    );
    setUniversities([]);
    setError("");
    setForm((prev) => ({
      ...prev,
      universityId: university._id,
      campusId: "",
    }));
  };

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
          <div className="university-search">
            <input
              type="text"
              name="universitySearch"
              value={universityQuery}
              onChange={handleUniversityQueryChange}
              className="input-field"
              placeholder="Type your university name"
              autoComplete="off"
              role="combobox"
              aria-label="Search for your university"
              aria-autocomplete="list"
              aria-expanded={!form.universityId && universityQuery.trim().length >= 2}
              aria-controls="university-search-results"
              disabled={loading}
              required={!form.universityId}
            />

            {!form.universityId && universityQuery.trim().length >= 0 && universityQuery.trim().length < 2 && (
              <p className="university-search-hint">
                Enter at least 2 characters to search.
              </p>
            )}

            {!form.universityId && universityQuery.trim().length >= 2 && (
              <div
                id="university-search-results"
                className="university-search-results"
                role="listbox"
              >
                {universitiesLoading && (
                  <div className="university-search-message">
                    Searching universities...
                  </div>
                )}

                {!universitiesLoading && universities.length === 0 && (
                  <div className="university-search-message">
                    No matching universities found.
                  </div>
                )}

                {!universitiesLoading && universities.map((university) => (
                  <button
                    key={university._id}
                    type="button"
                    className="university-search-option"
                    role="option"
                    aria-selected="false"
                    onClick={() => handleUniversitySelect(university)}
                    disabled={loading}
                  >
                    <span>{university.name}</span>
                    {university.country && (
                      <span className="university-search-country">
                        {university.country}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {form.universityId && (
              <button
                type="button"
                className="university-search-change"
                onClick={() => {
                  setUniversityQuery("");
                  setUniversities([]);
                  setForm((prev) => ({
                    ...prev,
                    universityId: "",
                    campusId: "",
                  }));
                  setCampuses([]);
                }}
                disabled={loading}
              >
                Change university
              </button>
            )}
          </div>

          <select
            name="campusId"
            value={form.campusId}
            onChange={handleChange}
            className="input-field"
            disabled={!form.universityId || campusesLoading || campuses.length === 0 || loading}
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
            disabled={loading || campusesLoading || !form.universityId}
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
