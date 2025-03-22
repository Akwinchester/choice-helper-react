import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "./Modal";
import CardDetailModal from "./CardDetailModal";
import SessionModal from "./SessionModal"; // ✅ Импортируем модалку сессии
import { updateCard } from "../../api/cardsApi"; // Импортируем API для обновления
import "../../styles/modals/BoardDetailModal.css";

function BoardDetailModal({ isOpen, onClose, boardDetail, cards, onDeleteCard, onOpenAddCardModal }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isSessionOpen, setIsSessionOpen] = useState(false); // ✅ Состояние для сессии
  const queryClient = useQueryClient();

  // ✅ useMutation вызывается на верхнем уровне
  const updateCardMutation = useMutation({
    mutationFn: ({ cardId, formData }) => updateCard(cardId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["cards", boardDetail?.id]); // Обновляем список карточек
    },
  });

  // ✅ Передаем функцию обновления карточки
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

      {/* Контейнер кнопок */}
      <div className="modal-buttons">
        <button className="modal-button" onClick={onOpenAddCardModal}>
          Добавить карточку
        </button>
        <button className="modal-button" onClick={() => setIsSessionOpen(true)}>
          Начать сессию
        </button>
      </div>

      {/* Модалка карточки */}
      {selectedCard && (
        <CardDetailModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        card={selectedCard}
        onUpdateCard={handleUpdateCard} 
        onDeleteCard={onDeleteCard}
        onCardUpdated={(updatedCard) => {
          // 🔄 Обновляем карточку в локальном состоянии
          setSelectedCard(updatedCard);
        }}
      />
      )}

      {/* Модалка сессии */}
      {isSessionOpen && (
        <SessionModal isOpen={isSessionOpen} onClose={() => setIsSessionOpen(false)} cards={cards} />
      )}
    </Modal>
  );
}

export default BoardDetailModal;
