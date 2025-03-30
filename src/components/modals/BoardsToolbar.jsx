// src/components/boards/BoardsToolbar.jsx
import React from "react";

function BoardsToolbar({ onCreate, onInvites }) {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
      <button className="button blue" onClick={onInvites}>Приглашения</button>
      <button className="button green" onClick={onCreate}>Создать доску</button>
    </div>
  );
}

export default BoardsToolbar;
