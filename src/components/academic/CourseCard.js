import React from "react";
import { FaBookOpen, FaUsers, FaArrowRight } from "react-icons/fa";
import "./CourseCard.css";

const CourseCard = ({ course, onClick }) => {
  if (!course) return null;

  return (
    <div className="course-card">
      <div className="course-card-header">
        <div className="course-icon">
          <FaBookOpen />
        </div>

        <div className="course-info">
          <h3>{course.name || "Unnamed Course"}</h3>
          <span>{course.code || "No Course Code"}</span>
        </div>
      </div>

      <div className="course-card-body">
        <p>
          {course.description ||
            "Access course materials, units, discussions, assignments and academic resources."}
        </p>

        <div className="course-meta">
          <div className="meta-item">
            <FaUsers />
            <span>
              {course.students || 0} Students
            </span>
          </div>

          <div className="meta-item">
            <FaBookOpen />
            <span>
              {course.units || 0} Units
            </span>
          </div>
        </div>
      </div>

      <button
        className="course-action"
        onClick={() => onClick && onClick(course)}
      >
        View Course
        <FaArrowRight />
      </button>
    </div>
  );
};

export default CourseCard;
