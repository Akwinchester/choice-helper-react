// src/components/modals/BracketCard.jsx
import React from "react";
import "../../styles/modals/BracketCard.css";

function BracketCard({ card, onClick, disabled = false }) {
  return (
    <div
      className={`bracket-card ${disabled ? "disabled" : ""}`}
      onClick={() => !disabled && onClick(card.id)}
    >
      {card.image_url ? (
        <img
          src={`http://127.0.0.1:8000/${card.image_url}`}
          alt={card.text}
          className="bracket-card-image"
        />
      ) : (
        <div className="no-image">Нет изображения</div>
      )}
      <div className="bracket-card-info">
        <h4>{card.text}</h4>
        <p>{card.short_description}</p>
      </div>
    </div>
  );
}

export default BracketCard;
