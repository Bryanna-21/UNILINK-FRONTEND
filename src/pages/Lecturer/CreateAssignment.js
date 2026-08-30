import React, { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaBook,
  FaCalendarAlt
} from "react-icons/fa";
import courseService from "../../services/courseService";
import assignmentService from "../../services/assignmentService";
import toast from "react-hot-toast";
import "./CreateAssignment.css";

const CreateAssignment = () => {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);

  const [assignment, setAssignment] = useState({
    courseId: "",
    title: "",
    instructions: "",
    dueDate: "",
    maxScore: "",
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setCoursesLoading(true);
    try {
      const res = await courseService.getCourses();
      const courseList = res?.data ?? [];
      setCourses(courseList);
      loadAllAssignments(courseList);
    } catch (error) {
      toast.error("Could not load courses.");
    } finally {
      setCoursesLoading(false);
    }
  };

  // Same shape as UploadNotes.js: no endpoint returns assignments
  // across every course, so fetch per-course in parallel and
  // flatten using the course list we already have loaded.
  const loadAllAssignments = async (courseList) => {
    setAssignmentsLoading(true);
    try {
      const perCourse = await Promise.all(
        courseList.map(async (course) => {
          try {
            const res = await assignmentService.getAssignmentsForCourse(course._id);
            return (res?.data ?? []).map((item) => ({
              ...item,
              courseTitle: course.title,
              courseCode: course.code,
            }));
          } catch {
            return [];
          }
        })
      );
      const flattened = perCourse.flat().sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setAssignments(flattened);
    } catch (error) {
      toast.error("Could not load assignments.");
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assignment.courseId) {
      toast.error("Please select a course.");
      return;
    }

    setSubmitting(true);
    try {
      await assignmentService.createAssignment(assignment.courseId, {
        title: assignment.title,
        instructions: assignment.instructions,
        dueDate: assignment.dueDate || undefined,
        maxScore: assignment.maxScore ? Number(assignment.maxScore) : undefined,
      });

      toast.success("Assignment published.");
      setAssignment({
        courseId: "",
        title: "",
        instructions: "",
        dueDate: "",
        maxScore: "",
      });
      loadAllAssignments(courses);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-assignment-page">
      <main className="create-assignment-content">
        <div className="create-assignment-header">
          <h1>Create Assignment</h1>
          <p>Publish assignments for students and track submissions.</p>
        </div>

        <form className="assignment-form" onSubmit={handleSubmit}>
          <div className="assignment-form-group">
            <label>
              <FaBook />
              Course
            </label>
            <select
              name="courseId"
              value={assignment.courseId}
              onChange={handleChange}
              required
              disabled={coursesLoading}
            >
              <option value="">
                {coursesLoading ? "Loading courses..." : "Select a course"}
              </option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title} ({course.code})
                </option>
              ))}
            </select>
          </div>

          <div className="assignment-form-group">
            <label>
              <FaClipboardList />
              Assignment Title
            </label>
            <input
              type="text"
              name="title"
              value={assignment.title}
              onChange={handleChange}
              placeholder="Enter assignment title"
              required
            />
          </div>

          <div className="assignment-form-group">
            <label>Instructions</label>
            <textarea
              name="instructions"
              value={assignment.instructions}
              onChange={handleChange}
              placeholder="Provide assignment instructions"
              rows="6"
            />
          </div>

          <div className="assignment-form-group">
            <label>
              <FaCalendarAlt />
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={assignment.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="assignment-form-group">
            <label>Max Score</label>
            <input
              type="number"
              name="maxScore"
              value={assignment.maxScore}
              onChange={handleChange}
              placeholder="100"
              min="1"
            />
          </div>

          <button className="publish-assignment-button" type="submit" disabled={submitting}>
            {submitting ? "Publishing..." : "Publish Assignment"}
          </button>
        </form>

        <div className="created-assignments-section">
          <h2>Your Assignments</h2>
          {assignmentsLoading ? (
            <p>Loading assignments...</p>
          ) : assignments.length === 0 ? (
            <p className="no-assignments-message">No assignments created yet.</p>
          ) : (
            <div className="created-assignments-list">
              {assignments.map((item) => (
                <div className="created-assignment-entry" key={item._id}>
                  <span className="created-assignment-title">{item.title}</span>
                  <span className="created-assignment-course">
                    {item.courseTitle} ({item.courseCode})
                  </span>
                  {item.dueDate && (
                    <span className="created-assignment-due">
                      Due {new Date(item.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateAssignment;
