// src/components/board/BoardActionButtons.jsx
import React from "react";
import "../../styles/modals/BoardActionButtons.css"; // стили если надо

function BoardActionButtons({ onAddCard, onStartSession, onViewSessions }) {
  return (
    <div className="modal-buttons">
      <button className="modal-button" onClick={onAddCard}>
        Добавить карточку
      </button>
      <button className="modal-button" onClick={onStartSession}>
        Начать сессию
      </button>
      <button className="modal-button" onClick={onViewSessions}>
        Сессии этой доски
      </button>
    </div>
  );
}

export default BoardActionButtons;
