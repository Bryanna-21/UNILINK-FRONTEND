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

  // Changing question type must also reset options/correctAnswer to
  // match the new type's shape, or a question can end up in an
  // inconsistent state — e.g. switching from mcq to truefalse while
  // keeping four empty option blanks and a stale correctAnswer that
  // no longer matches anything. Each type gets its own fresh, correct
  // default shape here rather than inheriting whatever the previous
  // type left behind.
  const handleTypeChange = (newType) => {
    let options = [];
    if (newType === "mcq") {
      options = ["", "", "", ""];
    } else if (newType === "truefalse") {
      options = ["True", "False"];
    }
    // essay/short: no options, no correctAnswer — always manually graded.

    updateQuestion(index, {
      ...question,
      type: newType,
      options,
      correctAnswer: "",
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
            handleTypeChange(e.target.value)
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
