import { useState, useEffect } from "react";
import API from "../services/api";
import {
  FaPhone,
  FaHospital,
  FaHeartbeat,
  FaSignOutAlt,
  FaExclamationTriangle
} from "react-icons/fa";

export default function EmergencyMenu() {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState([]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Load contacts from backend. NOTE: /api/emergency/contacts does not
  // Emergency actions use the deployed API contract.
  // implemented) - this call will fail every time until that route is
  // built. contacts stays [] on any failure or unexpected response
  // shape so this can never crash the render tree with
  // "contacts.map is not a function" again, regardless of what (if
  // anything) the backend eventually returns here.
  const loadContacts = async () => {
    try {
      const res = await API.get("/emergency/contacts");
      setContacts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn("Failed to load emergency contacts (endpoint may not exist yet):", err.message);
      setContacts([]);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Send emergency report - this endpoint DOES exist on the backend.
  const reportIssue = async () => {
    const message = prompt("Describe the issue:");
    if (!message) return;

    try {
      await API.post("/emergency/report", {
        type: "general",
        message,
        location: "unknown"
      });
      alert("Report sent.");
    } catch (err) {
      console.error("Failed to send emergency report:", err.message);
      alert("Could not send the report right now. Please try again.");
    }
  };

  // Request help through the deployed emergency endpoint
  // on the backend either - this will fail until that route is built.
  const requestHelp = async () => {
    try {
      await API.post("/emergency/help");
      alert("Help request sent.");
    } catch (err) {
      console.warn("Failed to request help (endpoint may not exist yet):", err.message);
      alert("Help requests aren't available yet. Please contact emergency services directly if needed.");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setOpen(!open)}
        style={fab}
      >
        ⚠️
      </div>

      {/* Menu */}
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
          <p style={item} onClick={reportIssue}>
            <FaExclamationTriangle /> Report Issue
          </p>
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
  zIndex: 999
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
  zIndex: 999
};

const item = {
  padding: "10px",
  cursor: "pointer",
  display: "flex",
  gap: "10px",
  alignItems: "center"
};
