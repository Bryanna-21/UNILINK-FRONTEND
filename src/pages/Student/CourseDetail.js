import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaBookOpen, FaUsers, FaComments, FaPaperPlane, FaFileAlt, FaClipboardList } from "react-icons/fa";
import courseService from "../../services/courseService";
import discussionService from "../../services/discussionService";
import unitService from "../../services/unitService";
import noteService from "../../services/noteService";
import catService from "../../services/catService";
import { useAuth } from "../../context/AuthContext";
import Skeleton from "../../components/common/Skeleton";
import Toast from "../../components/common/Toast";
import "./CourseDetail.css";

const TABS = [
  { key: "discussion", label: "Discussion", available: true },
  { key: "units", label: "Units", available: true },
  { key: "assignments", label: "Assignments", available: false },
  { key: "cats", label: "CATs", available: true },
  { key: "notes", label: "Notes", available: true },
];

const CourseDetail = () => {
  const { courseId } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState("discussion");
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const [entries, setEntries] = useState([]);
  const [discussionLoading, setDiscussionLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [units, setUnits] = useState([]);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [cats, setCats] = useState([]);
  const [catResults, setCatResults] = useState({});
  const [catsLoading, setCatsLoading] = useState(true);

  useEffect(() => {
    loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    if (activeTab === "discussion") {
      loadDiscussion();
    } else if (activeTab === "units") {
      loadUnits();
    } else if (activeTab === "notes") {
      loadNotes();
    } else if (activeTab === "cats") {
      loadCats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, courseId]);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const res = await courseService.getCourseById(courseId);
      setCourse(res?.data ?? null);
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not load this course." });
    } finally {
      setLoading(false);
    }
  };

  const loadDiscussion = async () => {
    setDiscussionLoading(true);
    try {
      const res = await discussionService.getDiscussion(courseId);
      setEntries(res?.data ?? []);
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not load discussion." });
    } finally {
      setDiscussionLoading(false);
    }
  };

  const loadUnits = async () => {
    setUnitsLoading(true);
    try {
      const res = await unitService.getUnitsForCourse(courseId);
      setUnits(res?.data ?? []);
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not load units." });
    } finally {
      setUnitsLoading(false);
    }
  };

  const loadNotes = async () => {
    setNotesLoading(true);
    try {
      const res = await noteService.getNotesForCourse(courseId);
      setNotes(res?.data ?? []);
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not load notes." });
    } finally {
      setNotesLoading(false);
    }
  };

  const loadCats = async () => {
    setCatsLoading(true);
    try {
      const res = await catService.getCatsForCourse(courseId);
      const courseCats = res?.data ?? [];
      setCats(courseCats);

      const resultEntries = await Promise.all(
        courseCats.map(async (cat) => {
          try {
            const resultRes = await catService.getMyResultForCat(cat._id);
            return [cat._id, resultRes?.data ?? null];
          } catch {
            return [cat._id, null];
          }
        })
      );
      setCatResults(Object.fromEntries(resultEntries));
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not load CATs." });
    } finally {
      setCatsLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const res = await courseService.enroll(courseId);
      setCourse(res?.data ?? course);
      setToast({ show: true, type: "success", message: "Enrolled successfully." });
    } catch (error) {
      setToast({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Could not enroll.",
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!draft.trim()) return;

    setPosting(true);
    try {
      const res = await discussionService.postToDiscussion(courseId, draft.trim());
      setEntries((prev) => [...prev, res.data]);
      setDraft("");
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not post." });
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return <Skeleton variant="card" count={1} />;
  }

  if (!course) {
    return (
      <div className="course-detail-empty">
        <FaBookOpen size={40} />
        <p>Course not found.</p>
      </div>
    );
  }

  const isEnrolled = !!user && course.enrolledStudentIds?.includes(user.id);

  return (
    <div className="course-detail-page">
      <div className="course-detail-header">
        <div>
          <h1>{course.title}</h1>
          <span className="course-detail-code">{course.code}</span>
          {course.description && <p className="course-detail-description">{course.description}</p>}
          <span className="course-detail-meta">
            <FaUsers /> {course.enrolledStudentIds?.length ?? 0} enrolled
          </span>
        </div>

        {isEnrolled ? (
          <span className="course-enrolled-tag">Enrolled</span>
        ) : (
          <button className="course-enroll-btn" onClick={handleEnroll} disabled={enrolling}>
            {enrolling ? "Enrolling..." : "Enroll"}
          </button>
        )}
      </div>

      <div className="course-detail-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? "course-tab active" : "course-tab"}
            onClick={() => tab.available && setActiveTab(tab.key)}
            disabled={!tab.available}
            title={tab.available ? "" : "Coming soon"}
          >
            {tab.label}
            {!tab.available && <span className="course-tab-soon">Soon</span>}
          </button>
        ))}
      </div>

      {activeTab === "discussion" && (
        <div className="course-discussion">
          {discussionLoading ? (
            <Skeleton variant="card" count={3} />
          ) : entries.length === 0 ? (
            <div className="course-discussion-empty">
              <FaComments size={32} />
              <p>No discussion posts yet. Be the first.</p>
            </div>
          ) : (
            <div className="course-discussion-list">
              {entries.map((entry) => (
                <div className="discussion-entry" key={entry._id}>
                  <span className="discussion-author">
                    {entry.userId === user?.id ? "You" : "Student"}
                  </span>
                  <p>{entry.content}</p>
                </div>
              ))}
            </div>
          )}

          <form className="course-discussion-composer" onSubmit={handlePost}>
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Reply to this course's discussion"
              disabled={posting}
            />
            <button type="submit" disabled={posting || !draft.trim()}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}

      {activeTab === "units" && (
        <div className="course-units">
          {unitsLoading ? (
            <Skeleton variant="card" count={3} />
          ) : units.length === 0 ? (
            <div className="course-units-empty">
              <FaBookOpen size={32} />
              <p>No units have been added to this course yet.</p>
            </div>
          ) : (
            <div className="course-units-list">
              {units.map((unit) => (
                <div className="unit-entry" key={unit._id}>
                  <h4>{unit.title}</h4>
                  {unit.description && <p>{unit.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "notes" && (
        <div className="course-notes">
          {notesLoading ? (
            <Skeleton variant="card" count={3} />
          ) : notes.length === 0 ? (
            <div className="course-notes-empty">
              <FaFileAlt size={32} />
              <p>No notes have been uploaded for this course yet.</p>
            </div>
          ) : (
            <div className="course-notes-list">
              {notes.map((note) => (
                
                <a
                  className="note-entry"
                  key={note._id}
                  href={note.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFileAlt />
                  <span>{note.title}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "cats" && (
        <div className="course-cats">
          {catsLoading ? (
            <Skeleton variant="card" count={3} />
          ) : cats.length === 0 ? (
            <div className="course-cats-empty">
              <FaClipboardList size={32} />
              <p>No CATs scheduled for this course yet.</p>
            </div>
          ) : (
            <div className="course-cats-list">
              {cats.map((cat) => {
                const result = catResults[cat._id];
                return (
                  <div className="cat-entry" key={cat._id}>
                    <div className="cat-entry-header">
                      <h4>{cat.title}</h4>
                      {result ? (
                        <span className="cat-score">
                          {result.score} / {cat.maxScore}
                        </span>
                      ) : (
                        <span className="cat-pending">Not graded yet</span>
                      )}
                    </div>
                    {cat.date && (
                      <span className="cat-meta">
                        {new Date(cat.date).toLocaleDateString()}
                      </span>
                    )}
                    {cat.venue && <span className="cat-meta">{cat.venue}</span>}
                    {cat.coverage && <p className="cat-coverage">{cat.coverage}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default CourseDetail;
