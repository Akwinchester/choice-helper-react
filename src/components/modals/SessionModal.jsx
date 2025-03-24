import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { createSession, deleteSession } from '../../api/sessionsApi';
import '../../styles/modals/SessionModal.css';

function SessionModal({ isOpen, onClose, cards = [], boardId }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCards, setLikedCards] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const sessionCreated = useRef(false); // 👈 флаг, чтобы избежать дублирования

  useEffect(() => {
    if (isOpen && boardId && !sessionCreated.current) {
      sessionCreated.current = true; // 👈 создаём только один раз
      createSession(boardId)
        .then((data) => {
          setSessionId(data.id);
        })
        .catch((err) => {
          console.error("Ошибка при создании сессии:", err);
        });
    }

    // Очистка флага при закрытии модалки
    if (!isOpen) {
      sessionCreated.current = false;
      setSessionId(null);
      setCurrentIndex(0);
      setLikedCards([]);
    }
  }, [isOpen, boardId]);

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      setLikedCards([...likedCards, cards[currentIndex]]);
    }

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(null);
    }
  };

  const handleFinishSession = async () => {
    try {
      if (sessionId) {
        await deleteSession(sessionId);
        setSessionId(null);
      }
    } catch (err) {
      console.error("❌ Ошибка при удалении сессии:", err);
    }
    onClose();
  };

  if (!cards || cards.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <p>Нет доступных карточек для сессии.</p>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {currentIndex !== null ? (
        <div className="session-card-container">
          <button className="arrow-button left" onClick={() => handleSwipe('left')}>←</button>

          <div className="session-card">
            {cards[currentIndex].image_url && (
              <img
                src={`http://127.0.0.1:8000/${cards[currentIndex].image_url}`}
                alt={cards[currentIndex].text}
                className="session-image"
              />
            )}
            <h3 className="session-title">{cards[currentIndex].text}</h3>
            <p className="session-desc">{cards[currentIndex].short_description}</p>
          </div>

          <button className="arrow-button right" onClick={() => handleSwipe('right')}>→</button>
        </div>
      ) : (
        <div className="session-end">
          <h3>Сессия завершена!</h3>
          <h4>Лайкнутые карточки:</h4>
          {likedCards.length > 0 ? (
            <div className="liked-gallery">
              {likedCards.map((card) => (
                <div key={card.id} className="liked-card">
                  {card.image_url && (
                    <img
                      src={`http://127.0.0.1:8000/${card.image_url}`}
                      alt={card.text}
                      className="liked-image"
                    />
                  )}
                  <strong>{card.text}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p>Вы не лайкнули ни одной карточки.</p>
          )}
          <button className="button green" onClick={handleFinishSession}>Закончить сессию</button>
        </div>
      )}
    </Modal>
  );
}

export default SessionModal;
