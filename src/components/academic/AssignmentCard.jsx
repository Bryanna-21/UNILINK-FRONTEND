import React from "react";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaArrowRight
} from "react-icons/fa";
import "./AssignmentCard.css";

const AssignmentCard = ({ assignment, onClick }) => {
  if (!assignment) return null;

  const getStatus = () => {
    if (assignment.status) {
      return assignment.status;
    }

    return "Pending";
  };


  const status = getStatus();


  return (
    <div className="assignment-card">

      <div className="assignment-header">

        <div className="assignment-icon">
          <FaClipboardList />
        </div>


        <div className="assignment-info">

          <h3>
            {assignment.title || "Untitled Assignment"}
          </h3>

          <span>
            {assignment.unit || "Unknown Unit"}
          </span>

        </div>

      </div>



      <div className="assignment-description">

        <p>
          {assignment.description ||
            "Complete this assignment and submit before the deadline."}
        </p>

      </div>



      <div className="assignment-details">


        <div className="assignment-detail">

          <FaUser />

          <span>
            {assignment.createdBy || "Unknown Lecturer"}
          </span>

        </div>



        <div className="assignment-detail">

          <FaCalendarAlt />

          <span>
            Due: {assignment.deadline || "No deadline"}
          </span>

        </div>



        <div className="assignment-detail">

          {
            status === "Completed" ?
            <FaCheckCircle /> :
            <FaClock />
          }


          <span>
            {status}
          </span>

        </div>


      </div>



      <button
        className="assignment-button"
        onClick={() => onClick && onClick(assignment)}
      >

        View Assignment

        <FaArrowRight />

      </button>


    </div>
  );
};


export default AssignmentCard;
