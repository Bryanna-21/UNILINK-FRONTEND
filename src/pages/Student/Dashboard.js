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
import api from "../../services/api";

import SearchBar from "../../components/common/SearchBar";
import Skeleton from "../../components/common/Skeleton";

import "./Dashboard.css";

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({courses:0, assignments:0, notes:0, notifications:0});
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    let active=true;
    Promise.all([
      import("../../services/courseService").then(({default:s})=>s.getMyCourses()).catch(()=>[]),
      import("../../services/assignmentService").then(({default:s})=>s.getAssignments()).catch(()=>[]),
      import("../../services/examService").then(({default:s})=>s.getStudentExams()).catch(()=>[]),
      api.get("/announcements").then(({data})=>data).catch(()=>[])
    ]).then(([courses,assignmentList,examList,announcementData])=>{
      if(!active)return; const a=Array.isArray(assignmentList)?assignmentList:[]; const e=Array.isArray(examList)?examList:[]; const c=Array.isArray(courses)?courses:[]; const n=Array.isArray(announcementData)?announcementData:(announcementData?.data||announcementData?.announcements||[]);
      setStats({courses:c.length,assignments:a.length,notes:0,notifications:0}); setAssignments(a.slice(0,4)); setExams(e.slice(0,4)); setAnnouncements(n.slice(0,4)); setLoading(false);
    }).catch(()=>{if(active)setLoading(false)});
    return ()=>{active=false};
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
