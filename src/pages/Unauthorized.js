import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        textAlign: "center",
        padding: "20px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "6rem", margin: 0, color: "#ef4444" }}>403</h1>
      <h2 style={{ fontSize: "2rem", color: "#475569", margin: "10px 0 20px" }}>
        Access Denied
      </h2>
      <p style={{ color: "#64748b", maxWidth: "450px", marginBottom: "30px", fontSize: "1.1rem" }}>
        You do not have permission to view this resource. Please contact your administrator if you believe this is an error.
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "12px 24px",
          fontSize: "1rem",
          fontWeight: "bold",
          backgroundColor: "#475569",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#334155")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#475569")}
      >
        Go Back Home
      </button>
    </div>
  );
}
