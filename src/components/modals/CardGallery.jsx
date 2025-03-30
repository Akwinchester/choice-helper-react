// src/components/board/CardGallery.jsx
import React from "react";
import CardItem from "./CardItem";
import "../../styles/modals/CardGallery.css"; // создадим при необходимости

function CardGallery({ cards, onCardClick }) {
  if (!cards || cards.length === 0) {
    return <p>Пока нет карточек</p>;
  }

  return (
    <div className="card-gallery">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} onClick={() => onCardClick(card)} />
      ))}
    </div>
  );
}

export default CardGallery;
