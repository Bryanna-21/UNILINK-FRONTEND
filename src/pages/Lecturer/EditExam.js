import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import ExamForm from "../../components/exams/ExamForm";
import { getExamById } from "../../services/examService";

const EditExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialExam, setInitialExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchExam = async () => {
      try {
        setLoading(true);
        const response = await getExamById(id);
        const data = response?.data;

        if (!data) {
          throw new Error("Exam not found");
        }
        if (!["Draft", "Upcoming"].includes(data.status)) {
          toast.error("Published or completed exams cannot be edited.");
          navigate("/lecturer/exams");
          return;
        }

        if (!cancelled) {
          setInitialExam({
            title: data.title || "",
            description: data.description || "",
            courseId: data.courseId || "",
            unit: data.unit || "",
            duration: data.duration || 60,
            startTime: data.startTime
              ? new Date(data.startTime).toISOString().slice(0, 16)
              : "",
            endTime: data.endTime
              ? new Date(data.endTime).toISOString().slice(0, 16)
              : "",
            instructions: data.instructions || "",
            allowRetake: !!data.allowRetake,
            shuffleQuestions: !!data.shuffleQuestions,
            showResultsImmediately: !!data.showResultsImmediately,
            questions: data.questions || [],
          });
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load exam."
        );
        navigate("/lecturer/exams");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchExam();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  if (loading) {
    return <p>Loading exam...</p>;
  }

  if (!initialExam) {
    return null;
  }

  return (
    <ExamForm mode="edit" examId={id} initialExam={initialExam} />
  );
};

export default EditExam;
