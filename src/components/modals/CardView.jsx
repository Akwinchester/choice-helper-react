// src/components/modals/CardView.jsx
import React from "react";

function CardView({ card, onEdit, onDelete }) {
  return (
    <div className="card-view centered">
      {card.image_url && (
        <img
          src={`http://127.0.0.1:8000/${card.image_url}`}
          alt={card.text}
          className="img-cover"
        />
      )}
      <h3>{card.text}</h3>
      <p>{card.short_description}</p>
      <button onClick={onEdit} className="button blue">Редактировать</button>
      <button onClick={onDelete} className="button red">Удалить</button>
    </div>
  );
}

export default CardView;
