import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarCheck, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";

import Skeleton from "../../components/common/Skeleton";
import StateMessage from "../../components/common/StateMessage";
import useMyCourses from "../../hooks/useMyCourses";
import attendanceService from "../../services/attendanceService";

import { getErrorMessage } from "../../utils/errors";
import { notify } from "../../utils/notify";
import { formatDate, todayLocalISO, unitLabel } from "../../utils/format";

import "./Attendance.css";
import "../../styles/pages/lists.css";

// Attendance the student has signed, per enrolled unit. The backend
// stores one record per signed date and does not know how many classes
// were held, so this page reports days signed and the latest date
// rather than a percentage it cannot compute.
const Attendance = () => {
  const { courses, loading, error, reload } = useMyCourses();

  const [records, setRecords] = useState({});
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [signingId, setSigningId] = useState(null);

  const loadRecords = useCallback(async () => {
    if (courses.length === 0) {
      setRecords({});
      return;
    }

    setRecordsLoading(true);

    const results = await Promise.allSettled(
      courses.map((course) => attendanceService.getMyAttendanceForCourse(course._id))
    );

    const next = {};

    results.forEach((result, index) => {
      next[courses[index]._id] =
        result.status === "fulfilled" && Array.isArray(result.value?.data)
          ? result.value.data
          : null;
    });

    setRecords(next);
    setRecordsLoading(false);
  }, [courses]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const signToday = async (courseId) => {
    setSigningId(courseId);

    try {
      await attendanceService.signAttendance(courseId, todayLocalISO());
      notify.success("Attendance signed for today.");
      await loadRecords();
    } catch (err) {
      notify.error(getErrorMessage(err, "We couldn't sign your attendance."));
    } finally {
      setSigningId(null);
    }
  };

  const latestDate = (list) =>
    list && list.length
      ? list.map((item) => item.date).sort().slice(-1)[0]
      : null;

  return (
    <div className="attendance-page">
      <main className="attendance-content">
        <div className="attendance-header">
          <h1>Attendance</h1>
          <p>The class days you have signed for each of your units.</p>
        </div>

        {loading || (recordsLoading && courses.length > 0 && !Object.keys(records).length) ? (
          <Skeleton variant="card" count={3} />
        ) : error ? (
          <StateMessage
            kind="error"
            title="Attendance unavailable"
            text={error}
            action={
              <button type="button" className="list-btn" onClick={reload}>
                Try again
              </button>
            }
          />
        ) : courses.length === 0 ? (
          <StateMessage
            title="No units yet"
            text="Add your units to start signing attendance."
            action={
              <Link className="list-btn" to="/student/courses">
                Go to my courses
              </Link>
            }
          />
        ) : (
          <div className="attendance-grid">
            {courses.map((course) => {
              const list = records[course._id];
              const last = latestDate(list);
              const signedToday = Boolean(
                list && list.some((item) => item.date === todayLocalISO())
              );

              return (
                <div className="attendance-card" key={course._id}>
                  <div className="attendance-card-header">
                    <div className="attendance-icon">
                      <FaCalendarCheck />
                    </div>

                    <div>
                      <h3>{unitLabel(course)}</h3>
                    </div>
                  </div>

                  <div className="attendance-statistics">
                    {list === null ? (
                      <div className="attendance-stat">
                        <span>Your attendance couldn't be loaded.</span>
                      </div>
                    ) : (
                      <>
                        <div className="attendance-stat">
                          <FaCheckCircle />
                          <span>Days signed: {list ? list.length : 0}</span>
                        </div>

                        <div className="attendance-stat">
                          <FaCalendarAlt />
                          <span>
                            Last signed:{" "}
                            {last ? formatDate(`${last}T00:00:00`) : "not yet"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    className="list-btn"
                    disabled={signedToday || signingId === course._id || list === null}
                    onClick={() => signToday(course._id)}
                  >
                    {signedToday
                      ? "Signed today"
                      : signingId === course._id
                      ? "Signing..."
                      : "Sign today"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Attendance;
