import React from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import Modal from "./Modal";

const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "primary",
  loading = false,
  onConfirm,
  onClose,
}) => {
  const footer = (
    <>
      <button
        className="secondary"
        onClick={onClose}
        disabled={loading}
      >
        <FaTimes style={{ marginRight: "8px" }} />
        {cancelText}
      </button>

      <button
        className={confirmButtonClass}
        onClick={onConfirm}
        disabled={loading}
      >
        <FaCheckCircle style={{ marginRight: "8px" }} />

        {loading ? "Please wait..." : confirmText}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      footer={footer}
      size="small"
    >
      <p
        style={{
          margin: 0,
          lineHeight: 1.8,
          fontSize: "15px",
        }}
      >
        {message}
      </p>
    </Modal>
  );
};

export default ConfirmModal;
