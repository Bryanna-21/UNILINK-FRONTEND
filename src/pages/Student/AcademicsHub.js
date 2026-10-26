import { Link } from "react-router-dom";

import Skeleton from "../../components/common/Skeleton";
import StateMessage from "../../components/common/StateMessage";
import useMyCourses from "../../hooks/useMyCourses";
import { unitLabel } from "../../utils/format";

import "../../styles/pages/studentHome.css";

// The web counterpart of the app's Academics tab: the same sections in
// the same order, then the student's own courses. Pages that exist only
// in the app (CATs, Past Papers) are not listed.
const SECTIONS = [
  {
    title: "My Studies",
    cards: [
      ["My Courses", "Choose a course to continue", "/student/courses"],
      ["My Units", "The units you are enrolled in", "/student/units"],
      ["Timetable", "Your class schedule", "/student/timetable"],
      ["Attendance", "Sign and review your attendance", "/student/attendance"],
    ],
  },
  {
    title: "Coursework",
    cards: [
      ["Assignments", "Assignments across your units", "/student/assignments"],
      ["Notes", "Notes shared for your units", "/student/notes"],
    ],
  },
  {
    title: "Academic Records",
    cards: [
      ["Results", "View your examination results", "/student/results"],
      ["Exam Card", "View and access your exams", "/student/exams"],
    ],
  },
  {
    title: "Library",
    cards: [
      ["Books & Resources", "Books, digital resources and study materials", "/library"],
    ],
  },
];

export default function AcademicsHub() {
  const { courses, loading, error, reload } = useMyCourses();

  return (
    <div className="sh-page">
      <header className="sh-header">
        <h1>Academics</h1>
        <p>Your courses and everything you need for your studies.</p>
      </header>

      {SECTIONS.map((section) => (
        <section className="sh-section" key={section.title}>
          <h2>{section.title}</h2>

          <div className="sh-card-grid">
            {section.cards.map(([title, text, path]) => (
              <Link className="sh-nav-card" to={path} key={path}>
                <strong>{title}</strong>
                <span>{text}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="sh-section">
        <h2>My Courses</h2>

        {loading ? (
          <Skeleton variant="list" rows={3} />
        ) : error ? (
          <StateMessage
            kind="error"
            title="Couldn't load your courses"
            text={error}
            action={
              <button type="button" className="list-btn" onClick={reload}>
                Try again
              </button>
            }
          />
        ) : courses.length === 0 ? (
          <StateMessage
            title="No courses yet"
            text="Add your courses to see them here."
            action={
              <Link className="list-btn" to="/student/courses">
                Go to my courses
              </Link>
            }
          />
        ) : (
          <div className="sh-stack">
            {courses.map((course) => (
              <Link
                className="sh-nav-card"
                to={`/student/courses/${course._id}`}
                key={course._id}
              >
                <strong>{unitLabel(course)}</strong>
                {course.description && <span>{course.description}</span>}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
