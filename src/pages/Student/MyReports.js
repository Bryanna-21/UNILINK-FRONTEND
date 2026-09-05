import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import emergencyService from "../../services/emergencyService";

import "./MyReports.css";

const statusColor = (status) => {
  switch (status) {
    case "OPEN":
      return "status-open";
    case "ACKNOWLEDGED":
    case "RESPONDING":
      return "status-active";
    case "ESCALATED":
      return "status-escalated";
    case "RESOLVED":
      return "status-resolved";
    case "DISMISSED":
      return "status-dismissed";
    default:
      return "";
  }
};

// Read-only: a student can see their own reports and current status,
// but never internalNotes (staff-only, see toStudentView on the
// backend - this endpoint never returns them in the first place, so
// there's nothing to accidentally expose here).
const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await emergencyService.getMyReports();
        setReports(res?.data || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load your reports."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="my-reports-page">

      <div className="my-reports-header">
        <h1>My Reports</h1>
        <p>Emergency reports you've filed and their current status.</p>
      </div>

      {loading && <p>Loading your reports...</p>}

      {!loading && reports.length === 0 && (
        <div className="my-reports-empty">
          <p>You haven't filed any reports.</p>
        </div>
      )}

      {!loading &&
        reports.map((report) => (
          <div key={report._id} className="report-card">
            <div className="report-card-header">
              <span className="report-type">{report.type}</span>
              <span className={`report-status ${statusColor(report.status)}`}>
                {report.status}
              </span>
            </div>

            {report.message && <p className="report-message">{report.message}</p>}
            {report.location && (
              <p className="report-location">📍 {report.location}</p>
            )}

            <p className="report-date">
              Filed {new Date(report.createdAt).toLocaleString()}
            </p>

            {report.resolvedAt && (
              <p className="report-date">
                Resolved {new Date(report.resolvedAt).toLocaleString()}
              </p>
            )}
          </div>
        ))}

    </div>
  );
};

export default MyReports;
