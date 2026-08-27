import { useEffect, useState } from "react";
import { FaSearchLocation, FaPlus, FaCheckCircle, FaMapMarkerAlt, FaPhone, FaTimes } from "react-icons/fa";
import lostAndFoundService from "../services/lostAndFoundService";
import { useAuth } from "../context/AuthContext";
import Skeleton from "../components/common/Skeleton";
import Toast from "../components/common/Toast";
import "./LostAndFound.css";

const LostAndFound = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const [form, setForm] = useState({
    itemName: "",
    description: "",
    location: "",
    status: "lost",
    contactInfo: "",
    image: null,
  });

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await lostAndFoundService.getItems(filter || undefined);
      setItems(res?.data ?? []);
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not load lost & found items." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.itemName.trim()) {
      setToast({ show: true, type: "error", message: "Item name is required." });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("itemName", form.itemName);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("status", form.status);
      formData.append("contactInfo", form.contactInfo);
      if (form.image) formData.append("image", form.image);

      await lostAndFoundService.reportItem(formData);

      setToast({ show: true, type: "success", message: "Report submitted." });
      setForm({ itemName: "", description: "", location: "", status: "lost", contactInfo: "", image: null });
      setShowForm(false);
      loadItems();
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not submit report." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (itemId) => {
    try {
      await lostAndFoundService.markResolved(itemId);
      setToast({ show: true, type: "success", message: "Marked as resolved." });
      loadItems();
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not mark as resolved." });
    }
  };

  return (
    <div className="laf-page">
      <div className="laf-header">
        <div>
          <h1>
            <FaSearchLocation /> Lost &amp; Found
          </h1>
          <p>Report a lost or found item, or browse recent reports.</p>
        </div>
        <button className="laf-report-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> Report an Item
        </button>
      </div>

      <div className="laf-filters">
        <button
          className={filter === "" ? "laf-filter active" : "laf-filter"}
          onClick={() => setFilter("")}
        >
          All
        </button>
        <button
          className={filter === "lost" ? "laf-filter active" : "laf-filter"}
          onClick={() => setFilter("lost")}
        >
          Lost
        </button>
        <button
          className={filter === "found" ? "laf-filter active" : "laf-filter"}
          onClick={() => setFilter("found")}
        >
          Found
        </button>
      </div>

      {loading ? (
        <Skeleton variant="card" count={6} />
      ) : items.length === 0 ? (
        <div className="laf-empty">
          <FaSearchLocation size={40} />
          <p>No reports yet.</p>
        </div>
      ) : (
        <div className="laf-grid">
          {items.map((item) => (
            <div className="laf-card" key={item._id}>
              {item.imageUrl && <img src={item.imageUrl} alt={item.itemName} className="laf-card-image" />}
              <div className="laf-card-body">
                <div className="laf-card-header">
                  <h3>{item.itemName}</h3>
                  <span className={`laf-status-tag ${item.status}`}>{item.status}</span>
                </div>
                {item.description && <p className="laf-description">{item.description}</p>}
                {item.location && (
                  <span className="laf-meta">
                    <FaMapMarkerAlt /> {item.location}
                  </span>
                )}
                {item.contactInfo && (
                  <span className="laf-meta">
                    <FaPhone /> {item.contactInfo}
                  </span>
                )}
                {item.reportedBy === user?.id && (
                  <button className="laf-resolve-btn" onClick={() => handleResolve(item._id)}>
                    <FaCheckCircle /> Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="laf-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="laf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="laf-modal-header">
              <h2>Report an Item</h2>
              <button onClick={() => setShowForm(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="laf-form">
              <div className="laf-form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              <div className="laf-form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  name="itemName"
                  value={form.itemName}
                  onChange={handleChange}
                  placeholder="e.g. Black backpack"
                  required
                />
              </div>

              <div className="laf-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Any identifying details..."
                  rows="3"
                />
              </div>

              <div className="laf-form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Where was it lost/found?"
                />
              </div>

              <div className="laf-form-group">
                <label>Contact Info</label>
                <input
                  type="text"
                  name="contactInfo"
                  value={form.contactInfo}
                  onChange={handleChange}
                  placeholder="Phone or email"
                />
              </div>

              <div className="laf-form-group">
                <label>Photo (optional)</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} />
              </div>

              <button className="laf-submit-btn" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Report"}
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

export default LostAndFound;
