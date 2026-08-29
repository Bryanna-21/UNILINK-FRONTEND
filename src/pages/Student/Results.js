import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import ExamResult from "../../components/exams/ExamResult";

import {
  getStudentResults,
} from "../../services/examService";

import "../../styles/exams.css";

const Results = () => {

  const [loading, setLoading] = useState(true);

  const [results, setResults] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const loadResults = async () => {

    try {

      setLoading(true);

      const data = await getStudentResults();

      setResults(data?.data ?? []);

    } catch (error) {

      toast.error("Unable to load results.");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadResults();

  }, []);
    const filteredResults = useMemo(() => {

    return results.filter((result) => {

      const searchMatch =

        result.examTitle
          .toLowerCase()
          .includes(search.toLowerCase());

      const filterMatch =

        filter === "All"

          ? true

          : result.status === filter;

      return searchMatch && filterMatch;

    });

  }, [results, search, filter]);

  const statistics = {

    total: results.length,

    passed: results.filter(

      (result) => result.status === "Passed"

    ).length,

    failed: results.filter(

      (result) => result.status === "Failed"

    ).length,

    average:

      results.length === 0

        ? 0

        : Math.round(

            results.reduce(

              (sum, result) =>

                sum +

                ((result.score /

                  result.totalMarks) *

                  100),

              0

            ) / results.length

          ),

  };
    const downloadResult = (result) => {

    toast.info(

      `Downloading ${result.examTitle}...`

    );

  };

  const printResult = () => {

    window.print();

  };
    return (

    <div className="student-results-page">

      <div className="page-header">

        <div>

          <h1>My Results</h1>

          <p>

            View examination performance and feedback.

          </p>

        </div>

        <div className="header-actions">

          <button
            className="btn btn-secondary"
            onClick={printResult}
          >
            Print Results
          </button>

          <Link
            to="/student/exams"
            className="btn btn-primary"
          >
            Back to Exams
          </Link>

        </div>

      </div>

      <div className="statistics-grid">

        <div className="stat-card">

          <h2>{statistics.total}</h2>

          <span>Total Exams</span>

        </div>

        <div className="stat-card">

          <h2>{statistics.passed}</h2>

          <span>Passed</span>

        </div>

        <div className="stat-card">

          <h2>{statistics.failed}</h2>

          <span>Failed</span>

        </div>

        <div className="stat-card">

          <h2>{statistics.average}%</h2>

          <span>Average Score</span>

        </div>

      </div>

      <div className="results-toolbar">

        <input
          type="text"
          className="form-control"
          placeholder="Search exam..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          className="form-control"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >

          <option value="All">
            All Results
          </option>

          <option value="Passed">
            Passed
          </option>

          <option value="Failed">
            Failed
          </option>

        </select>

      </div>

      {loading ? (

        <div className="loading-state">

          <h3>Loading results...</h3>

        </div>

      ) : filteredResults.length === 0 ? (

        <div className="empty-state">

          <h2>No Results Found</h2>

          <p>

            Your completed examinations will appear here.

          </p>

        </div>

      ) : (

        <div className="results-grid">

          {filteredResults.map((result) => (

            <div
              key={result._id}
              className="result-wrapper"
            >

              <ExamResult
                result={result}
              />

              <div className="result-actions">

                <button
                  className="btn btn-outline-primary"
                  onClick={() =>
                    downloadResult(result)
                  }
                >
                  Download
                </button>

              </div>

              {result.feedback && (

                <div className="feedback-card">

                  <h4>

                    Lecturer Feedback

                  </h4>

                  <p>

                    {result.feedback}

                  </p>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default Results;
