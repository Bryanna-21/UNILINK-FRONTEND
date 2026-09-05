import { useState, useEffect } from "react";
import emergencyService from "../services/emergencyService";
import {
  FaPhone,
  FaHospital,
  FaHeartbeat,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaUserShield,
} from "react-icons/fa";

export default function EmergencyMenu() {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState([]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // /emergency/contacts is real and has always existed - currently
  // returns a fixed static list (no per-university contact
  // management yet). contacts stays [] on any failure or unexpected
  // response shape so this can never crash the render with
  // "contacts.map is not a function", regardless of what the backend
  // returns.
  const loadContacts = async () => {
    try {
      const res = await emergencyService.getContacts();
      setContacts(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.warn("Failed to load emergency contacts:", err.message);
      setContacts([]);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // type must be one of the three the backend actually accepts
  // (medical/safety/abuse) - see EmergencyReport.VALID_TYPES. A prior
  // version of this sent type: "general", which the backend has never
  // accepted; every report filed through this widget silently 400'd
  // and only ever showed a generic failure alert.
  const reportIssue = async (type) => {
    const message = prompt("Describe what's happening:");
    if (!message) return;

    try {
      await emergencyService.reportEmergency({ type, message, location: "unknown" });
      alert("Report sent. You can track its status under Emergency > My Reports.");
      setOpen(false);
    } catch (err) {
      console.error("Failed to send emergency report:", err.message);
      alert(
        err.response?.data?.message ||
          "Could not send the report right now. Please try again."
      );
    }
  };

  const requestHelp = async () => {
    try {
      await emergencyService.requestHelp();
      alert("Help request sent.");
    } catch (err) {
      console.warn("Failed to request help:", err.message);
      alert("Help requests aren't available yet. Please contact emergency services directly if needed.");
    }
  };

  return (
    <>
      <div onClick={() => setOpen(!open)} style={fab}>
        ⚠️
      </div>

      {open && (
        <div style={menu}>
          <h4>Emergency Contacts</h4>

          {contacts.length === 0 ? (
            <p style={item}>No emergency contacts available yet.</p>
          ) : (
            contacts.map((c, i) => (
              <p key={i} style={item}>
                <FaPhone /> {c.name}:{" "}
                <a href={`tel:${c.phone}`}>{c.phone}</a>
              </p>
            ))
          )}

          <p style={item} onClick={() => window.open("https://www.google.com/maps/search/hospital+near+me")}>
            <FaHospital /> Nearby Hospitals
          </p>
          <p style={item} onClick={requestHelp}>
            <FaHeartbeat /> Request Help
          </p>

          <hr />

          <p style={{ ...item, fontWeight: 600, cursor: "default" }}>
            <FaExclamationTriangle /> Report an Issue
          </p>
          <p style={{ ...item, paddingLeft: "28px" }} onClick={() => reportIssue("medical")}>
            Medical
          </p>
          <p style={{ ...item, paddingLeft: "28px" }} onClick={() => reportIssue("safety")}>
            Safety
          </p>
          <p style={{ ...item, paddingLeft: "28px" }} onClick={() => reportIssue("abuse")}>
            <FaUserShield /> Abuse / Sensitive
          </p>

          <hr />

          <p style={item} onClick={logout}>
            <FaSignOutAlt /> Logout
          </p>
        </div>
      )}
    </>
  );
}

const fab = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  background: "red",
  color: "white",
  padding: "16px",
  borderRadius: "50%",
  cursor: "pointer",
  zIndex: 999,
};

const menu = {
  position: "fixed",
  bottom: "80px",
  right: "20px",
  width: "260px",
  background: "white",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  padding: "10px",
  zIndex: 999,
};

const item = {
  padding: "10px",
  cursor: "pointer",
  display: "flex",
  gap: "10px",
  alignItems: "center",
};
