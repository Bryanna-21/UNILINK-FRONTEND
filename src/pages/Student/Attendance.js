import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarCheck,
  FaChartLine
} from "react-icons/fa";
import "./Attendance.css";


const Attendance = () => {

  const [attendance, setAttendance] = useState([]);



  useEffect(() => { let active=true; import("../../services/attendanceService").then(({default:service})=>service.getMyAttendance()).then(raw=>{if(active)setAttendance(Array.isArray(raw)?raw:[])}).catch(()=>{if(active)setAttendance([])}); return ()=>{active=false}; }, []);



  return (

    <div className="attendance-page">




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
