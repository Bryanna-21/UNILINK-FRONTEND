import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import QuestionBuilder from "../../components/exams/QuestionBuilder";

import {
  createExam,
  publishExam,
} from "../../services/examService";

import { toast } from "react-toastify";

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

    totalMarks: 0,

    startTime: "",

    endTime: "",

    instructions: "",

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
