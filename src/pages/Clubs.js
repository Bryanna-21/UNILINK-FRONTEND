import { useEffect, useState } from "react";
import { FaUsers, FaPlus, FaTimes, FaCrown } from "react-icons/fa";
import clubsService from "../services/clubsService";
import { useAuth } from "../context/AuthContext";
import Skeleton from "../components/common/Skeleton";
import Toast from "../components/common/Toast";
import "./Clubs.css";

const Clubs = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    setLoading(true);
    try {
      const res = await clubsService.getClubs();
      setClubs(res?.data ?? []);
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not load clubs." });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMembership = async (club) => {
    const isMember = club.memberIds?.includes(user?.id);
    setPendingId(club._id);
    try {
      const res = await clubsService.toggleMembership(club._id, isMember);
      setClubs((prev) => prev.map((c) => (c._id === club._id ? res.data : c)));
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not update membership." });
    } finally {
      setPendingId(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setToast({ show: true, type: "error", message: "Club name is required." });
      return;
    }

    setCreating(true);
    try {
      const res = await clubsService.createClub(name.trim(), description.trim() || undefined);
      setClubs((prev) => [res.data, ...prev]);
      setName("");
      setDescription("");
      setShowForm(false);
      setToast({ show: true, type: "success", message: "Club created." });
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not create club." });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="clubs-page">
      <div className="clubs-header">
        <div>
          <h1>
            <FaUsers /> Clubs
          </h1>
          <p>Join a campus club, or start your own.</p>
        </div>
        <button className="clubs-create-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> New Club
        </button>
      </div>

      {loading ? (
        <Skeleton variant="card" count={6} />
      ) : clubs.length === 0 ? (
        <div className="clubs-empty">
          <FaUsers size={40} />
          <p>No clubs yet. Start one.</p>
        </div>
      ) : (
        <div className="clubs-grid">
          {clubs.map((club) => {
            const isMember = !!user && club.memberIds?.includes(user.id);
            const isOwner = club.ownerId === user?.id;

            return (
              <div className="club-card" key={club._id}>
                <h3>{club.name}</h3>
                {club.description && <p className="club-description">{club.description}</p>}
                <span className="club-member-count">
                  {club.memberIds?.length ?? 0} member{club.memberIds?.length === 1 ? "" : "s"}
                </span>

                {isOwner ? (
                  <span className="club-owner-tag">
                    <FaCrown size={11} /> You own this club
                  </span>
                ) : (
                  <button
                    className={isMember ? "club-leave-btn" : "club-join-btn"}
                    disabled={pendingId === club._id}
                    onClick={() => handleToggleMembership(club)}
                  >
                    {pendingId === club._id ? "..." : isMember ? "Leave" : "Join"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="clubs-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="clubs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="clubs-modal-header">
              <h2>New Club</h2>
              <button onClick={() => setShowForm(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreate} className="clubs-form">
              <div className="clubs-form-group">
                <label>Club Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chess Club"
                  required
                />
              </div>

              <div className="clubs-form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this club about?"
                  rows="3"
                />
              </div>

              <button className="clubs-submit-btn" type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create Club"}
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

export default Clubs;
