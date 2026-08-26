import React, { useEffect, useMemo, useState } from "react";
import "./Courses.css";

import CourseCard from "../../components/academic/CourseCard";

import SearchBar from "../../components/common/SearchBar";
import Skeleton from "../../components/common/Skeleton";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";

import { FaBookOpen } from "react-icons/fa";

// Backend Service
// Uncomment when backend is ready
// import courseService from "../../services/courseService";

const ITEMS_PER_PAGE = 6;

const Courses = () => {
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
      /*
      const response = await courseService.getCourses();

      setCourses(response.data);

      setFilteredCourses(response.data);
      */

      // Demo Data (Remove after backend integration)

      const demoCourses = [
        {
          id: 1,
          name: "Bachelor of Computer Science",
          code: "BCS",
          faculty: "School of Computing",
          duration: "4 Years",
          units: 52,
        },
        {
          id: 2,
          name: "Bachelor of Information Technology",
          code: "BIT",
          faculty: "School of Computing",
          duration: "4 Years",
          units: 48,
        },
        {
          id: 3,
          name: "Bachelor of Education Arts",
          code: "BED",
          faculty: "School of Education",
          duration: "4 Years",
          units: 56,
        },
        {
          id: 4,
          name: "Bachelor of Business Administration",
          code: "BBA",
          faculty: "School of Business",
          duration: "4 Years",
          units: 50,
        },
        {
          id: 5,
          name: "Bachelor of Nursing",
          code: "BN",
          faculty: "School of Health Sciences",
          duration: "4 Years",
          units: 60,
        },
        {
          id: 6,
          name: "Bachelor of Economics",
          code: "BEC",
          faculty: "School of Business",
          duration: "4 Years",
          units: 46,
        },
               {
          id: 7,
          name: "Bachelor of Education Science",
          code: "BEDS",
          faculty: "School of Education",
          duration: "4 Years",
          units: 58,
        },
        {
          id: 8,
          name: "Bachelor of Agriculture",
          code: "BAG",
          faculty: "School of Agriculture",
          duration: "4 Years",
          units: 54,
        },
      ];

      setCourses(demoCourses);
      setFilteredCourses(demoCourses);

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
        course.name.toLowerCase().includes(keyword) ||
        course.code.toLowerCase().includes(keyword) ||
        course.faculty.toLowerCase().includes(keyword)
      );

    });

    setFilteredCourses(results);

    setCurrentPage(1);

  };

  const statistics = useMemo(() => {

    const totalUnits = filteredCourses.reduce(
      (sum, course) => sum + course.units,
      0
    );

    const faculties = new Set(
      filteredCourses.map((course) => course.faculty)
    ).size;

    return {
      totalCourses: filteredCourses.length,
      totalUnits,
      faculties,
    };

  }, [filteredCourses]);

  const totalPages = Math.ceil(
    filteredCourses.length / ITEMS_PER_PAGE
  );

  const lastIndex = currentPage * ITEMS_PER_PAGE;

  const firstIndex = lastIndex - ITEMS_PER_PAGE;

  const currentCourses = filteredCourses.slice(
    firstIndex,
    lastIndex
  );

  return (
    <div className="courses-layout">


      <main className="courses-content">

        <div className="courses-header">

          <div>

            <h1>My Courses</h1>

            <p> 
                  Browse and search all your enrolled academic programmes.
            </p>

          </div>

          <div className="courses-summary">

            <div className="summary-card">
              <h2>{statistics.totalCourses}</h2>
              <span>Courses</span>
            </div>

            <div className="summary-card">
              <h2>{statistics.totalUnits}</h2>
              <span>Units</span>
            </div>

            <div className="summary-card">
              <h2>{statistics.faculties}</h2>
              <span>Faculties</span>
            </div>

          </div>

        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search courses by name, code or faculty..."
        />

        {loading ? (

          <Skeleton
            variant="card"
            count={6}
          />

        ) : currentCourses.length === 0 ? (

          <div className="courses-empty">

            <FaBookOpen size={60} />

            <h3>No Courses Found</h3>

            <p>
              No course matches your current search.
            </p>

          </div>

        ) : (

          <>
            <div className="courses-grid">

              {currentCourses.map((course) => (

                <CourseCard
                  key={course.id}
                  title={course.name}
                  code={course.code}
                  faculty={course.faculty}
                  duration={course.duration}
                  totalUnits={course.units}
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
