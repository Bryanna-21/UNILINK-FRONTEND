import React from "react";
import "./TimetableCard.css";

import {
  FaClock,
  FaMapMarkerAlt,
  FaUserTie,
  FaBook,
  FaCalendarDay,
} from "react-icons/fa";


const TimetableCard = ({
  day,
  date,
  unit,
  lecturer,
  room,
  startTime,
  endTime,
  type = "Lecture",
  onClick,
}) => {


  return (
    <div
      className="timetable-card"
      onClick={() => onClick && onClick()}
    >


      <div className="timetable-header">


        <div className="day-section">

          <FaCalendarDay />

          <div>
            <h3>
              {day || "Unknown Day"}
            </h3>

            {
              date &&
              (
                <span>
                  {date}
                </span>
              )
            }

          </div>

        </div>



        <span className="class-type">
          {type}
        </span>


      </div>





      <div className="timetable-content">


        <div className="timetable-item">

          <FaBook />

          <div>

            <label>
              Unit
            </label>

            <p>
              {unit || "No unit assigned"}
            </p>

          </div>

        </div>





        <div className="timetable-item">

          <FaUserTie />

          <div>

            <label>
              Lecturer
            </label>

            <p>
              {lecturer || "Not assigned"}
            </p>

          </div>

        </div>





        <div className="timetable-item">

          <FaClock />

          <div>

            <label>
              Time
            </label>

            <p>
              {startTime || "--"} - {endTime || "--"}
            </p>

          </div>

        </div>





        <div className="timetable-item">

          <FaMapMarkerAlt />

          <div>

            <label>
              Venue
            </label>

            <p>
              {room || "Online"}
            </p>

          </div>

        </div>



      </div>


    </div>
  );

};


export default TimetableCard;
