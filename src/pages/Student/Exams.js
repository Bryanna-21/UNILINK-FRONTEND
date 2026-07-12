import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import ExamCard from "../../components/exams/ExamCard";

import {
  getStudentExams,
} from "../../services/examService";

import "../../styles/exams.css";

const Exams = () => {

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [exams, setExams] = useState([]);

  const loadExams = async () => {

    try {

      setLoading(true);

      const data = await getStudentExams();

      setExams(data || []);

    } catch (error) {

      toast.error("Unable to load exams.");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadExams();

  }, []);
    const filteredExams = useMemo(() => {

    return exams.filter((exam) => {

      const titleMatch =

        exam.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const courseMatch =

        exam.course
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const searchMatch =

        titleMatch || courseMatch;

      const statusMatch =

        status === "All"

          ? true

          : exam.status === status;

      return searchMatch && statusMatch;

    });

  }, [exams, search, status]);

  const stats = {

    total: exams.length,

    available: exams.filter(

      (exam) => exam.status === "Published"

    ).length,

    completed: exams.filter(

      (exam) => exam.status === "Completed"

    ).length,

    upcoming: exams.filter(

      (exam) => exam.status === "Upcoming"

    ).length,

  };
    return (

    <div className="student-exams-page">

      <div className="page-header">

        <div>

          <h1>My Exams</h1>

          <p>

            View and attempt available examinations.

          </p>

        </div>

        <Link

          to="/student/results"

          className="btn btn-primary"

        >

          My Results

        </Link>

      </div>

      <div className="statistics-grid">

        <div className="stat-card">

          <h2>{stats.total}</h2>

          <span>Total</span>

        </div>

        <div className="stat-card">

          <h2>{stats.available}</h2>

          <span>Available</span>

        </div>

        <div className="stat-card">

          <h2>{stats.upcoming}</h2>

          <span>Upcoming</span>

        </div>

        <div className="stat-card">

          <h2>{stats.completed}</h2>

          <span>Completed</span>

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

          <option value="Published">

            Available

          </option>

          <option value="Upcoming">

            Upcoming

          </option>

          <option value="Completed">

            Completed

          </option>

        </select>

      </div>

      {loading ? (

        <div className="loading-state">

          Loading exams...

        </div>

      ) : filteredExams.length === 0 ? (

        <div className="empty-state">

          <h2>No exams found.</h2>

        </div>

      ) : (

        <div className="exam-grid">

          {filteredExams.map((exam) => (

            <ExamCard

              key={exam._id}

              exam={exam}

              role="student"

            />

          ))}

        </div>

      )}

    </div>

  );

};

export default Exams;
