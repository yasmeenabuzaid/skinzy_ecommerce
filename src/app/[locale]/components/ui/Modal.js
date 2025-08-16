"use client";

import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    // The modal backdrop
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose} // Close modal when clicking the backdrop
    >
      {/* The modal content */}
      <div
        className="bg-white p-6 rounded-lg shadow-xl relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the content
      >
        {/* The close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl font-light leading-none"
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;