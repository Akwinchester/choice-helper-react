// src/components/board/CardItem.jsx
import React from "react";
import "../../styles/modals/CardItem.css"; // стили при необходимости

function CardItem({ card, onClick }) {
  return (
    <div className="card-item" onClick={onClick}>
      {card.image_url ? (
        <img
          src={`http://127.0.0.1:8000/${card.image_url}`}
          alt={card.text}
          className="card-image"
        />
      ) : (
        <div className="no-image">Нет изображения</div>
      )}
      <div className="card-text">
        <strong>{card.text}</strong>
      </div>
    </div>
  );
}

export default CardItem;
