import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaChevronDown,
  FaChevronUp,
  FaHeartbeat,
  FaExclamationTriangle,
  FaUserShield,
  FaCheckCircle,
  FaCommentDots,
  FaArrowUp,
} from "react-icons/fa";

import emergencyService from "../../services/emergencyService";

import "./EmergencyReports.css";

const TYPE_ICON = {
  medical: FaHeartbeat,
  safety: FaExclamationTriangle,
  abuse: FaUserShield,
};

const EmergencyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [actioningId, setActioningId] = useState(null);
  const [noteDrafts, setNoteDrafts] = useState({});

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await emergencyService.getAuthorizedReports();
      setReports(res?.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const toggleExpanded = (reportId) => {
    setExpandedId((prev) => (prev === reportId ? null : reportId));
  };

  const handleAcknowledge = async (reportId) => {
    setActioningId(reportId);
    try {
      await emergencyService.acknowledgeReport(reportId);
      toast.success("Acknowledged.");
      loadReports();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not acknowledge.");
    } finally {
      setActioningId(null);
    }
  };

  const handleRespond = async (reportId) => {
    const note = noteDrafts[reportId]?.trim();
    if (!note) return;

    setActioningId(reportId);
    try {
      await emergencyService.respondToReport(reportId, note);
      toast.success("Response added.");
      setNoteDrafts((prev) => ({ ...prev, [reportId]: "" }));
      loadReports();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not respond.");
    } finally {
      setActioningId(null);
    }
  };

  const handleEscalate = async (reportId) => {
    if (!window.confirm("Escalate this report to admin? This hands it off for admin-level handling.")) {
      return;
    }
    setActioningId(reportId);
    try {
      await emergencyService.escalateReport(reportId);
      toast.success("Escalated to admin.");
      loadReports();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not escalate.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="emergency-reports-page">

      <div className="emergency-reports-header">
        <h1>Emergency Reports</h1>
        <p>Reports you're authorized to see, scoped to your courses and university.</p>
      </div>

      {loading && <p>Loading reports...</p>}

      {!loading && reports.length === 0 && (
        <div className="emergency-reports-empty">
          <p>No reports right now.</p>
        </div>
      )}

      {!loading &&
        reports.map((report) => {
          const isExpanded = expandedId === report._id;
          const isActioning = actioningId === report._id;
          const canAct = !["ESCALATED", "RESOLVED", "DISMISSED"].includes(report.status);
          const TypeIcon = TYPE_ICON[report.type] || FaExclamationTriangle;

          return (
            <div key={report._id} className={`er-card ${isExpanded ? "expanded" : ""}`}>

              <button
                className="er-row"
                onClick={() => toggleExpanded(report._id)}
              >
                <TypeIcon className="er-icon" />
                <span className="er-type">{report.type}</span>
                <span className="er-status">{report.status}</span>
                <span className="er-date">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
                {isExpanded ? (
                  <FaChevronUp className="er-chevron" />
                ) : (
                  <FaChevronDown className="er-chevron" />
                )}
              </button>

              {isExpanded && (
                <div className="er-details">
                  {report.message && <p className="er-message">{report.message}</p>}
                  {report.location && (
                    <p className="er-meta">📍 {report.location}</p>
                  )}
                  <p className="er-meta">
                    🕒 Filed {new Date(report.createdAt).toLocaleString()}
                  </p>

                  {canAct && (
                    <div className="er-actions">
                      {report.status === "OPEN" && (
                        <button
                          className="er-action-btn"
                          disabled={isActioning}
                          onClick={() => handleAcknowledge(report._id)}
                        >
                          <FaCheckCircle /> Acknowledge
                        </button>
                      )}

                      <div className="er-respond-row">
                        <input
                          type="text"
                          placeholder="Add a response note..."
                          value={noteDrafts[report._id] || ""}
                          onChange={(e) =>
                            setNoteDrafts((prev) => ({ ...prev, [report._id]: e.target.value }))
                          }
                          disabled={isActioning}
                        />
                        <button
                          className="er-action-btn"
                          disabled={isActioning || !noteDrafts[report._id]?.trim()}
                          onClick={() => handleRespond(report._id)}
                        >
                          <FaCommentDots /> Respond
                        </button>
                      </div>

                      <button
                        className="er-action-btn danger"
                        disabled={isActioning}
                        onClick={() => handleEscalate(report._id)}
                      >
                        <FaArrowUp /> Escalate to Admin
                      </button>
                    </div>
                  )}

                  {!canAct && (
                    <p className="er-final-status">
                      This report is {report.status.toLowerCase()} — no further action available.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

    </div>
  );
};

export default EmergencyReports;
