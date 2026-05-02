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

  // 🔹 Load contacts from backend
  const loadContacts = async () => {
    try {
      const res = await API.get("/emergency/contacts");
      setContacts(res.data);
    } catch {
      console.log("Failed to load contacts");
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // 🔹 Send emergency report
  const reportIssue = async () => {
    const message = prompt("Describe the issue:");
    if (!message) return;

    await API.post("/emergency/report", {
      type: "general",
      message,
      location: "unknown"
    });

    alert("Report sent.");
  };

  // 🔹 Request help
  const requestHelp = async () => {
    await API.post("/emergency/help");
    alert("Help request sent.");
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
          {/* CONTACTS FROM BACKEND */}
          <h4>Emergency Contacts</h4>
          {contacts.map((c, i) => (
            <p key={i} style={item}>
              <FaPhone /> {c.name}:{" "}
              <a href={`tel:${c.phone}`}>{c.phone}</a>
            </p>
          ))}

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
