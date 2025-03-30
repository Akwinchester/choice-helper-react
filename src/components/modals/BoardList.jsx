// src/components/boards/BoardList.jsx
import React from "react";
import BoardItem from "./BoardItem";

function BoardList({ boards, onSelect, onEdit, onDelete }) {
  return (
    <ul className="boards-list">
      {boards?.map((board) => (
        <BoardItem
          key={board.id}
          board={board}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default BoardList;
