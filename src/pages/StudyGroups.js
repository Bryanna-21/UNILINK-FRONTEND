import { useEffect, useState } from "react";
import { FaUsers, FaPlus, FaClock, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import studyGroupsService from "../services/studyGroupsService";
import { useAuth } from "../context/AuthContext";
import Skeleton from "../components/common/Skeleton";
import Toast from "../components/common/Toast";
import "./StudyGroups.css";

const StudyGroups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const [form, setForm] = useState({
    title: "",
    description: "",
    meetingTime: "",
    location: "",
  });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const res = await studyGroupsService.getStudyGroups();
      setGroups(res?.data ?? []);
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not load study groups." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setToast({ show: true, type: "error", message: "Title is required." });
      return;
    }

    setCreating(true);
    try {
      const res = await studyGroupsService.createStudyGroup({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        meetingTime: form.meetingTime.trim() || undefined,
        location: form.location.trim() || undefined,
      });
      setGroups((prev) => [res.data, ...prev]);
      setForm({ title: "", description: "", meetingTime: "", location: "" });
      setShowForm(false);
      setToast({ show: true, type: "success", message: "Study group created." });
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not create study group." });
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (group) => {
    setJoiningId(group._id);
    try {
      const res = await studyGroupsService.joinStudyGroup(group._id);
      setGroups((prev) => prev.map((g) => (g._id === group._id ? res.data : g)));
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not join study group." });
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="sg-page">
      <div className="sg-header">
        <div>
          <h1>
            <FaUsers /> Study Groups
          </h1>
          <p>Join a group studying your units, or start your own.</p>
        </div>
        <button className="sg-create-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> New Group
        </button>
      </div>

      {loading ? (
        <Skeleton variant="card" count={6} />
      ) : groups.length === 0 ? (
        <div className="sg-empty">
          <FaUsers size={40} />
          <p>No study groups yet. Start one.</p>
        </div>
      ) : (
        <div className="sg-grid">
          {groups.map((group) => {
            const isMember = !!user && group.memberIds?.includes(user.id);
            return (
              <div className="sg-card" key={group._id}>
                <h3>{group.title}</h3>
                {group.description && <p className="sg-description">{group.description}</p>}
                {group.meetingTime && (
                  <span className="sg-meta">
                    <FaClock /> {group.meetingTime}
                  </span>
                )}
                {group.location && (
                  <span className="sg-meta">
                    <FaMapMarkerAlt /> {group.location}
                  </span>
                )}
                <span className="sg-member-count">
                  {group.memberIds?.length ?? 0} member{group.memberIds?.length === 1 ? "" : "s"}
                </span>
                {group.members && group.members.length > 0 && (
                  <span className="sg-member-names">
                    {group.members.map((m) => m.name).join(", ")}
                  </span>
                )}

                {isMember ? (
                  <span className="sg-member-tag">You're a member</span>
                ) : (
                  <button
                    className="sg-join-btn"
                    disabled={joiningId === group._id}
                    onClick={() => handleJoin(group)}
                  >
                    {joiningId === group._id ? "Joining..." : "Join"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="sg-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="sg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sg-modal-header">
              <h2>New Study Group</h2>
              <button onClick={() => setShowForm(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreate} className="sg-form">
              <div className="sg-form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. CS201 Study Group"
                  required
                />
              </div>

              <div className="sg-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="What will this group focus on?"
                  rows="3"
                />
              </div>

              <div className="sg-form-group">
                <label>Meeting Time</label>
                <input
                  type="text"
                  name="meetingTime"
                  value={form.meetingTime}
                  onChange={handleChange}
                  placeholder="e.g. Tuesdays 4pm"
                />
              </div>

              <div className="sg-form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Library, Room 2"
                />
              </div>

              <button className="sg-submit-btn" type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create Group"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default StudyGroups;
