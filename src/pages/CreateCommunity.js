import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

import { notify } from "../utils/notify";
import { getErrorMessage } from "../utils/errors";

import "../styles/pages/lists.css";

// The four types POST /communities accepts. ("university-wide" is
// created by the system and cannot be chosen.)
const TYPES = [
  ["interest", "Interest"],
  ["club", "Club"],
  ["department", "Department"],
  ["course", "Course"],
];

// The old form sent only a name, but the backend also requires a type,
// so every attempt was rejected and the error went to the console.
export default function CreateCommunity() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "interest",
    description: "",
    isPublic: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      notify.error("Please give your community a name.");
      return;
    }

    const payload = { name, type: form.type, isPublic: form.isPublic };

    if (form.description.trim()) payload.description = form.description.trim();

    setSubmitting(true);

    try {
      await API.post("/communities", payload);
      notify.success("Community created.");
      navigate("/communities");
    } catch (err) {
      notify.error(getErrorMessage(err, "We couldn't create the community."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="list-page">
      <div className="list-page-header">
        <div>
          <h2>Create community</h2>
          <p>You will be its owner and first member.</p>
        </div>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Name</span>
          <input className="list-input" name="name" value={form.name}
            onChange={handleChange} maxLength={80} required />
        </label>

        <label className="form-field">
          <span>Type</span>
          <select className="list-input" name="type" value={form.type}
            onChange={handleChange}>
            {TYPES.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Description (optional)</span>
          <textarea className="list-input" name="description" rows="4"
            value={form.description} onChange={handleChange} />
        </label>

        <label className="form-check">
          <input type="checkbox" name="isPublic" checked={form.isPublic}
            onChange={handleChange} />
          <span>Anyone at my university can join</span>
        </label>

        <button className="list-btn" type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create community"}
        </button>
      </form>
    </div>
  );
}
