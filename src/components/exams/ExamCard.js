// ======================================================
// UniLink Exam Card Component
// ======================================================

import React from "react";
import { Link } from "react-router-dom";
// Styles for .exam-card live in ../../styles/exams.css, already loaded
// globally by the pages that render this component.

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const statusClass = (status) => {
  switch ((status || "").toLowerCase()) {
    case "published":
      return "published";

    case "draft":
      return "draft";

    case "closed":
      return "closed";

    case "completed":
      return "completed";

    default:
      return "pending";
  }
};

const ExamCard = ({
  exam,
  role = "student",

  onDelete,

  onPublish,

  onClose,

  onDuplicate,
}) => {
  if (!exam) return null;

  return (
    <div className="exam-card">

      <div className="exam-card-header">

        <div>

          <h2>{exam.title}</h2>

          <p>{exam.course}</p>

        </div>

        <span className={`exam-status ${statusClass(exam.status)}`}>
          {exam.status || "Draft"}
        </span>

      </div>

      <div className="exam-card-body">

        <p>{exam.description}</p>

        <div className="exam-meta">

          <div>
            <strong>Duration</strong>
            <span>{exam.duration} mins</span>
          </div>

          <div>
            <strong>Total Marks</strong>
            <span>{exam.totalMarks}</span>
          </div>

          <div>
            <strong>Questions</strong>
            <span>{exam.questions?.length || 0}</span>
          </div>

          <div>
            <strong>Starts</strong>
            <span>{formatDate(exam.startTime)}</span>
          </div>

          <div>
            <strong>Ends</strong>
            <span>{formatDate(exam.endTime)}</span>
          </div>

        </div>

      </div>

      <div className="exam-card-footer">

        {role === "student" && (
          <>
            <Link
              to={`/student/exams/${exam._id}`}
              className="btn btn-primary"
            >
              Open
            </Link>

            {exam.status === "Published" && (
              <Link
                to={`/student/exams/${exam._id}/take`}
                className="btn btn-success"
              >
                Take Exam
              </Link>
            )}
          </>
        )}

        {role === "lecturer" && (
          <>
            <Link
              to={`/lecturer/exams/${exam._id}`}
              className="btn btn-primary"
            >
              View
            </Link>

            <Link
              to={`/lecturer/exams/edit/${exam._id}`}
              className="btn btn-secondary"
            >
              Edit
            </Link>

            {exam.status === "Draft" && (
              <button
                className="btn btn-success"
                onClick={() => onPublish?.(exam._id)}
              >
                Publish
              </button>
            )}

            {exam.status === "Published" && (
              <button
                className="btn btn-warning"
                onClick={() => onClose?.(exam._id)}
              >
                Close
              </button>
            )}

            <button
              className="btn btn-info"
              onClick={() => onDuplicate?.(exam._id)}
            >
              Duplicate
            </button>

            <button
              className="btn btn-danger"
              onClick={() => onDelete?.(exam._id)}
            >
              Delete
            </button>
          </>
        )}

      </div>

    </div>
  );
};

export default ExamCard;
