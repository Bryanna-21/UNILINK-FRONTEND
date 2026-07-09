import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaArrowLeft, FaHome } from "react-icons/fa";
import "./Error.css";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-container">

        <div className="error-code">
          403
        </div>

        <h1 className="error-title">
          Access Denied
        </h1>

        <p className="error-message">
          You do not have permission to access this page.
          If you believe this is an error, please contact your system administrator
          or sign in with an account that has the required permissions.
        </p>

        <div
          style={{
            fontSize: "60px",
            color: "#dc2626",
            marginBottom: "30px",
          }}
        >
          <FaLock />
        </div>

        <div className="error-actions">

          <button
            className="error-btn primary"
            onClick={() => navigate("/")}
          >
            <FaHome style={{ marginRight: "8px" }} />
            Dashboard
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

export default Unauthorized;
