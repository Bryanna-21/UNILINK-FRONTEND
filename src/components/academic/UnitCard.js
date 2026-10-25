import React from "react";
import { FaBook, FaUsers, FaArrowRight } from "react-icons/fa";
import "./UnitCard.css";

// Only statistics that are really known are shown. The old card
// printed "0 Notes" and "0 Assignments" whenever a count was missing,
// which looked like real data.
const UnitCard = ({ unit, onClick }) => {
  if (!unit) return null;

  const hasMembers = typeof unit.members === "number";

  return (
    <div className="unit-card">
      <div className="unit-header">
        <div className="unit-icon">
          <FaBook />
        </div>

        <div className="unit-details">
          <h3>{unit.name || "Unnamed Unit"}</h3>
          <span>{unit.code || "No Unit Code"}</span>
        </div>
      </div>

      {unit.description && (
        <div className="unit-description">
          <p>{unit.description}</p>
        </div>
      )}

      {hasMembers && (
        <div className="unit-statistics">
          <div className="unit-stat">
            <FaUsers />
            <span>
              {unit.members} {unit.members === 1 ? "Member" : "Members"}
            </span>
          </div>
        </div>
      )}

      <button
        type="button"
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
