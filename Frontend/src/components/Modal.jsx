import React from "react";
import ReactModal from "react-modal";

// Set the app element for accessibility
ReactModal.setAppElement("#root");

const CustomModal = ({ isOpen, onRequestClose, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Action Modal"
      className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      {children}
    </ReactModal>
  );
};

export default CustomModal;
