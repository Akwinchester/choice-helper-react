import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import {
  createSession,
  deleteSession,
  sendSwipe,
  fetchSwipesForSession,
  fetchSessionById,
  completeSession,
} from "../../api/sessionsApi";
import { fetchCards } from "../../api/cardsApi";
import { getUserInfo } from "../../api/auth";
import SessionAnalysisModal from "./SessionAnalysisModal";
import "../../styles/modals/SessionModal.css";


function SessionModal({ isOpen, onClose, boardId: boardIdProp, sessionId }) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [likedCards, setLikedCards] = useState([]);
  const [internalSessionId, setInternalSessionId] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [loading, setLoading] = useState(true); // 🆕
  const sessionCreated = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      sessionCreated.current = false;
      setInternalSessionId(null);
      setCards([]);
      setCurrentIndex(null);
      setLikedCards([]);
      setIsCompleted(false);
      setIsCreator(false);
      setLoading(true); // 🆕
      return;
    }

    const init = async () => {
      setLoading(true); // 🆕 старт загрузки
      try {
        const user = await getUserInfo();

        if (sessionId) {
          const sessionData = await fetchSessionById(sessionId);
          setInternalSessionId(sessionId);
          const boardId = sessionData.board_id;

          const allCards = await fetchCards(boardId);
          const swipes = await fetchSwipesForSession(sessionId);
          const userSwipes = swipes.filter((s) => s.user_id === user.id);

          const liked = userSwipes
            .filter((s) => s.liked)
            .map((s) => allCards.find((c) => c.id === s.card_id))
            .filter(Boolean);

          setLikedCards(liked);
          setIsCreator(sessionData.is_creator || false);

          if (sessionData.is_completed) {
            setIsCompleted(true);
            setCurrentIndex(null);
            return;
          }

          setCards(allCards);
          const swipedIds = userSwipes.map((s) => s.card_id);
          const nextIndex = allCards.findIndex((c) => !swipedIds.includes(c.id));
          setCurrentIndex(nextIndex === -1 ? null : nextIndex);
        } else if (!sessionCreated.current && boardIdProp) {
          const newSession = await createSession(boardIdProp);
          setInternalSessionId(newSession.id);
          sessionCreated.current = true;

          const allCards = await fetchCards(boardIdProp);
          setCards(allCards);
          setCurrentIndex(allCards.length > 0 ? 0 : null);
        }
      } catch (err) {
        console.error("Ошибка инициализации сессии", err);
      } finally {
        setLoading(false); // 🆕 завершение загрузки
      }
    };

    init();
  }, [isOpen, sessionId, boardIdProp]);

  const handleSwipe = async (direction) => {
    const currentCard = cards[currentIndex];
    const liked = direction === "right";

    if (internalSessionId && currentCard) {
      try {
        await sendSwipe(internalSessionId, currentCard.id, liked);
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
      try {
        await completeSession(internalSessionId);
      } catch (err) {
        console.error("Ошибка при отметке завершения:", err);
      }
      setIsCompleted(true);
      setCurrentIndex(null);
    }
  };

  const handleEarlyComplete = async () => {
    try {
      await completeSession(internalSessionId);
      setIsCompleted(true);
      setCurrentIndex(null);
    } catch (err) {
      console.error("Ошибка при досрочном завершении:", err);
    }
  };

  const handleFinishSession = async () => {
    try {
      if (internalSessionId && !sessionId) {
        await deleteSession(internalSessionId);
      }
    } catch (err) {
      console.error("Ошибка при завершении сессии:", err);
    }
    onClose();
  };

  const renderCard = (card) => (
    <div key={card.id} className="liked-card">
      {card.image_url ? (
        <img
          src={`http://127.0.0.1:8000/${card.image_url}`}
          alt={card.text}
          className="liked-card-image"
        />
      ) : (
        <div className="no-image">Нет изображения</div>
      )}
      <div className="liked-card-text">
        <strong>{card.text}</strong>
        <p>{card.short_description}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Загрузка */}
      {isOpen && loading && (
        <Modal isOpen={true} onClose={onClose}>
          <h2>Загрузка сессии...</h2>
        </Modal>
      )}

      {/* Основное окно — только после полной загрузки */}
      {isOpen && !loading && (
        <Modal isOpen={true} onClose={onClose}>
          {isCompleted || currentIndex === null ? (
            <div>
              <h3>Сессия завершена!</h3>
              {likedCards.length > 0 ? (
                <>
                  <p>Вы лайкнули следующие карточки:</p>
                  <div className="liked-cards-grid">
                    {likedCards.map(renderCard)}
                  </div>
                </>
              ) : (
                <p>Вы не выбрали ни одной карточки.</p>
              )}
              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <button
                  className="button blue"
                  onClick={() => setShowAnalysis(true)}
                >
                  Анализ сессии
                </button>
              </div>
            </div>
          ) : (
            <div className="session-card-container">
              <button className="arrow-button left" onClick={() => handleSwipe("left")}>
                ←
              </button>

              {cards[currentIndex] ? (
                <div className="session-card">
                  {cards[currentIndex].image_url ? (
                    <img
                      src={`http://127.0.0.1:8000/${cards[currentIndex].image_url}`}
                      alt={cards[currentIndex].text}
                      className="session-image"
                    />
                  ) : (
                    <div className="no-image">Нет изображения</div>
                  )}
                  <h3 className="session-title">{cards[currentIndex].text}</h3>
                  <p>{cards[currentIndex].short_description}</p>
                </div>
              ) : (
                <p>Загрузка карточки...</p>
              )}

              <button className="arrow-button right" onClick={() => handleSwipe("right")}>
                →
              </button>

              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <button className="button orange" onClick={handleEarlyComplete}>
                  Завершить сейчас
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {showAnalysis && (
        <SessionAnalysisModal
          isOpen={true}
          onClose={() => setShowAnalysis(false)}
          sessionId={internalSessionId}
        />
      )}
    </>
  );
}

export default SessionModal;
