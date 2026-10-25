import React from "react";
import "../../styles/pages/lists.css";

// Honest loading / error / empty states for pages that read real data.
// kind: "loading" | "error" | "empty"
export default function StateMessage({ kind = "empty", title, text, action }) {
  return (
    <div
      className={`state-message state-message--${kind}`}
      role={kind === "error" ? "alert" : "status"}
    >
      {title && <h3>{title}</h3>}
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}
