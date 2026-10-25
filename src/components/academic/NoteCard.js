import React from "react";
import "./NoteCard.css";

import {
  FaFilePdf,
  FaDownload,
  FaEye,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";

// Shows only what is actually known about a note. Optional fields
// (description, uploader, view and download counts) are left out when
// the backend does not provide them, rather than filled with
// placeholder text or zeros that look like real statistics.
const NoteCard = ({
  title,
  unit,
  description,
  fileType = "PDF",
  uploader,
  date,
  downloads,
  views,
  fileUrl,
  onDownload,
  onView,
}) => {
  const hasStats = views !== undefined || downloads !== undefined;

  return (
    <div className="note-card">
      <div className="note-card-header">
        <div className="note-icon">
          <FaFilePdf />
        </div>

        <div className="note-info">
          <h3>{title}</h3>
          <span className="note-type">
            {[fileType, unit].filter(Boolean).join(" · ")}
          </span>
        </div>
      </div>

      {description && (
        <div className="note-description">
          <p>{description}</p>
        </div>
      )}

      {(uploader || date) && (
        <div className="note-meta">
          {uploader && (
            <div className="meta-item">
              <FaUser />
              <span>{uploader}</span>
            </div>
          )}

          {date && (
            <div className="meta-item">
              <FaCalendarAlt />
              <span>{date}</span>
            </div>
          )}
        </div>
      )}

      {hasStats && (
        <div className="note-stats">
          {views !== undefined && <span>{views} views</span>}
          {downloads !== undefined && <span>{downloads} downloads</span>}
        </div>
      )}

      <div className="note-actions">
        <button
          type="button"
          className="view-note-btn"
          onClick={() => onView && onView(fileUrl)}
        >
          <FaEye />
          View
        </button>

        <button
          type="button"
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
