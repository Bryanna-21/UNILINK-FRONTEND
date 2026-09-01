import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getExamById } from "../../services/examService";

import "../../styles/exams.css";

const statusBadgeClass = (status) => {
  switch (status) {
    case "Draft":
      return "badge badge-secondary";
    case "Published":
      return "badge badge-success";
    case "Completed":
      return "badge badge-warning";
    case "Archived":
      return "badge badge-muted";
    default:
      return "badge";
  }
};

const ViewExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchExam = async () => {
      try {
        setLoading(true);
        const response = await getExamById(id);
        if (!cancelled) {
          setExam(response?.data || null);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load exam."
        );
        navigate("/lecturer/exams");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchExam();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="view-exam-page">
        <p>Loading exam...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="view-exam-page">
        <p>Exam not found.</p>
        <Link to="/lecturer/exams">Back to exams</Link>
      </div>
    );
  }

  return (
    <div className="view-exam-page">

      <div className="page-header">
        <div>
          <h1>{exam.title}</h1>
          <span className={statusBadgeClass(exam.status)}>
            {exam.status}
          </span>
        </div>

        <div className="page-header-actions">
          {["Draft", "Upcoming"].includes(exam.status) && (
            <Link
              to={`/lecturer/exams/edit/${exam._id}`}
              className="btn btn-secondary"
            >
              Edit
            </Link>
          )}
          <Link to="/lecturer/exams" className="btn btn-outline">
            Back to Exams
          </Link>
        </div>
      </div>

      {exam.description && (
        <div className="exam-detail-section">
          <h3>Description</h3>
          <p>{exam.description}</p>
        </div>
      )}

      <div className="exam-detail-grid">
        <div>
          <strong>Course</strong>
          <p>{exam.courseId}</p>
        </div>
        <div>
          <strong>Unit</strong>
          <p>{exam.unit || "—"}</p>
        </div>
        <div>
          <strong>Duration</strong>
          <p>{exam.duration} minutes</p>
        </div>
        <div>
          <strong>Pass Mark</strong>
          <p>{exam.passMark}%</p>
        </div>
        <div>
          <strong>Start Time</strong>
          <p>{exam.startTime ? new Date(exam.startTime).toLocaleString() : "Not set"}</p>
        </div>
        <div>
          <strong>End Time</strong>
          <p>{exam.endTime ? new Date(exam.endTime).toLocaleString() : "Not set"}</p>
        </div>
      </div>

      {exam.instructions && (
        <div className="exam-detail-section">
          <h3>Instructions</h3>
          <p>{exam.instructions}</p>
        </div>
      )}

      <div className="exam-detail-section">
        <h3>Settings</h3>
        <ul className="settings-list">
          <li>Allow Retake: {exam.allowRetake ? "Yes" : "No"}</li>
          <li>Shuffle Questions: {exam.shuffleQuestions ? "Yes" : "No"}</li>
          <li>Show Results Immediately: {exam.showResultsImmediately ? "Yes" : "No"}</li>
        </ul>
      </div>

      <div className="exam-detail-section">
        <h3>Questions ({exam.questions.length})</h3>

        {exam.questions.length === 0 && (
          <p>No questions added yet.</p>
        )}

        {exam.questions.map((q, i) => (
          <div key={q._id || i} className="question-preview-card">
            <div className="question-preview-header">
              <strong>Q{i + 1}.</strong> {q.text}
              <span className="question-marks">({q.marks} mark{q.marks === 1 ? "" : "s"})</span>
            </div>

            <div className="question-preview-type">{q.type}</div>

            {(q.type === "mcq" || q.type === "truefalse") && (
              <ul className="question-preview-options">
                {q.options.map((opt, oi) => (
                  <li
                    key={oi}
                    className={opt === q.correctAnswer ? "correct-option" : ""}
                  >
                    {opt} {opt === q.correctAnswer && "✓"}
                  </li>
                ))}
              </ul>
            )}

            {(q.type === "essay" || q.type === "short") && (
              <p className="question-preview-manual">
                Manually graded — no auto-checked answer.
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default ViewExam;
