import React from "react";
import {
  FaFilePdf,
  FaDownload,
  FaUser,
  FaCalendarAlt,
  FaEye
} from "react-icons/fa";
import "./NoteCard.css";

const NoteCard = ({ note, onView, onDownload }) => {
  if (!note) return null;

  return (
    <div className="note-card">

      <div className="note-header">

        <div className="note-file-icon">
          <FaFilePdf />
        </div>

        <div className="note-information">
          <h3>
            {note.title || "Untitled Note"}
          </h3>

          <span>
            {note.unit || "Unknown Unit"}
          </span>
        </div>

      </div>


      <div className="note-description">

        <p>
          {note.description ||
            "Academic notes uploaded for student learning and revision."}
        </p>

      </div>


      <div className="note-details">

        <div className="note-detail">
          <FaUser />
          <span>
            {note.uploadedBy || "Unknown Lecturer"}
          </span>
        </div>


        <div className="note-detail">
          <FaCalendarAlt />
          <span>
            {note.date || "No Date"}
          </span>
        </div>


        <div className="note-detail">
          <FaEye />
          <span>
            {note.views || 0} Views
          </span>
        </div>

      </div>


      <div className="note-actions">

        <button
          className="view-note"
          onClick={() => onView && onView(note)}
        >
          <FaEye />
          View
        </button>


        <button
          className="download-note"
          onClick={() => onDownload && onDownload(note)}
        >
          <FaDownload />
          Download
        </button>

      </div>

    </div>
  );
};


export default NoteCard;
