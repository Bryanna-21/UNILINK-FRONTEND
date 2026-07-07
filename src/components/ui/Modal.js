import React, { useEffect } from "react";
import "../../styles/components/modal.css";

const Modal = ({
  isOpen = false,
  title = "",
  children,
  footer = null,
  size = "medium",
  closeOnOverlay = true,
  showCloseButton = true,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        if (closeOnOverlay) {
          onClose?.();
        }
      }}
    >
      <div
        className={`modal-container modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">

          <h2>{title}</h2>

          {showCloseButton && (
            <button
              className="modal-close"
              onClick={onClose}
            >
              ×
            </button>
          )}

        </div>

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}

      </div>
    </div>
  );
};

export default Modal;
