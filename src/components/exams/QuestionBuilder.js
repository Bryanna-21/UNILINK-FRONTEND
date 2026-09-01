import React from "react";

import QuestionItem from "./QuestionItem";
import QuestionOptions from "./QuestionOptions";
import QuestionPreview from "./QuestionPreview";

const QuestionBuilder = ({
  questions,
  setQuestions,
}) => {

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "mcq",
        marks: 1,
        options: [
          "",
          "",
          "",
          "",
        ],
        correctAnswer: "",
      },
    ]);
  };

  const updateQuestion = (
    index,
    updatedQuestion
  ) => {
    const updatedQuestions = [...questions];

    updatedQuestions[index] =
      updatedQuestion;

    setQuestions(updatedQuestions);
  };

  const removeQuestion = (
    index
  ) => {
    setQuestions(
      questions.filter(
        (_, i) => i !== index
      )
    );
  };

  return (
    <div className="question-builder">

      <div className="builder-header">

        <h2>
          Exam Question Builder
        </h2>

        <button
          type="button"
          className="btn btn-primary"
          onClick={addQuestion}
        >
          Add Question
        </button>

      </div>

      {questions.map(
        (question, index) => (
          <div
            key={index}
            className="question-wrapper"
          >
            <QuestionItem
              index={index}
              question={question}
              updateQuestion={
                updateQuestion
              }
              removeQuestion={
                removeQuestion
              }
            />

            <QuestionOptions
              question={question}
              index={index}
              updateQuestion={
                updateQuestion
              }
            />
          </div>
        )
      )}

      <QuestionPreview
        questions={questions}
      />

    </div>
  );
};

export default QuestionBuilder;
