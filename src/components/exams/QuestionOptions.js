import React from "react";

const QuestionOptions = ({
  question,
  index,
  updateQuestion,
}) => {
  if (question.type !== "mcq" && question.type !== "truefalse") {
    return null;
  }

  // True/False options ("True"/"False") are fixed by QuestionItem's
  // type-change handler and never user-editable text, unlike mcq
  // options — so no text input is rendered for them here, only the
  // radio to select which one is correct.
  const optionsEditable = question.type === "mcq";

  const updateOption = (optionIndex, value) => {
    const updatedOptions = [...question.options];
    const wasCorrect = question.correctAnswer === updatedOptions[optionIndex];
    updatedOptions[optionIndex] = value;

    updateQuestion(index, {
      ...question,
      options: updatedOptions,
      // If the option that was marked correct gets its text edited,
      // correctAnswer must follow — otherwise it silently points at
      // now-stale text that no longer matches any option.
      correctAnswer: wasCorrect ? value : question.correctAnswer,
    });
  };

  const setCorrectAnswer = (value) => {
    updateQuestion(index, {
      ...question,
      correctAnswer: value,
    });
  };

  return (
    <div className="question-options">
      <h4>{optionsEditable ? "Options" : "Correct Answer"}</h4>

      {question.options.map((option, optionIndex) => (
        <div key={optionIndex} className="option-row">
          <input
            type="radio"
            name={`correct-${index}`}
            checked={question.correctAnswer === option && option !== ""}
            disabled={optionsEditable && !option.trim()}
            onChange={() => setCorrectAnswer(option)}
          />

          {optionsEditable ? (
            <input
              className="form-control"
              value={option}
              placeholder={`Option ${optionIndex + 1}`}
              onChange={(e) => updateOption(optionIndex, e.target.value)}
            />
          ) : (
            <span>{option}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionOptions;
