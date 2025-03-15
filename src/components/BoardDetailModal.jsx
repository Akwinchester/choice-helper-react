import React, { useState } from "react";
import Modal from "./Modal";
import CardDetailModal from "./CardDetailModal";
import "./BoardDetailModal.css";

function BoardDetailModal({ isOpen, onClose, boardDetail, cards, onUpdateCard, onDeleteCard }) {
  const [selectedCard, setSelectedCard] = useState(null);

  if (!boardDetail) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>{boardDetail.title}</h2>
      <p>{boardDetail.description}</p>

      <h3>Карточки</h3>
      {cards && cards.length > 0 ? (
        <div className="card-gallery">
          {cards.map((card) => (
            <div key={card.id} className="card-item" onClick={() => setSelectedCard(card)}>
              {card.image_url ? (
                <img src={`http://127.0.0.1:8000/${card.image_url}`} alt={card.text} className="card-image" />
              ) : (
                <div className="no-image">Нет изображения</div>
              )}
              <div className="card-text">
                <strong>{card.text}</strong>
                <p>{card.short_description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Пока нет карточек</p>
      )}

      <button onClick={onClose}>Закрыть</button>

      {/* Модалка карточки */}
      {selectedCard && (
        <CardDetailModal
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          card={selectedCard}
          onUpdateCard={onUpdateCard}
          onDeleteCard={onDeleteCard} // ✅ Теперь передается
        />
      )}
    </Modal>
  );
}

export default BoardDetailModal;
