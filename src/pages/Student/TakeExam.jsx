import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

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

  }, [timeRemaining, submitting]);
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
