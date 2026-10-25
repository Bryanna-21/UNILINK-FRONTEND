import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NoteCard from "../../components/academic/NoteCard";
import Skeleton from "../../components/common/Skeleton";
import StateMessage from "../../components/common/StateMessage";

import courseService from "../../services/courseService";
import noteService from "../../services/noteService";

import { getErrorMessage } from "../../utils/errors";
import { notify } from "../../utils/notify";
import { formatDate, isSafeUrl, unitLabel } from "../../utils/format";

import "./Notes.css";

const FILE_LABELS = {
  pdf: "PDF",
  image: "Image",
  doc: "DOC",
  docx: "DOCX",
};

// Study notes from the units the student is enrolled in. Everything on
// this page comes from GET /courses and GET /courses/:id/notes.
const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [hasUnits, setHasUnits] = useState(true);
  const [skipped, setSkipped] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await courseService.getCourses();
      const courses = Array.isArray(response?.data) ? response.data : [];

      setHasUnits(courses.length > 0);

      const results = await Promise.allSettled(
        courses.map((course) => noteService.getNotesForCourse(course._id))
      );

      const collected = [];
      let failed = 0;

      results.forEach((result, index) => {
        if (result.status !== "fulfilled") {
          failed += 1;
          return;
        }

        const course = courses[index];
        const items = Array.isArray(result.value?.data) ? result.value.data : [];

        items.forEach((note) => {
          collected.push({
            id: note._id,
            title: note.title,
            unit: unitLabel(course),
            fileType: FILE_LABELS[note.fileType] || "File",
            date: formatDate(note.createdAt),
            createdAt: note.createdAt,
            fileUrl: note.fileUrl,
          });
        });
      });

      collected.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      setNotes(collected);
      setSkipped(failed);
    } catch (err) {
      setNotes([]);
      setError(getErrorMessage(err, "We couldn't load your notes."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openFile = (url) => {
    if (!isSafeUrl(url)) {
      notify.error("This file can't be opened.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="notes-page">
      <main className="notes-content">
        <div className="notes-header">
          <h1>Study Notes</h1>
          <p>Notes uploaded by lecturers for the units you are enrolled in.</p>
        </div>

        {loading ? (
          <Skeleton variant="card" count={3} />
        ) : error ? (
          <StateMessage
            kind="error"
            title="Notes unavailable"
            text={error}
            action={
              <button type="button" className="list-btn" onClick={load}>
                Try again
              </button>
            }
          />
        ) : !hasUnits ? (
          <StateMessage
            title="No units yet"
            text="Add your units to see the notes lecturers have shared for them."
            action={
              <Link className="list-btn" to="/student/courses">
                Go to my courses
              </Link>
            }
          />
        ) : notes.length === 0 ? (
          <StateMessage
            title="No notes yet"
            text="Your lecturers haven't uploaded any notes for your units."
          />
        ) : (
          <>
            {skipped > 0 && (
              <p className="list-hint">
                Notes for {skipped} of your units could not be loaded.
              </p>
            )}

            <div className="notes-grid">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  title={note.title}
                  unit={note.unit}
                  fileType={note.fileType}
                  date={note.date}
                  fileUrl={note.fileUrl}
                  onView={openFile}
                  onDownload={openFile}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Notes;
