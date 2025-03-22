import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import '../../styles/modals/SessionModal.css';

function SessionModal({ isOpen, onClose, cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCards, setLikedCards] = useState([]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        handleSwipe('right');
      } else if (event.key === 'ArrowLeft') {
        handleSwipe('left');
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, likedCards]);

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
              <img src={`http://127.0.0.1:8000/${cards[currentIndex].image_url}`} alt={cards[currentIndex].text} />
            )}
            <h3>{cards[currentIndex].text}</h3>
            <p>{cards[currentIndex].short_description}</p>
          </div>

          <button className="arrow-button right" onClick={() => handleSwipe('right')}>→</button>
        </div>
      ) : (
        <div>
          <h3>Сессия завершена!</h3>
          <h4>Лайкнутые карточки:</h4>
          {likedCards.length > 0 ? (
            <div className="liked-gallery">
              {likedCards.map((card) => (
                <div key={card.id} className="liked-card">
                  {card.image_url && <img src={`http://127.0.0.1:8000/${card.image_url}`} alt={card.text} />}
                  <strong>{card.text}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p>Вы не лайкнули ни одной карточки.</p>
          )}
          <button className="end-session" onClick={onClose}>Закончить сессию</button>
        </div>
      )}
    </Modal>
  );
}

export default SessionModal;
