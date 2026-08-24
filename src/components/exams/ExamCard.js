import React from "react";
import { Link } from "react-router-dom";

const formatDate = (date) => date ? new Date(date).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" }) : "N/A";
const statusClass = (status) => ({ published: "published", draft: "draft", closed: "closed", completed: "completed" }[(status || "").toLowerCase()] || "pending");

export default function ExamCard({ exam }) {
  if (!exam) return null;
  return <div className="exam-card">
    <div className="exam-card-header"><div><h2>{exam.title}</h2><p>{exam.course}</p></div><span className={`exam-status ${statusClass(exam.status)}`}>{exam.status || "Draft"}</span></div>
    <div className="exam-card-body"><p>{exam.description}</p><div className="exam-meta"><div><strong>Duration</strong><span>{exam.duration} mins</span></div><div><strong>Total Marks</strong><span>{exam.totalMarks}</span></div><div><strong>Questions</strong><span>{exam.questions?.length || 0}</span></div><div><strong>Starts</strong><span>{formatDate(exam.startTime)}</span></div><div><strong>Ends</strong><span>{formatDate(exam.endTime)}</span></div></div></div>
    <div className="exam-card-footer"><Link to={`/student/exams/${exam._id}`} className="btn btn-primary">Open</Link>{exam.status === "Published" && <Link to={`/student/exams/${exam._id}/take`} className="btn btn-success">Take Exam</Link>}</div>
  </div>;
}
