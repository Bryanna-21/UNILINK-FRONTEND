import React from "react";
import "../../styles/components/button.css";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = "left",
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={[
        "app-button",
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? "btn-full" : "",
        disabled ? "btn-disabled" : "",
      ].join(" ")}
    >
      {loading ? (
        <span className="btn-spinner"></span>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="btn-icon">{icon}</span>
          )}

          <span>{children}</span>

          {icon && iconPosition === "right" && (
            <span className="btn-icon">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
