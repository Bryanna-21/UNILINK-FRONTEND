import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getExamSubmission,
  gradeSubmission,
} from "../../services/examService";

import "../../styles/exams.css";

const ViewSubmission = () => {

  const navigate = useNavigate();

  const { submissionId } = useParams();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [submission, setSubmission] = useState(null);

  const [marks, setMarks] = useState({});

  const [feedback, setFeedback] = useState("");

  const loadSubmission = async () => {

    try {

      setLoading(true);

      const data = await getExamSubmission(submissionId);

      setSubmission(data);

      setFeedback(data.feedback || "");

      const markObject = {};

      data.answers.forEach((answer) => {

        markObject[answer.questionId] = answer.marks || 0;

      });

      setMarks(markObject);

    } catch (error) {

      toast.error("Unable to load submission.");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadSubmission();

  }, [submissionId]);
  const updateMark = (questionId, value) => {

  setMarks((prev) => ({

    ...prev,

    [questionId]: Number(value),

  }));

};

const totalMarks = () => {

  return Object.values(marks).reduce(

    (total, current) => total + Number(current),

    0

  );

};

const handleSave = async () => {

  try {

    setSaving(true);

    await gradeSubmission(

      submissionId,

      {

        marks,

        feedback,

        total: totalMarks(),

      }

    );

    toast.success("Grades saved successfully.");

    navigate("/lecturer/submissions");

  } catch (error) {

    toast.error("Unable to save grades.");

  } finally {

    setSaving(false);

  }

};
  
