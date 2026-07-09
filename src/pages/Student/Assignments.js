import React, { useEffect, useState } from "react";
import AssignmentCard from "../../components/academic/AssignmentCard";
import AcademicSidebar from "../../components/academic/AcademicSidebar";
import "./Assignments.css";


const Assignments = () => {

  const [assignments, setAssignments] = useState([]);



  useEffect(() => {

    /*
      Temporary frontend data.
      Replace with assignmentService API later.
    */

    const demoAssignments = [

      {
        id: 1,
        title: "Database Design Project",
        unit: "CS202 - Database Management Systems",
        description:
          "Design a relational database system and submit documentation.",
        createdBy: "Dr. Mary Wanjiku",
        deadline: "15 July 2026",
        status: "Pending"
      },


      {
        id: 2,
        title: "Algorithm Analysis Report",
        unit: "CS201 - Data Structures and Algorithms",
        description:
          "Analyze different algorithms and compare performance.",
        createdBy: "Dr. James Kariuki",
        deadline: "20 July 2026",
        status: "Completed"
      },


      {
        id: 3,
        title: "Software Requirements Document",
        unit: "CS203 - Software Engineering",
        description:
          "Prepare system requirements documentation for a software project.",
        createdBy: "Mr. Peter Otieno",
        deadline: "25 July 2026",
        status: "Pending"
      }

    ];


    setAssignments(demoAssignments);


  }, []);



  const handleAssignmentOpen = (assignment) => {

    console.log(
      "Opening assignment:",
      assignment
    );

    /*
      Later:

      navigate(
        `/student/assignments/${assignment.id}`
      )

    */

  };



  return (

    <div className="assignments-page">


      <AcademicSidebar />


      <main className="assignments-content">


        <div className="assignments-header">

          <h1>
            Assignments
          </h1>


          <p>
            View assignments, deadlines and submission status.
          </p>

        </div>




        <div className="assignments-grid">


          {
            assignments.length > 0 ?


            assignments.map((assignment) => (

              <AssignmentCard

                key={assignment.id}

                assignment={assignment}

                onClick={handleAssignmentOpen}

              />

            ))


            :


            <div className="empty-assignments">

              No assignments available.

            </div>

          }


        </div>



      </main>


    </div>

  );

};


export default Assignments;
