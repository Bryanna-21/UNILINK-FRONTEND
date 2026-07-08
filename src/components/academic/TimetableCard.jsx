import React from "react";
import {
  FaClock,
  FaMapMarkerAlt,
  FaUserTie,
  FaBook
} from "react-icons/fa";
import "./TimetableCard.css";

const TimetableCard = ({ timetable }) => {
  if (!timetable) return null;


  return (
    <div className="timetable-card">

      <div className="timetable-header">

        <div className="timetable-icon">
          <FaBook />
        </div>


        <div className="timetable-title">

          <h3>
            {timetable.unit || "Unknown Unit"}
          </h3>

          <span>
            {timetable.code || "No Unit Code"}
          </span>

        </div>

      </div>



      <div className="timetable-information">


        <div className="timetable-item">

          <FaClock />

          <span>
            {timetable.time || "No Time Assigned"}
          </span>

        </div>



        <div className="timetable-item">

          <FaMapMarkerAlt />

          <span>
            {timetable.room || "No Room Assigned"}
          </span>

        </div>



        <div className="timetable-item">

          <FaUserTie />

          <span>
            {timetable.lecturer || "No Lecturer Assigned"}
          </span>

        </div>


      </div>


      <div className="timetable-day">

        {timetable.day || "Day Not Assigned"}

      </div>


    </div>
  );
};


export default TimetableCard;
