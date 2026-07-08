import React from "react";
import { Link } from "react-router-dom";

const SubmissionCard = ({
  submission,
  onGrade,
}) => {
  if (!submission) return null;

  const {
    _id,
    student,
    exam,
    score,
    totalMarks,
    status,
    submittedAt,
  } = submission;

  return (
    <div className="submission-card">

      <div className="submission-header">

        <div>
          <h3>{student?.name || "Unknown Student"}</h3>

          <p>{student?.admissionNumber}</p>
        </div>

        <span className={`status ${status?.toLowerCase()}`}>
          {status}
        </span>

      </div>

      <div className="submission-body">

        <p>
          <strong>Exam:</strong>{" "}
          {exam?.title}
        </p>

        <p>
          <strong>Score:</strong>{" "}
          {score ?? "-"} / {totalMarks}
        </p>

        <p>
          <strong>Submitted:</strong>{" "}
          {submittedAt
            ? new Date(
                submittedAt
              ).toLocaleString()
            : "N/A"}
        </p>

      </div>

      <div className="submission-footer">

        <Link
          className="btn btn-primary"
          to={`/lecturer/submissions/${_id}`}
        >
          View
        </Link>

        <button
          className="btn btn-success"
          onClick={() => onGrade?.(_id)}
        >
          Grade
        </button>

      </div>

    </div>
  );
};

export default SubmissionCard;
