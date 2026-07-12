import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaClipboardList,
  FaFileAlt,
  FaBell,
  FaCalendarAlt,
  FaGraduationCap,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import SearchBar from "../../components/common/SearchBar";
import Skeleton from "../../components/common/Skeleton";

import "./Dashboard.css";

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [stats] = useState({
    courses: 6,
    assignments: 4,
    notes: 28,
    notifications: 12,
  });

  const [announcements] = useState([
    {
      id: 1,
      title: "Semester Registration Open",
      date: "Today",
    },
    {
      id: 2,
      title: "CAT Timetable Released",
      date: "Yesterday",
    },
  ]);

  const [assignments] = useState([
    {
      id: 1,
      course: "Object Oriented Programming",
      due: "Tomorrow",
    },
    {
      id: 2,
      course: "Database Systems",
      due: "Friday",
    },
  ]);

  const [exams] = useState([
    {
      id: 1,
      unit: "Networking",
      date: "15 July",
    },
    {
      id: 2,
      unit: "Operating Systems",
      date: "22 July",
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="student-dashboard">
        <Skeleton variant="card" count={4} />
      </div>
    );
  }

  return (
    <div className="student-dashboard">

      <div className="dashboard-header">

        <div>
          <h1>Student Dashboard</h1>

          <p>
            Welcome back. Here's a summary of your academic activities.
          </p>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search dashboard..."
        />

      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <FaBook className="stat-icon" />
          <h2>{stats.courses}</h2>
          <span>Courses</span>
        </div>

        <div className="stat-card">
          <FaClipboardList className="stat-icon" />
          <h2>{stats.assignments}</h2>
          <span>Assignments</span>
        </div>

        <div className="stat-card">
          <FaFileAlt className="stat-icon" />
          <h2>{stats.notes}</h2>
          <span>Notes</span>
        </div>

        <div className="stat-card">
          <FaBell className="stat-icon" />
          <h2>{stats.notifications}</h2>
          <span>Notifications</span>
        </div>

      </div>

      <div className="dashboard-grid">

        <section className="dashboard-card">

          <div className="section-title">
            <h3>Recent Announcements</h3>
          </div>

          {announcements.map((item) => (
            <div
              key={item.id}
              className="dashboard-item"
            >
              <div>
                <strong>{item.title}</strong>
                <small>{item.date}</small>
              </div>
            </div>
          ))}

        </section>

        <section className="dashboard-card">

          <div className="section-title">
            <h3>Upcoming Assignments</h3>
          </div>

          {assignments.map((item) => (
            <div
              key={item.id}
              className="dashboard-item"
            >
              <div>
                <strong>{item.course}</strong>
                <small>Due: {item.due}</small>
              </div>
            </div>
          ))}

        </section>

        <section className="dashboard-card">

          <div className="section-title">
            <h3>Upcoming Exams</h3>
          </div>

          {exams.map((item) => (
            <div
              key={item.id}
              className="dashboard-item"
            >
              <div>
                <strong>{item.unit}</strong>
                <small>{item.date}</small>
              </div>
            </div>
          ))}

        </section>

      </div>

      <div className="quick-actions">

        <h3>Quick Actions</h3>

        <div className="quick-grid">

          <Link to="/student/courses">
            <FaGraduationCap />
            <span>My Courses</span>
            <FaArrowRight />
          </Link>

          <Link to="/student/assignments">
            <FaClipboardList />
            <span>Assignments</span>
            <FaArrowRight />
          </Link>

          <Link to="/student/exams">
            <FaCalendarAlt />
            <span>Exams</span>
            <FaArrowRight />
          </Link>

          <Link to="/student/notes">
            <FaFileAlt />
            <span>Notes</span>
            <FaArrowRight />
          </Link>

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;
