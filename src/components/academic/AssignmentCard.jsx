import React from "react";
import "./AssignmentCard.css";

import {
  FaClipboardList,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaCheckCircle,
  FaExclamationCircle,
  FaUpload,
} from "react-icons/fa";


const AssignmentCard = ({
  title,
  description,
  unit,
  lecturer,
  deadline,
  submitted = false,
  submissionStatus = "Pending",
  marks,
  totalMarks,
  onSubmit,
  onView,
}) => {


  const getStatusClass = () => {

    if (submitted && submissionStatus === "Graded") {
      return "graded";
    }

    if (submitted) {
      return "submitted";
    }

    return "pending";
  };


  return (
    <div className="assignment-card">


      <div className="assignment-header">

        <div className="assignment-icon">
          <FaClipboardList />
        </div>


        <div className="assignment-title">

          <h3>
            {title || "Untitled Assignment"}
          </h3>

          <span>
            {unit || "Unknown Unit"}
          </span>

        </div>

      </div>



      <div className="assignment-description">

        <p>
          {description || 
          "No assignment description provided."}
        </p>

      </div>




      <div className="assignment-details">


        <div className="detail-item">

          <FaUser />

          <span>
            {lecturer || "Unknown Lecturer"}
          </span>

        </div>



        <div className="detail-item">

          <FaCalendarAlt />

          <span>
            Due: {deadline || "No deadline"}
          </span>

        </div>



        <div className="detail-item">

          <FaClock />

          <span>
            Submission deadline applies
          </span>

        </div>


      </div>





      <div className={`assignment-status ${getStatusClass()}`}>


        {submitted ? (
          <>
            <FaCheckCircle />

            <span>
              {submissionStatus}
            </span>
          </>
        ) : (
          <>
            <FaExclamationCircle />

            <span>
              Not Submitted
            </span>
          </>
        )}


      </div>






      {
        marks !== undefined &&
        (
          <div className="assignment-marks">

            Marks:

            <strong>
              {marks}/{totalMarks}
            </strong>

          </div>
        )
      }






      <div className="assignment-actions">


        <button
          className="view-assignment-btn"
          onClick={() => onView && onView()}
        >
          View Details
        </button>



        {
          !submitted &&
          (
            <button
              className="submit-assignment-btn"
              onClick={() => onSubmit && onSubmit()}
            >

              <FaUpload />

              Submit

            </button>
          )
        }


      </div>



    </div>
  );

};


export default AssignmentCard;
