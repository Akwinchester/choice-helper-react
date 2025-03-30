// src/components/boards/BoardsHeader.jsx
import React from "react";

function BoardsHeader({ username, onLogout }) {
  return (
    <div className="header">
      <h1>Доски</h1>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
        <span>{username}</span>
        <button className="button red small" onClick={onLogout}>Выйти</button>
      </div>
    </div>
  );
}

export default BoardsHeader;
