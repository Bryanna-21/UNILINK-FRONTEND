import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Courses.css";

import CourseCard from "../../components/academic/CourseCard";
import courseService from "../../services/courseService";

import SearchBar from "../../components/common/SearchBar";
import Skeleton from "../../components/common/Skeleton";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";

import { FaBookOpen } from "react-icons/fa";

const ITEMS_PER_PAGE = 6;

const Courses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, courses]);

  const fetchCourses = async () => {
    setLoading(true);

    try {
      const response = await courseService.getCourses();
      const realCourses = response?.data ?? [];
      setCourses(realCourses);
      setFilteredCourses(realCourses);
    } catch (error) {
      console.error(error);
      setToast({
        show: true,
        type: "error",
        message: "Unable to load courses.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      setFilteredCourses(courses);
      setCurrentPage(1);
      return;
    }

    const results = courses.filter((course) => {
      return (
        course.title?.toLowerCase().includes(keyword) ||
        course.code?.toLowerCase().includes(keyword) ||
        course.description?.toLowerCase().includes(keyword)
      );
    });

    setFilteredCourses(results);
    setCurrentPage(1);
  };

  const statistics = useMemo(() => {
    const totalEnrolled = filteredCourses.reduce(
      (sum, course) => sum + (course.enrolledStudentIds?.length ?? 0),
      0
    );

    return {
      totalCourses: filteredCourses.length,
      totalEnrolled,
    };
  }, [filteredCourses]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const lastIndex = currentPage * ITEMS_PER_PAGE;
  const firstIndex = lastIndex - ITEMS_PER_PAGE;
  const currentCourses = filteredCourses.slice(firstIndex, lastIndex);

  const handleViewCourse = (course) => {
    navigate(`/student/courses/${course._id}`);
  };

  return (
    <div className="courses-layout">
      <main className="courses-content">
        <div className="courses-header">
          <div>
            <h1>Courses</h1>
            <p>Browse available courses and enroll to access materials.</p>
          </div>

          <div className="courses-summary">
            <div className="summary-card">
              <h2>{statistics.totalCourses}</h2>
              <span>Courses</span>
            </div>

            <div className="summary-card">
              <h2>{statistics.totalEnrolled}</h2>
              <span>Total Enrollments</span>
            </div>
          </div>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search courses by title, code or description..."
        />

        {loading ? (
          <Skeleton variant="card" count={6} />
        ) : currentCourses.length === 0 ? (
          <div className="courses-empty">
            <FaBookOpen size={60} />
            <h3>No Courses Found</h3>
            <p>No course matches your current search.</p>
          </div>
        ) : (
          <>
            <div className="courses-grid">
              {currentCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={{
                    ...course,
                    name: course.title,
                    students: course.enrolledStudentIds?.length ?? 0,
                  }}
                  onClick={handleViewCourse}
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

        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={() =>
            setToast((prev) => ({
              ...prev,
              show: false,
            }))
          }
        />
      </main>
    </div>
  );
};

export default Courses;
