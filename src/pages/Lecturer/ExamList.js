import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import ExamCard from "../../components/exams/ExamCard";

import {
  getLecturerExams,
  deleteExam,
  publishExam,
  closeExam,
  duplicateExam,
} from "../../services/examService";

import "../../styles/exams.css";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await getLecturerExams();
      setExams(data?.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load exams."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchesSearch =
        !search ||
        exam.title?.toLowerCase().includes(search.toLowerCase()) ||
        exam.courseId?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All" ||
        (exam.status || "Draft").toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [exams, search, status]);

  const statistics = useMemo(() => {
    return {
      total: exams.length,
      drafts: exams.filter(
        (e) => (e.status || "Draft").toLowerCase() === "draft"
      ).length,
      published: exams.filter(
        (e) => (e.status || "").toLowerCase() === "published"
      ).length,
      closed: exams.filter(
        (e) => (e.status || "").toLowerCase() === "closed"
      ).length,
    };
  }, [exams]);

  const handleDelete = async (examId) => {
    if (!window.confirm("Delete this exam? This cannot be undone.")) return;

    try {
      await deleteExam(examId);
      toast.success("Exam deleted.");
      fetchExams();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete exam."
      );
    }
  };

  const handlePublish = async (examId) => {
    try {
      await publishExam(examId);
      toast.success("Exam published.");
      fetchExams();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to publish exam."
      );
    }
  };

  const handleClose = async (examId) => {
    try {
      await closeExam(examId);
      toast.success("Exam closed.");
      fetchExams();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to close exam."
      );
    }
  };

  const handleDuplicate = async (examId) => {
    try {
      await duplicateExam(examId);
      toast.success("Exam duplicated.");
      fetchExams();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to duplicate exam."
      );
    }
  };

  return (
    <div className="exam-list-page">

      <div className="page-header">

        <div>
          <h1>My Exams</h1>
          <p>Manage all your examinations.</p>
        </div>

      </div>

      <div className="exam-statistics">

        <div className="stat-card">
          <h2>{statistics.total}</h2>
          <span>Total Exams</span>
        </div>

        <div className="stat-card">
          <h2>{statistics.drafts}</h2>
          <span>Drafts</span>
        </div>

        <div className="stat-card">
          <h2>{statistics.published}</h2>
          <span>Published</span>
        </div>

        <div className="stat-card">
          <h2>{statistics.closed}</h2>
          <span>Closed</span>
        </div>

      </div>

      <div className="exam-toolbar">

        <input
          type="text"
          className="form-control"
          placeholder="Search exams..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          className="form-control"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="All">All</option>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Closed">Closed</option>
        </select>

      </div>

      {loading ? (

        <div className="loading-state">
          Loading exams...
        </div>

      ) : filteredExams.length === 0 ? (

        <div className="empty-state">

          <h3>No Exams Found</h3>

          <p>
            Create your first exam to get started.
          </p>

        </div>

      ) : (

        <div className="exam-grid">

          {filteredExams.map((exam) => (

            <ExamCard
              key={exam._id}
              exam={exam}
              role="lecturer"
              onDelete={handleDelete}
              onPublish={handlePublish}
              onClose={handleClose}
              onDuplicate={handleDuplicate}
            />

          ))}

        </div>

      )}

    </div>
  );

};

export default ExamList;
