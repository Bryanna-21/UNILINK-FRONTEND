import React, { useEffect, useState } from "react";
import "./Courses.css";

import AcademicSidebar from "../../components/academic/AcademicSidebar";
import CourseCard from "../../components/academic/CourseCard";

import { FaSearch, FaBookOpen } from "react-icons/fa";

// Replace this with your actual API service later
// import courseService from "../../services/courseService";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();

    const results = courses.filter(
      (course) =>
        course.name.toLowerCase().includes(keyword) ||
        course.code.toLowerCase().includes(keyword) ||
        course.faculty.toLowerCase().includes(keyword)
    );

    setFilteredCourses(results);
  }, [search, courses]);

  const fetchCourses = async () => {
    try {
      // const response = await courseService.getCourses();
      // setCourses(response.data);

      // Temporary demo data
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
      ];

      setCourses(demoCourses);
      setFilteredCourses(demoCourses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="courses-layout">

      <AcademicSidebar />

      <main className="courses-content">

        <div className="courses-header">
          <h1>My Courses</h1>
          <p>View all enrolled academic programmes.</p>
        </div>

        <div className="courses-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {loading ? (
          <div className="courses-loading">
            <p>Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="courses-empty">
            <FaBookOpen size={45} />
            <h3>No Courses Found</h3>
            <p>No course matches your search.</p>
          </div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map((course) => (
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
        )}

      </main>

    </div>
  );
};

export default Courses;
