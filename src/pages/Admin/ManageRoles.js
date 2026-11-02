import { useState } from "react";
import { toast } from "react-hot-toast";

import roleService from "../../services/roleService";

import "../../styles/pages/studentHome.css";
import "./ManageRoles.css";

// Admins turn a student into a lecturer, or a lecturer back into a student, inside their own
// university. (Making an admin is the superadmin's job and is not offered here; the server
// refuses it for admins anyway.) The person is signed out and signs in again with the new role.

const ACTIONS = {
  student: { to: "lecturer", label: "Make lecturer" },
  lecturer: { to: "student", label: "Make student" },
};

export default function ManageRoles() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState(null); // null = nothing searched yet
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const [pending, setPending] = useState(null); // { id, to }
  const [department, setDepartment] = useState("");
  const [saving, setSaving] = useState(false);
  const [rowError, setRowError] = useState("");

  const search = async (event) => {
    event.preventDefault();
    const q = query.trim();
    if (q.length < 2) {
      setError("Type at least 2 letters of a name, email or username.");
      return;
    }
    setError("");
    setSearching(true);
    setPending(null);
    try {
      const res = await roleService.searchUsers({ q });
      setUsers(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setUsers(null);
      setError(err?.response?.data?.message || "Could not search. Try again.");
    } finally {
      setSearching(false);
    }
  };

  const ask = (user) => {
    setPending({ id: user.id, to: ACTIONS[user.role].to });
    setDepartment("");
    setRowError("");
  };

  const confirm = async (user) => {
    if (!pending || saving) return;
    setSaving(true);
    setRowError("");
    try {
      const payload = { role: pending.to };
      if (pending.to === "lecturer" && department.trim()) payload.department = department.trim();
      await roleService.changeRole(user.id, payload);
      setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, role: pending.to } : u)));
      toast.success(`${user.name || "The user"} is now a ${pending.to}.`);
      setPending(null);
    } catch (err) {
      setRowError(err?.response?.data?.message || "Could not change the role.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sh-page">
      <header className="sh-header">
        <h1>Make Lecturer or Admin</h1>
        <p>Find a user in your university and change their role.</p>
      </header>

      <form className="mr-search" onSubmit={search} role="search">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, email or username"
          aria-label="Search users"
          maxLength={60}
        />
        <button type="submit" className="mr-btn" disabled={searching}>
          {searching ? "Searching…" : "Search"}
        </button>
      </form>
      {error && <div className="mr-error" role="alert">{error}</div>}

      {users === null ? (
        <p className="mr-hint">Search for the person first.</p>
      ) : users.length === 0 ? (
        <p className="mr-hint">No matching students or lecturers in your university.</p>
      ) : (
        <div className="mr-list">
          {users.map((user) => {
            const action = ACTIONS[user.role];
            const open = pending?.id === user.id;
            return (
              <div className="mr-row" key={user.id}>
                <div className="mr-row-top">
                  <div>
                    <div className="mr-name">{user.name || "Unnamed"}</div>
                    <div className="mr-sub">
                      {user.email}
                      {user.username ? ` · @${user.username}` : ""}
                    </div>
                  </div>
                  <span className="mr-badge">{user.role}</span>
                </div>

                {action && !open && (
                  <div className="mr-actions">
                    <button type="button" className="mr-btn" onClick={() => ask(user)}>
                      {action.label}
                    </button>
                  </div>
                )}

                {open && (
                  <div className="mr-confirm" role="group" aria-label="Confirm role change">
                    Make <strong>{user.name || "this user"}</strong> a <strong>{pending.to}</strong>? They will be
                    signed out and must sign in again.
                    {pending.to === "lecturer" && (
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Department (optional)"
                        aria-label="Department, optional"
                        maxLength={100}
                      />
                    )}
                    {rowError && <div className="mr-error" role="alert">{rowError}</div>}
                    <div className="mr-actions">
                      <button type="button" className="mr-btn" disabled={saving} onClick={() => confirm(user)}>
                        {saving ? "Saving…" : "Confirm"}
                      </button>
                      <button type="button" className="mr-btn mr-btn--ghost" disabled={saving} onClick={() => setPending(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
