// src/components/modals/SessionModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import {
  createSession,
  deleteSession,
  sendSwipe,
  fetchSwipesForSession,
} from '../../api/sessionsApi';
import { fetchCards } from '../../api/cardsApi';
import '../../styles/modals/SessionModal.css';

function SessionModal({ isOpen, onClose, boardId, sessionId: existingSessionId, cards: externalCards }) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCards, setLikedCards] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const sessionCreated = useRef(false);
  const cardsLoaded = useRef(false);

  const loadCards = async () => {
    try {
      const loaded = await fetchCards(boardId);
      setCards(loaded);
    } catch (err) {
      console.error("❌ Ошибка при загрузке карточек:", err);
    }
  };

  const loadSwipes = async (id, cardsList) => {
    try {
      const swipes = await fetchSwipesForSession(id);
      const liked = swipes
        .filter((s) => s.liked)
        .map((s) => cardsList.find((c) => c.id === s.card_id))
        .filter(Boolean);

      setLikedCards(liked);

      const swipedIds = swipes.map((s) => s.card_id);
      const nextIndex = cardsList.findIndex((c) => !swipedIds.includes(c.id));
      setCurrentIndex(nextIndex !== -1 ? nextIndex : null);
    } catch (err) {
      console.error("Ошибка при загрузке свайпов:", err);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      sessionCreated.current = false;
      cardsLoaded.current = false;
      setSessionId(null);
      setCards([]);
      setCurrentIndex(0);
      setLikedCards([]);
      return;
    }

    const init = async () => {
      // 1. Загружаем карточки если их не передали
      const cardsToUse = externalCards && externalCards.length > 0 ? externalCards : await fetchCards(boardId);
      setCards(cardsToUse);

      // 2. Существующая сессия
      if (existingSessionId) {
        setSessionId(existingSessionId);
        await loadSwipes(existingSessionId, cardsToUse);
      } else {
        // 3. Создаём новую сессию
        const session = await createSession(boardId);
        setSessionId(session.id);
        setCurrentIndex(0);
      }
    };

    if (!sessionCreated.current && boardId) {
      sessionCreated.current = true;
      init();
    }
  }, [isOpen, boardId, existingSessionId, externalCards]);

  const handleSwipe = async (direction) => {
    const currentCard = cards[currentIndex];
    const liked = direction === 'right';

    if (sessionId && currentCard) {
      try {
        await sendSwipe(sessionId, currentCard.id, liked);
      } catch (err) {
        console.error("Ошибка при отправке свайпа:", err);
      }
    }

    if (liked) {
      setLikedCards((prev) => [...prev, currentCard]);
    }

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(null); // конец
    }
  };

  const handleFinishSession = async () => {
    try {
      if (sessionId && !existingSessionId) {
        await deleteSession(sessionId);
      }
    } catch (err) {
      console.error("Ошибка при удалении сессии:", err);
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
            {cards[currentIndex]?.image_url && (
              <img
                src={`http://127.0.0.1:8000/${cards[currentIndex].image_url}`}
                alt={cards[currentIndex].text}
                className="session-image"
              />
            )}
            <h3 className="session-title">{cards[currentIndex]?.text}</h3>
            <p className="session-desc">{cards[currentIndex]?.short_description}</p>
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
          {!existingSessionId && (
          <button className="button green" onClick={handleFinishSession}>
            Завершить и удалить сессию
          </button>
)}

        </div>
      )}
    </Modal>
  );
}

export default SessionModal;
