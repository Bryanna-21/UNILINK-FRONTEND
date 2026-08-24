import React from "react";

const ExamResult = ({
  result,
}) => {
  if (!result) return null;

  const percentage =
    result.totalMarks > 0
      ? Math.round(
          (result.score /
            result.totalMarks) *
            100
        )
      : 0;

  const grade =
    percentage >= 70
      ? "A"
      : percentage >= 60
      ? "B"
      : percentage >= 50
      ? "C"
      : percentage >= 40
      ? "D"
      : "E";

  return (
    <div className="exam-result">

      <div className="result-header">

        <h2>{result.examTitle}</h2>

        <span className="grade">
          {grade}
        </span>

      </div>

      <div className="result-grid">

        <div>
          <strong>Score</strong>
          <p>{result.score}</p>
        </div>

        <div>
          <strong>Total Marks</strong>
          <p>{result.totalMarks}</p>
        </div>

        <div>
          <strong>Percentage</strong>
          <p>{percentage}%</p>
        </div>

        <div>
          <strong>Status</strong>
          <p>{result.status}</p>
        </div>

      </div>

      {result.feedback && (
        <div className="feedback">

          <h4>Lecturer Feedback</h4>

          <p>{result.feedback}</p>

        </div>
      )}

    </div>
  );
};

export default ExamResult;
