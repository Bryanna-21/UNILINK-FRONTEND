import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import SubmissionCard from "../../components/exams/SubmissionCard";

import {
  getExamSubmissions,
} from "../../services/examService";

import "../../styles/exams.css";

const GradeSubmissions = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [submissions, setSubmissions] = useState([]);

  const loadSubmissions = async () => {

    try {

      setLoading(true);

      const data = await getExamSubmissions();

      setSubmissions(data || []);

    } catch (error) {

      toast.error("Unable to load submissions.");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadSubmissions();

  }, []);
 const filteredSubmissions = useMemo(() => {

  return submissions.filter((submission) => {

    const studentName =
      submission.student?.name || "";

    const admission =
      submission.student?.admissionNumber || "";

    const searchMatch =

      studentName
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      admission
        .toLowerCase()
        .includes(search.toLowerCase());

    const statusMatch =

      filter === "All"

        ? true

        // "Graded" isn't a stored status - ExamResult.status is only
        // ever Pending/Passed/Failed. A graded submission is simply
        // one that's no longer Pending, so match on that instead of
        // a literal string that would never appear in the data.
        : filter === "Graded"

        ? submission.status === "Passed" || submission.status === "Failed"

        : submission.status === filter;

    return searchMatch && statusMatch;

  });

}, [submissions, search, filter]);

const stats = {

  total: submissions.length,

  graded: submissions.filter(

    (s) => s.status === "Passed" || s.status === "Failed"

  ).length,

  pending: submissions.filter(

    (s) => s.status === "Pending"

  ).length,

};
  const handleGrade = (submissionId) => {

  navigate(

    `/lecturer/submissions/${submissionId}`

  );

};
 return (

<div className="grade-submissions-page">

<div className="page-header">

<h1>Grade Submissions</h1>

<p>
Review and grade student exam submissions.
</p>

</div>

<div className="statistics-grid">

<div className="stat-card">

<h2>{stats.total}</h2>

<span>Total</span>

</div>

<div className="stat-card">

<h2>{stats.pending}</h2>

<span>Pending</span>

</div>

<div className="stat-card">

<h2>{stats.graded}</h2>

<span>Graded</span>

</div>

</div>

<div className="toolbar">

<input
type="text"
className="form-control"
placeholder="Search Student..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select
className="form-control"
value={filter}
onChange={(e)=>setFilter(e.target.value)}
>

<option value="All">
All
</option>

<option value="Pending">
Pending
</option>

<option value="Graded">
Graded
</option>

</select>

</div>

{loading ? (

<div className="loading-state">

Loading submissions...

</div>

) : filteredSubmissions.length === 0 ? (

<div className="empty-state">

<h2>No submissions found.</h2>

</div>

) : (

<div className="submission-grid">

{filteredSubmissions.map((submission)=>(

<SubmissionCard

key={submission._id}

submission={submission}

onGrade={handleGrade}

/>

))}

</div>

)}

</div>

);

};

export default GradeSubmissions; 
