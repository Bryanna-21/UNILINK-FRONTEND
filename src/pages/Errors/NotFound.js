import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft, FaSearch } from "react-icons/fa";
import "../Errors.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-container">

        <div className="error-code">
          404
        </div>

        <h1 className="error-title">
          Page Not Found
        </h1>

        <p className="error-message">
          Sorry, the page you are looking for doesn't exist or may have been
          moved. Please check the URL or return to the dashboard.
        </p>

        <div
          style={{
            fontSize: "60px",
            color: "#2563eb",
            marginBottom: "30px",
          }}
        >
          <FaSearch />
        </div>

        <div className="error-actions">

          <button
            className="error-btn primary"
            onClick={() => navigate("/")}
          >
            <FaHome style={{ marginRight: "8px" }} />
            Home
          </button>

          <button
            className="error-btn secondary"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft style={{ marginRight: "8px" }} />
            Go Back
          </button>

        </div>

      </div>
    </div>
  );
};

export default NotFound;
