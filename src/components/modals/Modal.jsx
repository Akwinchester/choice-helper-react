import React from 'react';
import '../../styles/modals/ModalCommon.css'; // Стили модалки

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
