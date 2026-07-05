import { useNavigate } from "react-router-dom";

export default function NotFound() {
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
      <h1 style={{ fontSize: "6rem", margin: 0, color: "#1e293b" }}>404</h1>
      <h2 style={{ fontSize: "2rem", color: "#475569", margin: "10px 0 20px" }}>
        Page Not Found
      </h2>
      <p style={{ color: "#64748b", maxWidth: "450px", marginBottom: "30px", fontSize: "1.1rem" }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "12px 24px",
          fontSize: "1rem",
          fontWeight: "bold",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
      >
        Go Back Home
      </button>
    </div>
  );
}
