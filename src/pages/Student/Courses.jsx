import React, { useEffect, useState } from "react";
import CourseCard from "../../components/academic/CourseCard";
import AcademicSidebar from "../../components/academic/AcademicSidebar";
import "./Courses.css";


const Courses = () => {

  const [courses, setCourses] = useState([]);


  useEffect(() => {

    /*
      Temporary frontend data.
      Replace with API call when backend is connected.
    */

    const demoCourses = [

      {
        id: 1,
        name: "Computer Science",
        code: "CS001",
        description:
          "Learn programming, algorithms, databases and software engineering concepts.",
        students: 120,
        units: 8
      },


      {
        id: 2,
        name: "Information Technology",
        code: "IT002",
        description:
          "Study networking, systems administration and technology management.",
        students: 95,
        units: 7
      },


      {
        id: 3,
        name: "Business Information Systems",
        code: "BIS003",
        description:
          "Combine business knowledge with modern information systems.",
        students: 80,
        units: 6
      }

    ];


    setCourses(demoCourses);


  }, []);



  const handleCourseOpen = (course) => {

    console.log(
      "Opening course:",
      course
    );

    /*
      Later:
      navigate(`/student/courses/${course.id}`)
    */

  };



  return (

    <div className="courses-page">


      <AcademicSidebar />


      <main className="courses-content">


        <div className="courses-header">

          <h1>
            My Courses
          </h1>

          <p>
            Access your enrolled courses and academic resources.
          </p>

        </div>



        <div className="courses-grid">


          {
            courses.length > 0 ?

            courses.map((course) => (

              <CourseCard

                key={course.id}

                course={course}

                onClick={handleCourseOpen}

              />

            ))

            :

            <div className="empty-courses">

              No courses available.

            </div>

          }


        </div>


      </main>


    </div>

  );

};


export default Courses;
