import React from "react";

const QuestionOptions = ({
  question,
  index,
  updateQuestion,
}) => {
  if (
    question.type !== "mcq" &&
    question.type !== "truefalse"
  ) {
    return null;
  }

  const updateOption = (
    optionIndex,
    value
  ) => {
    const updatedOptions = [...question.options];

    updatedOptions[optionIndex] = value;

    updateQuestion(index, {
      ...question,
      options: updatedOptions,
    });
  };

  return (
    <div className="question-options">

      <h4>Options</h4>

      {question.options.map(
        (option, optionIndex) => (
          <input
            key={optionIndex}
            className="form-control"
            value={option}
            placeholder={`Option ${
              optionIndex + 1
            }`}
            onChange={(e) =>
              updateOption(
                optionIndex,
                e.target.value
              )
            }
          />
        )
      )}

    </div>
  );
};

export default QuestionOptions;
