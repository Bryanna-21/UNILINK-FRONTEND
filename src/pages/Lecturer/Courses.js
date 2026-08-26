import React, { useEffect, useState } from "react";
import CourseCard from "../../components/academic/CourseCard";
import "./Courses.css";


const Courses = () => {

  const [courses, setCourses] = useState([]);



  useEffect(() => {

    /*
      Temporary lecturer course data.
      Replace with lecturerService API later.
    */

    const lecturerCourses = [

      {
        id: 1,
        name: "Computer Science",
        code: "CS001",
        description:
          "Manage course units, learning resources and student activities.",
        students: 120,
        units: 8
      },


      {
        id: 2,
        name: "Information Technology",
        code: "IT002",
        description:
          "Coordinate IT modules, assignments and academic discussions.",
        students: 95,
        units: 7
      }


    ];


    setCourses(lecturerCourses);


  }, []);



  const handleCourseOpen = (course) => {

    console.log(
      "Opening lecturer course:",
      course
    );

    /*
      Later:

      navigate(
        `/lecturer/courses/${course.id}`
      )

    */

  };



  return (

    <div className="lecturer-courses-page">




      <main className="lecturer-courses-content">


        <div className="lecturer-courses-header">

          <h1>
            My Courses
          </h1>


          <p>
            Manage your assigned courses and learning resources.
          </p>

        </div>




        <div className="lecturer-courses-grid">


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

              No assigned courses available.

            </div>

          }


        </div>



      </main>


    </div>

  );

};


export default Courses;
