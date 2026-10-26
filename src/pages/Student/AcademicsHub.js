import { Link, useSearchParams } from "react-router-dom";

import Skeleton from "../../components/common/Skeleton";
import StateMessage from "../../components/common/StateMessage";
import useMyCourses from "../../hooks/useMyCourses";
import { unitLabel } from "../../utils/format";

import "../../styles/pages/studentHome.css";

// The web counterpart of the app's Academics tab. Like the app it has
// two segments, "Academics" and "Campus Hub". Pages that exist only in
// the app (CATs, Past Papers, Projects, student Announcements) are not
// listed, so nothing here links to a missing page.
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

// Campus Hub. The first three match the app. The rest exist on the web
// only; delete a line here to take it out of the navigation.
const CAMPUS_HUB = [
  ["Clubs", "Join or start a club", "/clubs"],
  ["Study Groups", "Find or start a study group", "/study-groups"],
  ["Polls", "Vote on active polls", "/polls"],
  ["Communities", "Groups at your university", "/communities"],
  ["Events", "What's happening on campus", "/events"],
  ["Marketplace", "Buy and sell with other students", "/marketplace"],
  ["Lost & Found", "Report or find lost items", "/lost-and-found"],
];

export default function AcademicsHub() {
  const [params, setParams] = useSearchParams();
  const { courses, loading, error, reload } = useMyCourses();

  const section = params.get("section") === "campus-hub" ? "campus-hub" : "academics";

  const choose = (value) =>
    setParams(value === "academics" ? {} : { section: value }, { replace: true });

  return (
    <div className="sh-page">
      <header className="sh-header">
        <h1>Academics</h1>
        <p>Your courses and everything you need for your studies.</p>
      </header>

      <div className="sh-segments" role="tablist" aria-label="Academics sections">
        <button
          type="button"
          role="tab"
          aria-selected={section === "academics"}
          className={`sh-segment${section === "academics" ? " sh-segment--active" : ""}`}
          onClick={() => choose("academics")}
        >
          Academics
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={section === "campus-hub"}
          className={`sh-segment${section === "campus-hub" ? " sh-segment--active" : ""}`}
          onClick={() => choose("campus-hub")}
        >
          Campus Hub
        </button>
      </div>

      {section === "campus-hub" ? (
        <section className="sh-section">
          <div className="sh-card-grid">
            {CAMPUS_HUB.map(([title, text, path]) => (
              <Link className="sh-nav-card" to={path} key={path}>
                <strong>{title}</strong>
                <span>{text}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <>
          {SECTIONS.map((group) => (
            <section className="sh-section" key={group.title}>
              <h2>{group.title}</h2>

              <div className="sh-card-grid">
                {group.cards.map(([title, text, path]) => (
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
        </>
      )}
    </div>
  );
}
