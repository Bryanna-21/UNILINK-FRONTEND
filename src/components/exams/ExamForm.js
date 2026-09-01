import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import QuestionBuilder from "./QuestionBuilder";

import {
  createExam,
  updateExam,
  publishExam,
} from "../../services/examService";

import "../../styles/exams.css";

const emptyExam = {
  title: "",
  description: "",
  courseId: "",
  unit: "",
  duration: 60,
  startTime: "",
  endTime: "",
  instructions: "",
  allowRetake: false,
  shuffleQuestions: false,
  showResultsImmediately: false,
  questions: [],
};

// Shared by CreateExam and EditExam. mode is "create" or "edit";
// initialExam is only meaningful in edit mode (pre-populates from an
// already-fetched exam). Save Draft and Publish both branch on mode
// to call createExam vs updateExam, but share every other code path
// — validation, field layout, question builder — so a fix here never
// has to be made twice in two near-identical files.
//
// Field is named courseId throughout (not course) to match the
// backend schema exactly — a prior version of this form used `course`
// and silently sent the wrong key, which the backend's required
// courseId validation would have rejected. Kept as a plain text input
// for now; a real course picker (dropdown from GET /api/courses) is
// a separate, better fix outside today's scope.
const ExamForm = ({ mode, examId, initialExam }) => {
  const navigate = useNavigate();

  const [exam, setExam] = useState(initialExam || emptyExam);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialExam) {
      setExam(initialExam);
    }
  }, [initialExam]);

  const updateField = (field, value) => {
    setExam((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = () => {
    if (!exam.title.trim()) {
      toast.error("Exam title is required.");
      return false;
    }
    if (!exam.courseId.trim()) {
      toast.error("Course is required.");
      return false;
    }
    if (!exam.questions.length) {
      toast.error("Add at least one question.");
      return false;
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (!exam.title.trim()) {
      toast.error("Exam title is required.");
      return;
    }

    try {
      setLoading(true);
      if (mode === "edit") {
        await updateExam(examId, exam);
        toast.success("Exam updated.");
      } else {
        await createExam(exam);
        toast.success("Exam saved as draft.");
      }
      navigate("/lecturer/exams");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (mode === "edit" ? "Failed to update exam." : "Failed to save exam.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      if (mode === "edit") {
        await updateExam(examId, exam);
        await publishExam(examId);
      } else {
        const created = await createExam(exam);
        const newId = created?.data?._id || created?._id;
        if (newId) {
          await publishExam(newId);
        }
      }

      toast.success("Exam published.");
      navigate("/lecturer/exams");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to publish exam."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-exam-page">

      <div className="page-header">
        <div>
          <h1>{mode === "edit" ? "Edit Exam" : "Create Exam"}</h1>
          <p>
            {mode === "edit"
              ? "Update this exam's details and questions."
              : "Create and publish exams for your students."}
          </p>
        </div>
      </div>

      <div className="exam-form">

        <div className="form-section">
          <label>Exam Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Introduction to Programming CAT 1"
            value={exam.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        <div className="form-section">
          <label>Description</label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Exam description..."
            value={exam.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Course</label>
            <input
              type="text"
              className="form-control"
              placeholder="Computer Science"
              value={exam.courseId}
              onChange={(e) => updateField("courseId", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Unit</label>
            <input
              type="text"
              className="form-control"
              placeholder="CSC 210"
              value={exam.unit}
              onChange={(e) => updateField("unit", e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Duration (Minutes)</label>
            <input
              type="number"
              className="form-control"
              value={exam.duration}
              onChange={(e) => updateField("duration", Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Start Time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={exam.startTime}
              onChange={(e) => updateField("startTime", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={exam.endTime}
              onChange={(e) => updateField("endTime", e.target.value)}
            />
          </div>
        </div>

        <div className="form-section">
          <label>Instructions</label>
          <textarea
            rows={5}
            className="form-control"
            placeholder="Enter exam instructions..."
            value={exam.instructions}
            onChange={(e) => updateField("instructions", e.target.value)}
          />
        </div>

        <div className="checkbox-grid">
          <label>
            <input
              type="checkbox"
              checked={exam.allowRetake}
              onChange={(e) => updateField("allowRetake", e.target.checked)}
            />
            Allow Retake
          </label>

          <label>
            <input
              type="checkbox"
              checked={exam.shuffleQuestions}
              onChange={(e) => updateField("shuffleQuestions", e.target.checked)}
            />
            Shuffle Questions
          </label>

          <label>
            <input
              type="checkbox"
              checked={exam.showResultsImmediately}
              onChange={(e) => updateField("showResultsImmediately", e.target.checked)}
            />
            Show Results Immediately
          </label>
        </div>

        <QuestionBuilder
          questions={exam.questions}
          setQuestions={(questions) => updateField("questions", questions)}
        />

        <div className="exam-actions">
          <button
            className="btn btn-secondary"
            disabled={loading}
            onClick={handleSaveDraft}
          >
            {mode === "edit" ? "Save Changes" : "Save Draft"}
          </button>

          <button
            className="btn btn-success"
            disabled={loading}
            onClick={handlePublish}
          >
            {loading ? "Publishing..." : "Publish Exam"}
          </button>
        </div>

      </div>

    </div>
  );
};

export default ExamForm;
