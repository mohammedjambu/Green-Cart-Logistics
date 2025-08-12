import React from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

const CustomModal = ({ isOpen, onRequestClose, children }) => {
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      border: "none",
      background: "#fff",
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      borderRadius: "8px",
      outline: "none",
      padding: "24px",
      maxWidth: "500px",
      width: "90%",
    },
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Action Modal"
    >
      {children}
    </ReactModal>
  );
};

export default CustomModal;
