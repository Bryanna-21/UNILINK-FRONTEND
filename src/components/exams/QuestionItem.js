import React from "react";

const QuestionItem = ({
  index,
  question,
  updateQuestion,
  removeQuestion,
}) => {
  const handleChange = (field, value) => {
    updateQuestion(index, {
      ...question,
      [field]: value,
    });
  };

  return (
    <div className="question-item">

      <div className="question-header">

        <h3>
          Question {index + 1}
        </h3>

        <button
          type="button"
          className="btn btn-danger"
          onClick={() => removeQuestion(index)}
        >
          Remove
        </button>

      </div>

      <textarea
        className="form-control"
        placeholder="Enter question"
        value={question.text}
        onChange={(e) =>
          handleChange("text", e.target.value)
        }
      />

      <div className="question-grid">

        <select
          className="form-control"
          value={question.type}
          onChange={(e) =>
            handleChange("type", e.target.value)
          }
        >
          <option value="mcq">
            Multiple Choice
          </option>

          <option value="truefalse">
            True / False
          </option>

          <option value="short">
            Short Answer
          </option>

          <option value="essay">
            Essay
          </option>
        </select>

        <input
          type="number"
          className="form-control"
          placeholder="Marks"
          value={question.marks}
          onChange={(e) =>
            handleChange("marks", Number(e.target.value))
          }
        />

      </div>

    </div>
  );
};

export default QuestionItem;
