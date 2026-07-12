import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  getExamSubmission,
  gradeSubmission,
} from "../../services/examService";

import "../../styles/exams.css";

const ViewSubmission = () => {

  const navigate = useNavigate();

  const { submissionId } = useParams();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [submission, setSubmission] = useState(null);

  const [marks, setMarks] = useState({});

  const [feedback, setFeedback] = useState("");

  const loadSubmission = async () => {

    try {

      setLoading(true);

      const data = await getExamSubmission(submissionId);

      setSubmission(data);

      setFeedback(data.feedback || "");

      const markObject = {};

      data.answers.forEach((answer) => {

        markObject[answer.questionId] = answer.marks || 0;

      });

      setMarks(markObject);

    } catch (error) {

      toast.error("Unable to load submission.");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadSubmission();

  }, [submissionId]);
  const updateMark = (questionId, value) => {

  setMarks((prev) => ({

    ...prev,

    [questionId]: Number(value),

  }));

};

const totalMarks = () => {

  return Object.values(marks).reduce(

    (total, current) => total + Number(current),

    0

  );

};

const handleSave = async () => {

  try {

    setSaving(true);

    await gradeSubmission(

      submissionId,

      {

        marks,

        feedback,

        total: totalMarks(),

      }

    );

    toast.success("Grades saved successfully.");

    navigate("/lecturer/submissions");

  } catch (error) {

    toast.error("Unable to save grades.");

  } finally {

    setSaving(false);

  }

};
  if (loading) {
    return (
      <div className="loading-page">
        <h2>Loading submission...</h2>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="empty-page">
        <h2>Submission not found.</h2>
      </div>
    );
  }

  return (
    <div className="view-submission-page">

      <div className="page-header">

        <div>

          <h1>Submission Review</h1>

          <p>
            Review student answers and assign marks.
          </p>

        </div>

      </div>

      <div className="student-card">

        <div className="student-info">

          <h2>{submission.student?.name}</h2>

          <p>
            Admission No:
            {" "}
            {submission.student?.admissionNumber}
          </p>

          <p>
            Email:
            {" "}
            {submission.student?.email}
          </p>

          <p>
            Course:
            {" "}
            {submission.student?.course}
          </p>

        </div>

        <div className="exam-info">

          <h3>{submission.exam?.title}</h3>

          <p>
            Duration:
            {" "}
            {submission.exam?.duration}
            {" "}Minutes
          </p>

          <p>
            Submitted:
            {" "}
            {new Date(
              submission.submittedAt
            ).toLocaleString()}
          </p>

        </div>

      </div>

      <div className="answers-section">

        {submission.answers.map((answer, index) => (

          <div
            className="answer-card"
            key={answer.questionId}
          >

            <div className="question-header">

              <h3>
                Question {index + 1}
              </h3>

              <span>
                Max Marks:
                {" "}
                {answer.maxMarks}
              </span>

            </div>

            <div className="question-text">

              {answer.question}

            </div>

            <div className="student-answer">

              <strong>
                Student Answer
              </strong>

              <p>
                {answer.response || "No Answer"}
              </p>

            </div>

            <div className="grading-section">

              <label>
                Award Marks
              </label>

              <input
                type="number"
                min={0}
                max={answer.maxMarks}
                className="form-control"
                value={
                  marks[answer.questionId] || 0
                }
                onChange={(e) =>
                  updateMark(
                    answer.questionId,
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        ))}

      </div>

      <div className="feedback-section">

        <h3>Lecturer Feedback</h3>

        <textarea
          rows={6}
          className="form-control"
          placeholder="Write feedback..."
          value={feedback}
          onChange={(e) =>
            setFeedback(e.target.value)
          }
        />

      </div>

      <div className="summary-card">

        <h2>
          Final Score
        </h2>

        <h1>
          {totalMarks()}
        </h1>

      </div>

      <div className="page-actions">

        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        <button
          className="btn btn-success"
          disabled={saving}
          onClick={handleSave}
        >
          {saving
            ? "Saving..."
            : "Save Grade"}
        </button>

      </div>

    </div>
  );

};

export default ViewSubmission;

