import React from "react";
import { FaTrashAlt, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import Modal from "./Modal";

const DeleteModal = ({
  isOpen,
  title = "Delete Item",
  message = "This action cannot be undone. Are you sure you want to permanently delete this item?",
  deleteText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onDelete,
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
        className="danger"
        onClick={onDelete}
        disabled={loading}
      >
        <FaTrashAlt style={{ marginRight: "8px" }} />
        {loading ? "Deleting..." : deleteText}
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
      closeOnOverlay={!loading}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "18px",
        }}
      >
        <FaExclamationTriangle
          size={60}
          color="#dc2626"
        />

        <p
          style={{
            margin: 0,
            lineHeight: 1.8,
            fontSize: "15px",
          }}
        >
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default DeleteModal;
