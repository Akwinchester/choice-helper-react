import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/BoardsHeader.css";

function BoardsHeader({ username, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="header">
      <h1>Доски</h1>
      <div className="user-menu-wrapper" onMouseLeave={() => setMenuOpen(false)}>
        <span className="username" onClick={toggleMenu}>{username}</span>
        {menuOpen && (
          <div className="user-dropdown">
            <button onClick={() => navigate("/friends")}>Друзья</button>
            <button className="red" onClick={onLogout}>Выйти</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardsHeader;
