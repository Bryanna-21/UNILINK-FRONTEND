import React, { useEffect, useState } from "react";
import {
  FaCloudUploadAlt,
  FaFileAlt,
  FaBook
} from "react-icons/fa";
import courseService from "../../services/courseService";
import noteService from "../../services/noteService";
import toast from "react-hot-toast";
import "./UploadNotes.css";

const UploadNotes = () => {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);

  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    unitId: "",
    file: null,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setCoursesLoading(true);
    try {
      const res = await courseService.getCourses();
      const courseList = res?.data ?? [];
      setCourses(courseList);
      await loadAllNotes(courseList);
    } catch (error) {
      toast.error("Could not load courses.");
    } finally {
      setCoursesLoading(false);
    }
  };

  // No backend endpoint returns notes across every course in one
  // call — notes are strictly course-scoped (GET /:courseId/notes).
  // "All notes, unfiltered" is built here by fetching per-course in
  // parallel and flattening the results, using the course list we
  // already have loaded for the dropdown.
  const loadAllNotes = async (courseList) => {
    setNotesLoading(true);
    try {
      const perCourse = await Promise.all(
        courseList.map(async (course) => {
          try {
            const res = await noteService.getNotesForCourse(course._id);
            return (res?.data ?? []).map((note) => ({
              ...note,
              courseTitle: course.title,
              courseCode: course.code,
            }));
          } catch {
            return [];
          }
        })
      );
      const flattened = perCourse.flat().sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotes(flattened);
    } catch (error) {
      toast.error("Could not load notes.");
    } finally {
      setNotesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.courseId) {
      toast.error("Please select a course.");
      return;
    }
    if (!formData.file) {
      toast.error("Please attach a file.");
      return;
    }

    setSubmitting(true);
    try {
      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      if (formData.unitId) uploadData.append("unitId", formData.unitId);
      uploadData.append("file", formData.file);

      await noteService.uploadNote(formData.courseId, uploadData);

      toast.success("Notes uploaded.");
      setFormData({ courseId: "", title: "", unitId: "", file: null });
      e.target.reset();
      loadAllNotes(courses);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not upload notes.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="upload-notes-page">
      <main className="upload-notes-content">
        <div className="upload-header">
          <h1>Upload Notes</h1>
          <p>Share learning materials with your students.</p>
        </div>

        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FaBook />
              Course
            </label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
              disabled={coursesLoading}
            >
              <option value="">
                {coursesLoading ? "Loading courses..." : "Select a course"}
              </option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title} ({course.code})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <FaFileAlt />
              Note Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter note title"
              required
            />
          </div>

          <div className="form-group">
            <label>Unit (optional)</label>
            <input
              type="text"
              name="unitId"
              value={formData.unitId}
              onChange={handleChange}
              placeholder="Unit ID, if this note belongs to a specific unit"
            />
          </div>

          <div className="file-upload">
            <label>
              <FaCloudUploadAlt />
              Upload PDF / Image
            </label>
            <input
              type="file"
              name="file"
              accept=".pdf,image/*"
              onChange={handleChange}
              required
            />
          </div>

          <button className="upload-button" type="submit" disabled={submitting}>
            {submitting ? "Uploading..." : "Upload Notes"}
          </button>
        </form>

        <div className="uploaded-notes-section">
          <h2>Your Uploaded Notes</h2>
          {notesLoading ? (
            <p>Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="no-notes-message">No notes uploaded yet.</p>
          ) : (
            <div className="uploaded-notes-list">
              {notes.map((note) => (
                
                <a
                  className="uploaded-note-entry"
                  key={note._id}
                  href={note.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFileAlt />
                  <div>
                    <span className="uploaded-note-title">{note.title}</span>
                    <span className="uploaded-note-course">
                      {note.courseTitle} ({note.courseCode})
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UploadNotes;
