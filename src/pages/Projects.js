import { useCallback, useEffect, useState } from "react";

import Skeleton from "../components/common/Skeleton";
import StateMessage from "../components/common/StateMessage";
import projectService from "../services/projectService";
import { getErrorMessage } from "../utils/errors";

import "../styles/pages/studentHome.css";
import "../styles/pages/security.css";

const STATUSES = ["planning", "active", "completed"];
const LABEL = { planning: "Planning", active: "Active", completed: "Completed" };

// Projects (GET/POST /community/projects), the same as the app. Anyone can list and start a project; the server sets
// the owner and contributors. Text is drawn as plain text.
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planning");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await projectService.getProjects();
      setProjects(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(getErrorMessage(err, "We couldn't load projects."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!title.trim()) return setFormError("Give the project a title.");
    setCreating(true);
    try {
      const res = await projectService.createProject({ title: title.trim(), description: description.trim(), status });
      if (res?.data) setProjects((prev) => [res.data, ...prev]);
      setTitle("");
      setDescription("");
      setStatus("planning");
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not create the project."));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="sh-page">
      <h2>Projects</h2>

      <form className="sec-form" onSubmit={create} noValidate style={{ marginBottom: 18 }}>
        <label htmlFor="proj-title">Start a project</label>
        <input id="proj-title" placeholder="Project title" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} disabled={creating} />
        <textarea id="proj-desc" placeholder="What is it about? (optional)" value={description} maxLength={1000} onChange={(e) => setDescription(e.target.value)} disabled={creating} rows={3} />
        <select aria-label="Project status" value={status} onChange={(e) => setStatus(e.target.value)} disabled={creating}>
          {STATUSES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
        </select>
        {formError && <p className="sec-error" role="alert">{formError}</p>}
        <div className="sec-actions">
          <button type="submit" className="get-app-download-btn" disabled={creating}>{creating ? "Creating..." : "Create project"}</button>
        </div>
      </form>

      {loading ? (
        <Skeleton variant="card" count={3} />
      ) : error ? (
        <StateMessage
          kind="error"
          title="Something went wrong"
          text={error}
          action={<button type="button" className="get-app-download-btn" onClick={load}>Try again</button>}
        />
      ) : projects.length === 0 ? (
        <div className="sh-empty">No projects yet. Start the first one above.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {projects.map((p) => (
            <li key={p._id} className="sh-card" style={{ marginBottom: 12 }}>
              <h4 style={{ margin: "0 0 4px" }}>{p.title} <small>· {LABEL[p.status] || p.status}</small></h4>
              {p.description && <p style={{ margin: "0 0 6px", whiteSpace: "pre-wrap" }}>{p.description}</p>}
              <small>{(p.contributorIds || []).length} contributor{(p.contributorIds || []).length === 1 ? "" : "s"}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
