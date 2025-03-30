// src/components/boards/BoardItem.jsx
import React from "react";

function BoardItem({ board, onSelect, onEdit, onDelete }) {
  return (
    <li onClick={() => onSelect(board.id)}>
      <div className="board-title">
        <strong>{board.title}</strong>
      </div>
      <div className="board-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="icon-button edit"
          onClick={(e) => onEdit(e, board)}
        >
          Редактировать
        </button>
        <button
          className="icon-button delete"
          onClick={(e) => onDelete(e, board.id)}
        >
          Удалить
        </button>
      </div>
    </li>
  );
}

export default BoardItem;
