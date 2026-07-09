import React, { useEffect, useMemo, useState } from "react";

import AcademicSidebar from "../../components/academic/AcademicSidebar";
import AssignmentCard from "../../components/academic/AssignmentCard";

import SearchBar from "../../components/common/SearchBar";
import Skeleton from "../../components/common/Skeleton";
import Pagination from "../../components/common/Pagination";
import Toast from "../../components/common/Toast";

import { FaClipboardList } from "react-icons/fa";

import "./Assignments.css";

// import assignmentService from "../../services/assignmentService";

const ITEMS_PER_PAGE = 6;

const Assignments = () => {

  const [assignments, setAssignments] = useState([]);

  const [filteredAssignments, setFilteredAssignments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [search, assignments]);

  const fetchAssignments = async () => {

    setLoading(true);

    try {

      /*
      const response =
        await assignmentService.getAssignments();

      setAssignments(response.data);
      setFilteredAssignments(response.data);
      */

      const demoAssignments = [

        {
          id: 1,
          title: "Database Design Project",
          unit: "CS202 - Database Management Systems",
          description:
            "Design a relational database system and submit documentation.",
          createdBy: "Dr. Mary Wanjiku",
          deadline: "15 July 2026",
          status: "Pending",
        },

        {
          id: 2,
          title: "Algorithm Analysis Report",
          unit: "CS201 - Data Structures and Algorithms",
          description:
            "Analyze different algorithms and compare performance.",
          createdBy: "Dr. James Kariuki",
          deadline: "20 July 2026",
          status: "Completed",
        },

        {
          id: 3,
          title: "Software Requirements Document",
          unit: "CS203 - Software Engineering",
          description:
            "Prepare system requirements documentation for a software project.",
          createdBy: "Mr. Peter Otieno",
          deadline: "25 July 2026",
          status: "Pending",
        },
                {
          id: 4,
          title: "Operating Systems Lab",
          unit: "CS301 - Operating Systems",
          description:
            "Implement process scheduling algorithms and submit the report.",
          createdBy: "Mr. Samuel Kiptoo",
          deadline: "30 July 2026",
          status: "Pending",
        },

        {
          id: 5,
          title: "Computer Networks Practical",
          unit: "CS305 - Computer Networks",
          description:
            "Configure network devices and submit screenshots with explanation.",
          createdBy: "Dr. Alice Chebet",
          deadline: "2 August 2026",
          status: "Completed",
        },

        {
          id: 6,
          title: "Artificial Intelligence Research",
          unit: "CS401 - Artificial Intelligence",
          description:
            "Write a research paper on machine learning applications.",
          createdBy: "Prof. John Koech",
          deadline: "10 August 2026",
          status: "Pending",
        },

      ];

      setAssignments(demoAssignments);
      setFilteredAssignments(demoAssignments);

    } catch (error) {

      console.error(error);

      setToast({
        show: true,
        type: "error",
        message: "Unable to load assignments.",
      });

    } finally {

      setLoading(false);

    }
  };

  const filterAssignments = () => {

    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      setFilteredAssignments(assignments);
      setCurrentPage(1);
      return;
    }

    const filtered = assignments.filter((assignment) =>

      assignment.title.toLowerCase().includes(keyword) ||

      assignment.unit.toLowerCase().includes(keyword) ||

      assignment.createdBy.toLowerCase().includes(keyword) ||

      assignment.status.toLowerCase().includes(keyword)

    );

    setFilteredAssignments(filtered);

    setCurrentPage(1);

  };

  const statistics = useMemo(() => {

    const completed = filteredAssignments.filter(
      (item) => item.status === "Completed"
    ).length;

    const pending = filteredAssignments.filter(
      (item) => item.status === "Pending"
    ).length;

    return {
      total: filteredAssignments.length,
      completed,
      pending,
    };

  }, [filteredAssignments]);

  const totalPages = Math.ceil(
    filteredAssignments.length / ITEMS_PER_PAGE
  );

  const lastIndex = currentPage * ITEMS_PER_PAGE;

  const firstIndex = lastIndex - ITEMS_PER_PAGE;

  const currentAssignments = filteredAssignments.slice(
    firstIndex,
    lastIndex
  );
    const handleAssignmentOpen = (assignment) => {

    console.log("Opening assignment:", assignment);

    /*
      Later:

      navigate(
        `/student/assignments/${assignment.id}`
      );

    */

  };

  return (

    <div className="assignments-page">

      <AcademicSidebar />

      <main className="assignments-content">

        <div className="assignments-header">

          <div>

            <h1>Assignments</h1>

            <p>
              View assignments, deadlines and submission status.
            </p>

          </div>

          <div className="assignments-summary">

            <div className="summary-card">

              <h2>{statistics.total}</h2>

              <span>Total</span>

            </div>

            <div className="summary-card">

              <h2>{statistics.pending}</h2>

              <span>Pending</span>

            </div>

            <div className="summary-card">

              <h2>{statistics.completed}</h2>

              <span>Completed</span>

            </div>

          </div>

        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search assignments..."
        />

        {loading ? (

          <Skeleton
            variant="card"
            count={6}
          />

        ) : currentAssignments.length === 0 ? (

          <div className="empty-assignments">

            <FaClipboardList size={60} />

            <h3>No Assignments Found</h3>

            <p>
              No assignment matches your search.
            </p>

          </div>

        ) : (

          <>

            <div className="assignments-grid">

              {currentAssignments.map((assignment) => (

                <AssignmentCard

                  key={assignment.id}

                  assignment={assignment}

                  onClick={handleAssignmentOpen}

                />

              ))}

            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

          </>

        )}

        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={() =>
            setToast((prev) => ({
              ...prev,
              show: false,
            }))
          }
        />

      </main>

    </div>

  );

};

export default Assignments;
