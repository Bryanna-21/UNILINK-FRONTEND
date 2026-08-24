import React from "react";

const QuestionPreview = ({ questions }) => {
  return (
    <div className="question-preview">

      <h2>Exam Preview</h2>

      {questions.map((question, index) => (
        <div
          key={index}
          className="preview-question"
        >
          <h4>
            {index + 1}. {question.text}
          </h4>

          {question.type === "mcq" && (
            <ul>
              {question.options.map(
                (option, optionIndex) => (
                  <li key={optionIndex}>
                    {option}
                  </li>
                )
              )}
            </ul>
          )}

          <small>
            {question.marks} Marks
          </small>

        </div>
      ))}

    </div>
  );
};

export default QuestionPreview;
