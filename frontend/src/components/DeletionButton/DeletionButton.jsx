import React, { useState } from "react";

const DeleteButtonWithConfirmation = ({ onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleConfirmDelete = () => {
    onDelete();
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Delete button */}
      <button
        onClick={handleOpenModal}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
        title="Delete"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M3 6h18"></path>
          <path d="M19 6l-1.5 14.5a2 2 0 01-2 1.5H8.5a2 2 0 01-2-1.5L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2m-4 0h4"></path>
        </svg>
      </button>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this item?</p>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={handleCloseModal}
                style={{
                  padding: "10px 20px",
                  background: "#f0f0f0",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  padding: "10px 20px",
                  background: "#ff4d4f",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
  
  export default DeleteButtonWithConfirmation;