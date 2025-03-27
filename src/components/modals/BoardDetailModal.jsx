// src/components/modals/BoardDetailModal.jsx
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "./Modal";
import CardDetailModal from "./CardDetailModal";
import SessionModal from "./SessionModal";
import BoardSessionsModal from "./BoardSessionsModal";
import { updateCard } from "../../api/cardsApi";
import "../../styles/modals/BoardDetailModal.css";

function BoardDetailModal({ isOpen, onClose, boardDetail, cards, onDeleteCard, onOpenAddCardModal }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateCardMutation = useMutation({
    mutationFn: ({ cardId, formData }) => updateCard(cardId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["cards", boardDetail?.id]);
    },
  });

  const handleUpdateCard = (cardId, formData) => {
    updateCardMutation.mutate({ cardId, formData });
  };

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
          ))}
        </div>
      ) : (
        <p>Пока нет карточек</p>
      )}

      <div className="modal-buttons">
        <button className="modal-button" onClick={onOpenAddCardModal}>
          Добавить карточку
        </button>
        <button className="modal-button" onClick={() => setIsSessionOpen(true)}>
          Начать сессию
        </button>
        <button className="modal-button" onClick={() => setIsSessionsModalOpen(true)}>
          Сессии этой доски
        </button>
      </div>

      {selectedCard && (
        <CardDetailModal
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          card={selectedCard}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={onDeleteCard}
          onCardUpdated={(updatedCard) => {
            setSelectedCard(updatedCard);
          }}
        />
      )}

      {isSessionOpen && (
        <SessionModal
          isOpen={isSessionOpen}
          onClose={() => setIsSessionOpen(false)}
          cards={cards}
          boardId={boardDetail.id}
        />
      )}

      {isSessionsModalOpen && (
        <BoardSessionsModal
          isOpen={isSessionsModalOpen}
          onClose={() => setIsSessionsModalOpen(false)}
          boardId={boardDetail.id}
        />
      )}
    </Modal>
  );
}

export default BoardDetailModal;
