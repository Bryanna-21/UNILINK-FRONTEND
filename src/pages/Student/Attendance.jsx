import React, { useEffect, useState } from "react";
import AcademicSidebar from "../../components/academic/AcademicSidebar";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarCheck,
  FaChartLine
} from "react-icons/fa";
import "./Attendance.css";


const Attendance = () => {

  const [attendance, setAttendance] = useState([]);



  useEffect(() => {

    /*
      Temporary frontend data.
      Replace with attendanceService API later.
    */

    const demoAttendance = [

      {
        id: 1,
        unit: "CS201 - Data Structures and Algorithms",
        totalClasses: 20,
        attended: 18,
        missed: 2,
        percentage: 90
      },


      {
        id: 2,
        unit: "CS202 - Database Management Systems",
        totalClasses: 22,
        attended: 20,
        missed: 2,
        percentage: 91
      },


      {
        id: 3,
        unit: "CS203 - Software Engineering",
        totalClasses: 18,
        attended: 15,
        missed: 3,
        percentage: 83
      }

    ];


    setAttendance(demoAttendance);


  }, []);



  return (

    <div className="attendance-page">


      <AcademicSidebar />


      <main className="attendance-content">


        <div className="attendance-header">

          <h1>
            Attendance Tracking
          </h1>


          <p>
            Monitor your class attendance and academic participation.
          </p>

        </div>



        <div className="attendance-grid">


          {
            attendance.length > 0 ?


            attendance.map((item) => (

              <div
                className="attendance-card"
                key={item.id}
              >


                <div className="attendance-card-header">


                  <div className="attendance-icon">

                    <FaCalendarCheck />

                  </div>


                  <div>

                    <h3>
                      {item.unit}
                    </h3>

                  </div>


                </div>




                <div className="attendance-statistics">


                  <div className="attendance-stat">

                    <FaCheckCircle />

                    <span>
                      Attended: {item.attended}
                    </span>

                  </div>



                  <div className="attendance-stat">

                    <FaTimesCircle />

                    <span>
                      Missed: {item.missed}
                    </span>

                  </div>



                  <div className="attendance-stat">

                    <FaChartLine />

                    <span>
                      Attendance: {item.percentage}%
                    </span>

                  </div>


                </div>




                <div className="attendance-progress">

                  <div
                    className="attendance-progress-bar"
                    style={{
                      width: `${item.percentage}%`
                    }}
                  >

                  </div>

                </div>


              </div>

            ))


            :


            <div className="empty-attendance">

              No attendance records available.

            </div>

          }


        </div>



      </main>


    </div>

  );

};


export default Attendance;
