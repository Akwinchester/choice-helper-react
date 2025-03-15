// src/pages/SessionPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { sendSwipe, deleteSession } from '../api/sessionsApi';
// Можно подтянуть fetchCards, fetchSwipesForSession, если нужно
import '../styles/main.css';
import '../styles/session.css';

function SessionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const sendSwipeMutation = useMutation(({ cardId, liked }) =>
    sendSwipe(sessionId, cardId, liked)
  );

  // Пример "заглушки" загрузки карточек
  useEffect(() => {
    async function loadSessionData() {
      // Ваш реальный запрос к серверу:
      // const data = await fetchCards(boardId) / fetchSwipesForSession(sessionId)
      // setCards(data);
      setCards([
        { id: 1, text: 'Card One', short_description: 'Desc 1' },
        { id: 2, text: 'Card Two', short_description: 'Desc 2' },
        { id: 3, text: 'Card Three', short_description: 'Desc 3' },
      ]);
    }
    loadSessionData();
  }, [sessionId]);

  const handleSwipe = (liked) => {
    if (currentCardIndex >= cards.length) return;
    const currentCard = cards[currentCardIndex];
    sendSwipeMutation.mutate({ cardId: currentCard.id, liked });
    setCurrentCardIndex((prev) => prev + 1);
  };

  const deleteSessionMutation = useMutation(() => deleteSession(sessionId), {
    onSuccess: () => {
      alert('Session ended');
      navigate('/');
    },
  });

  if (cards.length === 0) {
    return <div className="container">Loading or no cards...</div>;
  }

  const currentCard = cards[currentCardIndex];
  if (!currentCard) {
    return (
      <div className="container">
        <h2>No more cards</h2>
        <button onClick={() => deleteSessionMutation.mutate()}>
          Finish Session
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Session Page (ID: {sessionId})</h1>

      {/* Можно обернуть всё в .session-container, если желаете оверлей */}
      {/* <div className="session-container"> ... </div> */}

      <div style={{ border: '1px solid #ccc', padding: '10px' }}>
        <h2>{currentCard.text}</h2>
        <p>{currentCard.short_description}</p>
      </div>

      <br />
      <button onClick={() => handleSwipe(false)}>Dislike</button>
      <button onClick={() => handleSwipe(true)}>Like</button>

      <br />
      <br />
      <button onClick={() => deleteSessionMutation.mutate()}>
        End Session
      </button>
    </div>
  );
}

export default SessionPage;
