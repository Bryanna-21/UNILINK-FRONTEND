import React, { useState } from "react";
import "../../styles/components/input.css";

const Input = ({
  label = "",
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  success = "",
  disabled = false,
  required = false,
  icon = null,
  maxLength,
  showCounter = false,
  textarea = false,
  rows = 4,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="input-group">

      {label && (
        <label className="input-label">
          {label}
          {required && (
            <span className="required">*</span>
          )}
        </label>
      )}

      <div
        className={`input-wrapper ${
          error
            ? "input-error"
            : success
            ? "input-success"
            : ""
        }`}
      >

        {icon && (
          <span className="input-icon">
            {icon}
          </span>
        )}

        {textarea ? (
          <textarea
            rows={rows}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            maxLength={maxLength}
            className="app-input textarea"
          />
        ) : (
          <input
            type={inputType}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            maxLength={maxLength}
            className="app-input"
          />
        )}

        {type === "password" && (
          <button
            type="button"
            className="toggle-password"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {showCounter && maxLength && (
        <div className="character-counter">
          {value.length}/{maxLength}
        </div>
      )}

      {error && (
        <div className="error-text">
          {error}
        </div>
      )}

      {success && (
        <div className="success-text">
          {success}
        </div>
      )}
    </div>
  );
};

export default Input;
