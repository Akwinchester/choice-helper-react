import React, { useState } from 'react';
import Modal from './Modal';
import SessionModal from './SessionModal';
import './BoardDetailModal.css';

function BoardDetailModal({
  isOpen,
  onClose,
  boardDetail,
  cards,
  isLoading,
  isError,
  onOpenAddCardModal
}) {
  const [isSessionOpen, setIsSessionOpen] = useState(false);

  if (!boardDetail) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isLoading ? (
        <p>Загрузка...</p>
      ) : isError ? (
        <p>Ошибка при загрузке деталей</p>
      ) : (
        <>
          <h2>{boardDetail.title}</h2>
          <p>{boardDetail.description}</p>

          <h3>Карточки</h3>
          {cards && cards.length > 0 ? (
            <div className="card-gallery">
              {cards.map((card) => (
                <div key={card.id} className="card-item">
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
            <button className="modal-button" onClick={onOpenAddCardModal}>Добавить карточку</button>
            <button className="modal-button" onClick={() => setIsSessionOpen(true)}>Начать сессию</button>
          </div>

          {/* Модалка сессии */}
          <SessionModal isOpen={isSessionOpen} onClose={() => setIsSessionOpen(false)} cards={cards} />
        </>
      )}
    </Modal>
  );
}

export default BoardDetailModal;
