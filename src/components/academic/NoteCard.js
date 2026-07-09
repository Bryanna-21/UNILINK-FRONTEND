import React from "react";
import "./NoteCard.css";
import {
  FaFilePdf,
  FaDownload,
  FaEye,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";

const NoteCard = ({
  title,
  description,
  fileType = "PDF",
  uploader,
  date,
  downloads = 0,
  views = 0,
  fileUrl,
  onDownload,
  onView,
}) => {
  return (
    <div className="note-card">

      <div className="note-card-header">
        <div className="note-icon">
          <FaFilePdf />
        </div>

        <div className="note-info">
          <h3>{title}</h3>
          <span className="note-type">{fileType}</span>
        </div>
      </div>


      <div className="note-description">
        <p>
          {description || "No description available for this note."}
        </p>
      </div>


      <div className="note-meta">

        <div className="meta-item">
          <FaUser />
          <span>{uploader || "Unknown uploader"}</span>
        </div>

        <div className="meta-item">
          <FaCalendarAlt />
          <span>{date || "No date"}</span>
        </div>

      </div>


      <div className="note-stats">

        <span>
          {views} views
        </span>

        <span>
          {downloads} downloads
        </span>

      </div>


      <div className="note-actions">

        <button
          className="view-note-btn"
          onClick={() => onView && onView(fileUrl)}
        >
          <FaEye />
          View
        </button>


        <button
          className="download-note-btn"
          onClick={() => onDownload && onDownload(fileUrl)}
        >
          <FaDownload />
          Download
        </button>

      </div>

    </div>
  );
};


export default NoteCard;
