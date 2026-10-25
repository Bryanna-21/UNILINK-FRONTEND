import React from "react";
import { Link, useNavigate } from "react-router-dom";

import UnitCard from "../../components/academic/UnitCard";
import Skeleton from "../../components/common/Skeleton";
import StateMessage from "../../components/common/StateMessage";
import useMyCourses from "../../hooks/useMyCourses";

import "./Units.css";

// The units the student is enrolled in, straight from GET /courses.
const Units = () => {
  const navigate = useNavigate();
  const { courses, loading, error, reload } = useMyCourses();

  const units = courses.map((course) => ({
    id: course._id,
    name: course.title,
    code: course.code,
    description: course.description,
    members:
      typeof course.enrolledCount === "number" ? course.enrolledCount : undefined,
  }));

  return (
    <div className="units-page">
      <main className="units-content">
        <div className="units-header">
          <h1>My Units</h1>
          <p>The units you are enrolled in.</p>
        </div>

        {loading ? (
          <Skeleton variant="card" count={3} />
        ) : error ? (
          <StateMessage
            kind="error"
            title="Units unavailable"
            text={error}
            action={
              <button type="button" className="list-btn" onClick={reload}>
                Try again
              </button>
            }
          />
        ) : units.length === 0 ? (
          <StateMessage
            title="You haven't added any units"
            text="Pick your units to see their notes, assignments and discussions."
            action={
              <Link className="list-btn" to="/student/courses">
                Go to my courses
              </Link>
            }
          />
        ) : (
          <div className="units-grid">
            {units.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                onClick={(item) => navigate(`/student/courses/${item.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Units;
