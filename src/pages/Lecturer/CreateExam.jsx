import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import QuestionBuilder from "../../components/exams/QuestionBuilder";

import {
  createExam,
  publishExam,
} from "../../services/examService";

import "../../styles/exams.css";

const CreateExam = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [exam, setExam] = useState({

    title: "",

    description: "",

    course: "",

    unit: "",

    duration: 60,

    instructions: "",

    startTime: "",

    endTime: "",

    allowRetake: false,

    shuffleQuestions: false,

    showResultsImmediately: false,

    questions: [],

    attachments: []

  });

  const updateField = (field, value) => {

    setExam((prev) => ({

      ...prev,

      [field]: value,

    }));

  };
  const validateExam = () => {

  if (!exam.title.trim()) {

    toast.error("Exam title is required");

    return false;

  }

  if (!exam.course.trim()) {

    toast.error("Course is required");

    return false;

  }

  if (!exam.unit.trim()) {

    toast.error("Unit is required");

    return false;

  }

  if (exam.questions.length === 0) {

    toast.error("Add at least one question");

    return false;

  }

  for (const question of exam.questions) {

    if (!question.text.trim()) {

      toast.error("Every question needs text");

      return false;

    }

  }

  return true;

};
  const handleSaveDraft = async () => {

  if (!validateExam()) return;

  try {

    setLoading(true);

    await createExam({

      ...exam,

      status: "Draft",

    });

    toast.success("Draft saved successfully");

    navigate("/lecturer/exams");

  } catch (error) {

    toast.error(

      error.response?.data?.message ||

      "Failed to save exam"

    );

  } finally {

    setLoading(false);

  }

};
  const handlePublish = async () => {

  if (!validateExam()) return;

  try {

    setLoading(true);

    const createdExam = await createExam({

      ...exam,

      status: "Draft",

    });

    await publishExam(createdExam._id);

    toast.success("Exam published");

    navigate("/lecturer/exams");

  } catch (error) {

    toast.error(

      error.response?.data?.message ||

      "Failed to publish exam"

    );

  } finally {

    setLoading(false);

  }

};
