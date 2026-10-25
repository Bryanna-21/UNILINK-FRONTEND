import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaClipboardList } from "react-icons/fa";

import AssignmentCard from "../../components/academic/AssignmentCard";
import SearchBar from "../../components/common/SearchBar";
import Skeleton from "../../components/common/Skeleton";
import Pagination from "../../components/common/Pagination";
import StateMessage from "../../components/common/StateMessage";

import courseService from "../../services/courseService";
import assignmentService from "../../services/assignmentService";

import { getErrorMessage } from "../../utils/errors";
import { formatDate, unitLabel } from "../../utils/format";

import "./Assignments.css";

const ITEMS_PER_PAGE = 6;

// Assignments across the student's enrolled units, with the student's
// own submission status. Sources: GET /courses, GET
// /courses/:id/assignments and GET /courses/assignments/:id/my-submission.
// Submitting happens inside the course page, which already has the form.
const Assignments = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [hasUnits, setHasUnits] = useState(true);
  const [skipped, setSkipped] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await courseService.getCourses();
      const courses = Array.isArray(response?.data) ? response.data : [];

      setHasUnits(courses.length > 0);

      const perCourse = await Promise.allSettled(
        courses.map((course) =>
          assignmentService.getAssignmentsForCourse(course._id)
        )
      );

      const flat = [];
      let failed = 0;

      perCourse.forEach((result, index) => {
        if (result.status !== "fulfilled") {
          failed += 1;
          return;
        }

        const course = courses[index];
        const items = Array.isArray(result.value?.data) ? result.value.data : [];

        items.forEach((assignment) => flat.push({ assignment, course }));
      });

      const withSubmissions = await Promise.all(
        flat.map(async ({ assignment, course }) => {
          let submission = null;
          let submissionKnown = true;

          try {
            const sub = await assignmentService.getMySubmission(assignment._id);
            submission = sub?.data ?? null;
          } catch (err) {
            submissionKnown = false;
          }

          return { assignment, course, submission, submissionKnown };
        })
      );

      const now = Date.now();

      const rows = withSubmissions.map(
        ({ assignment, course, submission, submissionKnown }) => {
          const graded =
            submission && submission.grade !== null && submission.grade !== undefined;
          const due = assignment.dueDate ? new Date(assignment.dueDate) : null;

          return {
            id: assignment._id,
            courseId: course._id,
            title: assignment.title,
            unit: unitLabel(course),
            description: assignment.instructions,
            deadline: formatDate(assignment.dueDate),
            dueTime: due ? due.getTime() : null,
            submitted: Boolean(submission),
            submissionKnown,
            status: graded ? "Graded" : submission ? "Submitted" : "Pending",
            marks: graded ? submission.grade : undefined,
            totalMarks: assignment.maxScore,
            overdue: Boolean(!submission && due && due.getTime() < now),
          };
        }
      );

      rows.sort((a, b) => (a.dueTime ?? Infinity) - (b.dueTime ?? Infinity));

      setAssignments(rows);
      setSkipped(failed);
    } catch (err) {
      setAssignments([]);
      setError(getErrorMessage(err, "We couldn't load your assignments."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return assignments;

    return assignments.filter(
      (item) =>
        (item.title || "").toLowerCase().includes(keyword) ||
        (item.unit || "").toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword)
    );
  }, [assignments, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const statistics = useMemo(
    () => ({
      total: filtered.length,
      pending: filtered.filter((item) => !item.submitted).length,
      completed: filtered.filter((item) => item.submitted).length,
    }),
    [filtered]
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const lastIndex = currentPage * ITEMS_PER_PAGE;
  const current = filtered.slice(lastIndex - ITEMS_PER_PAGE, lastIndex);

  const openCourse = (item) => navigate(`/student/courses/${item.courseId}`);

  return (
    <div className="assignments-page">
      <main className="assignments-content">
        <div className="assignments-header">
          <div>
            <h1>Assignments</h1>
            <p>Assignments from your units, with your submission status.</p>
          </div>

          <div className="assignments-summary">
            <div className="summary-card">
              <h2>{statistics.total}</h2>
              <span>Total</span>
            </div>

            <div className="summary-card">
              <h2>{statistics.pending}</h2>
              <span>Not submitted</span>
            </div>

            <div className="summary-card">
              <h2>{statistics.completed}</h2>
              <span>Submitted</span>
            </div>
          </div>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search assignments..."
        />

        {loading ? (
          <Skeleton variant="card" count={3} />
        ) : error ? (
          <StateMessage
            kind="error"
            title="Assignments unavailable"
            text={error}
            action={
              <button type="button" className="list-btn" onClick={load}>
                Try again
              </button>
            }
          />
        ) : !hasUnits ? (
          <StateMessage
            title="No units yet"
            text="Add your units to see their assignments."
            action={
              <Link className="list-btn" to="/student/courses">
                Go to my courses
              </Link>
            }
          />
        ) : current.length === 0 ? (
          <div className="empty-assignments">
            <FaClipboardList size={60} />
            <h3>No Assignments Found</h3>
            <p>
              {search
                ? "No assignment matches your search."
                : "Your lecturers haven't set any assignments yet."}
            </p>
          </div>
        ) : (
          <>
            {skipped > 0 && (
              <p className="list-hint">
                Assignments for {skipped} of your units could not be loaded.
              </p>
            )}

            <div className="assignments-grid">
              {current.map((item) => (
                <AssignmentCard
                  key={item.id}
                  title={item.title}
                  unit={item.unit}
                  description={item.description}
                  deadline={item.deadline}
                  submitted={item.submitted}
                  submissionStatus={item.status}
                  overdue={item.overdue}
                  marks={item.marks}
                  totalMarks={item.totalMarks}
                  onView={() => openCourse(item)}
                  onSubmit={() => openCourse(item)}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Assignments;
