import React, { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";
import "./Toast.css";

const ICONS = {
  success: <FaCheckCircle />,
  error: <FaExclamationCircle />,
  info: <FaInfoCircle />,
  warning: <FaExclamationCircle />,
};

const Toast = ({ show, type = "success", message, onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className={`toast-common toast-${type}`} role="status">
      <span className="toast-common-icon">{ICONS[type] || ICONS.info}</span>
      <span className="toast-common-message">{message}</span>
      <button
        type="button"
        className="toast-common-close"
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;
