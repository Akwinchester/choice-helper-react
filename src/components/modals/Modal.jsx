// src/components/Modal.jsx
import React from 'react';
import '../../styles/modals/ModalCommon.css'; // Для оформления модального окна

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null; // Если окно закрыто, ничего не рендерим

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Отображаем то, что передано внутрь компонента */}
        {children}

        {/* Кнопка закрыть (можно стилизовать отдельно) */}
        <button className="modal-close" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
}

export default Modal;
