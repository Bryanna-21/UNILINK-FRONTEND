import React from "react";
import {
  FaBook,
  FaFileAlt,
  FaClipboardList,
  FaUsers,
  FaArrowRight
} from "react-icons/fa";
import "./UnitCard.css";

const UnitCard = ({ unit, onClick }) => {
  if (!unit) return null;

  return (
    <div className="unit-card">

      <div className="unit-header">
        <div className="unit-icon">
          <FaBook />
        </div>

        <div className="unit-details">
          <h3>{unit.name || "Unnamed Unit"}</h3>
          <span>
            {unit.code || "No Unit Code"}
          </span>
        </div>
      </div>


      <div className="unit-description">
        <p>
          {unit.description ||
            "Access notes, assignments, discussions, exams and learning resources for this unit."}
        </p>
      </div>


      <div className="unit-statistics">

        <div className="unit-stat">
          <FaFileAlt />
          <span>
            {unit.notes || 0} Notes
          </span>
        </div>


        <div className="unit-stat">
          <FaClipboardList />
          <span>
            {unit.assignments || 0} Assignments
          </span>
        </div>


        <div className="unit-stat">
          <FaUsers />
          <span>
            {unit.members || 0} Members
          </span>
        </div>

      </div>


      <button
        className="unit-button"
        onClick={() => onClick && onClick(unit)}
      >
        Open Unit
        <FaArrowRight />
      </button>

    </div>
  );
};


export default UnitCard;
