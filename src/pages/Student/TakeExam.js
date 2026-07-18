import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  getExamById,
  submitExam,
} from "../../services/examService";

import "../../styles/exams.css";

const TakeExam = () => {

  const navigate = useNavigate();

  const { examId } = useParams();

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [exam, setExam] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState({});

  const [timeRemaining, setTimeRemaining] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const loadExam = useCallback(async () => {

    try {

      setLoading(true);

      const data = await getExamById(examId);

      setExam(data);

      setTimeRemaining(data.duration * 60);

      const initialAnswers = {};

      data.questions.forEach((question) => {

        initialAnswers[question._id] = "";

      });

      setAnswers(initialAnswers);

    } catch (error) {

      toast.error("Unable to load exam.");

      navigate("/student/exams");

    } finally {

      setLoading(false);

    }

  }, [examId, navigate]);

  useEffect(() => {

    loadExam();

  }, [loadExam]);

  const enterFullscreen = async () => {

    try {

      if (document.documentElement.requestFullscreen) {

        await document.documentElement.requestFullscreen();

      }

      setIsFullscreen(true);

    } catch {

      toast.warning("Fullscreen not supported.");

    }

  };

  const exitFullscreen = async () => {

    if (document.fullscreenElement) {

      await document.exitFullscreen();

    }

    setIsFullscreen(false);

  };

  const handleSubmit = useCallback(async () => {

    if (!exam) return;

    try {

      setSubmitting(true);

      const formattedAnswers = Object.keys(answers).map(

        (questionId) => ({

          questionId,

          answer: answers[questionId],

        })

      );

      await submitExam(

        exam._id,

        formattedAnswers

      );

      localStorage.removeItem(

        `exam_${exam._id}`

      );

      toast.success(

        "Exam submitted successfully."

      );

      exitFullscreen();

      navigate("/student/results");

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Failed to submit exam."

      );

    } finally {

      setSubmitting(false);

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, answers, navigate]);

    useEffect(() => {

    if (!timeRemaining || submitting) return;

    const timer = setInterval(() => {

      setTimeRemaining((previous) => {

        if (previous <= 1) {

          clearInterval(timer);

          handleSubmit();

          return 0;

        }

        return previous - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, [timeRemaining, submitting, handleSubmit]);
    const updateAnswer = (questionId, value) => {

    setAnswers((previous) => ({

      ...previous,

      [questionId]: value,

    }));

  };

  const nextQuestion = () => {

    if (

      currentQuestion <

      exam.questions.length - 1

    ) {

      setCurrentQuestion((previous) => previous + 1);

    }

  };

  const previousQuestion = () => {

    if (currentQuestion > 0) {

      setCurrentQuestion((previous) => previous - 1);

    }

  };
  // ==========================================
  // Auto Save Answers
  // ==========================================

  useEffect(() => {

    if (!exam) return;

    localStorage.setItem(

      `exam_${exam._id}`,

      JSON.stringify(answers)

    );

  }, [answers, exam]);

  useEffect(() => {

    if (!exam) return;

    const savedAnswers = localStorage.getItem(

      `exam_${exam._id}`

    );

    if (savedAnswers) {

      setAnswers(JSON.parse(savedAnswers));

    }

  }, [exam]);

  if (loading) {

    return (

      <div className="loading-page">

        <h2>Loading Exam...</h2>

      </div>

    );

  }

  const question =

    exam.questions[currentQuestion];

  const answeredQuestions =

    Object.values(answers).filter(

      (answer) =>

        answer !== "" && answer !== null

    ).length;

  const progress = Math.round(

    (answeredQuestions /

      exam.questions.length) *

      100

  );

  const minutes = Math.floor(

    timeRemaining / 60

  );

  const seconds =

    timeRemaining % 60;
  const renderSidebar = () => (

<div className="exam-sidebar">

<h3>

Questions

</h3>

<div className="question-list">

{exam.questions.map((q,index)=>(

<button

key={q._id}

className={

currentQuestion===index

? "question-number active"

: answers[q._id]

? "question-number answered"

: "question-number"

}

onClick={()=>setCurrentQuestion(index)}

>

{index+1}

</button>

))}

</div>

<div className="progress-section">

<h4>

Progress

</h4>

<div className="progress-bar">

<div

className="progress-fill"

style={{

width:`${progress}%`

}}

></div>

</div>

<p>

{answeredQuestions}

/

{exam.questions.length}

answered

</p>

</div>

</div>

);
  const renderQuestion = () => {

    switch (question.type) {

      case "mcq":

        return (

          <div className="mcq-options">

            {question.options.map((option, index) => (

              <label
                key={index}
                className="option-card"
              >

                <input
                  type="radio"
                  name={question._id}
                  value={option}
                  checked={
                    answers[question._id] === option
                  }
                  onChange={(e) =>
                    updateAnswer(
                      question._id,
                      e.target.value
                    )
                  }
                />

                <span>{option}</span>

              </label>

            ))}

          </div>

        );

      case "truefalse":

        return (

          <div className="mcq-options">

            {["True", "False"].map((option) => (

              <label
                key={option}
                className="option-card"
              >

                <input
                  type="radio"
                  name={question._id}
                  value={option}
                  checked={
                    answers[question._id] === option
                  }
                  onChange={(e) =>
                    updateAnswer(
                      question._id,
                      e.target.value
                    )
                  }
                />

                <span>{option}</span>

              </label>

            ))}

          </div>

        );

      case "essay":
      // eslint-disable-next-line no-fallthrough
      case "short":

        return (

          <textarea
            rows={8}
            className="form-control"
            placeholder="Write your answer..."
            value={
              answers[question._id] || ""
            }
            onChange={(e) =>
              updateAnswer(
                question._id,
                e.target.value
              )
            }
          />

        );

      default:

        return <p>Unsupported question type.</p>;

    }

  };  
    return (

    <div className="take-exam-page">

      {renderSidebar()}

      <div className="exam-content">

        <div className="exam-header">

          <div>

            <h2>{exam.title}</h2>

            <p>{exam.course}</p>

          </div>

          <div className="timer-box">

            <h3>

              {String(minutes).padStart(2, "0")}:

              {String(seconds).padStart(2, "0")}

            </h3>

            {!isFullscreen && (

              <button
                className="btn btn-secondary"
                onClick={enterFullscreen}
              >

                Fullscreen

              </button>

            )}

          </div>

        </div>

        <div className="question-card">

          <div className="question-title">

            <h3>

              Question {currentQuestion + 1}

            </h3>

            <span>

              {question.marks} Marks

            </span>

          </div>

          <p className="question-text">

            {question.text}

          </p>

          {renderQuestion()}

        </div>

        <div className="navigation-buttons">

          <button
            className="btn btn-secondary"
            disabled={currentQuestion === 0}
            onClick={previousQuestion}
          >

            Previous

          </button>

          {currentQuestion ===
          exam.questions.length - 1 ? (

            <button
              className="btn btn-success"
              disabled={submitting}
              onClick={() =>
                setShowSubmitDialog(true)
              }
            >

              Submit Exam

            </button>

          ) : (

            <button
              className="btn btn-primary"
              onClick={nextQuestion}
            >

              Next

            </button>

          )}

        </div>

      </div>

      {showSubmitDialog && (

        <div className="submit-modal">

          <div className="submit-modal-content">

            <h2>

              Submit Examination?

            </h2>

            <p>

              You have answered{" "}

              {answeredQuestions}

              {" "}of{" "}

              {exam.questions.length}

              {" "}questions.

            </p>

            <div className="modal-actions">

              <button
                className="btn btn-secondary"
                onClick={() =>
                  setShowSubmitDialog(false)
                }
              >

                Continue Exam

              </button>

              <button
                className="btn btn-success"
                disabled={submitting}
                onClick={handleSubmit}
              >

                {submitting
                  ? "Submitting..."
                  : "Confirm Submit"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default TakeExam;
