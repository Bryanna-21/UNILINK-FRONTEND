import React from "react";
import "./AssignmentCard.css";

import {
  FaClipboardList,
  FaCalendarAlt,
  FaUser,
  FaCheckCircle,
  FaExclamationCircle,
  FaUpload,
} from "react-icons/fa";

// Shows only what is known. The lecturer line appears only when a
// name is supplied; the old card printed "Unknown Lecturer" and a
// fixed "Submission deadline applies" line for every assignment.
const AssignmentCard = ({
  title,
  description,
  unit,
  lecturer,
  deadline,
  submitted = false,
  submissionStatus = "Submitted",
  overdue = false,
  marks,
  totalMarks,
  onSubmit,
  onView,
}) => {
  const getStatusClass = () => {
    if (submitted && submissionStatus === "Graded") return "graded";
    if (submitted) return "submitted";
    return "pending";
  };

  return (
    <div className="assignment-card">
      <div className="assignment-header">
        <div className="assignment-icon">
          <FaClipboardList />
        </div>

        <div className="assignment-title">
          <h3>{title || "Untitled Assignment"}</h3>
          {unit && <span>{unit}</span>}
        </div>
      </div>

      {description && (
        <div className="assignment-description">
          <p>{description}</p>
        </div>
      )}

      <div className="assignment-details">
        {lecturer && (
          <div className="detail-item">
            <FaUser />
            <span>{lecturer}</span>
          </div>
        )}

        <div className="detail-item">
          <FaCalendarAlt />
          <span>Due: {deadline || "No deadline"}</span>
        </div>
      </div>

      <div className={`assignment-status ${getStatusClass()}`}>
        {submitted ? (
          <>
            <FaCheckCircle />
            <span>{submissionStatus}</span>
          </>
        ) : (
          <>
            <FaExclamationCircle />
            <span>{overdue ? "Not submitted - past due" : "Not submitted"}</span>
          </>
        )}
      </div>

      {marks !== undefined && marks !== null && (
        <div className="assignment-marks">
          Marks:{" "}
          <strong>
            {marks}/{totalMarks}
          </strong>
        </div>
      )}

      <div className="assignment-actions">
        <button
          type="button"
          className="view-assignment-btn"
          onClick={() => onView && onView()}
        >
          View Details
        </button>

        {!submitted && (
          <button
            type="button"
            className="submit-assignment-btn"
            onClick={() => onSubmit && onSubmit()}
          >
            <FaUpload />
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;
