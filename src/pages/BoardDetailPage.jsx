// src/pages/BoardDetailPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBoard } from '../api/boardsApi';
import { fetchCards, createCard, attachCardToBoard } from '../api/cardsApi';

// Импортируем общие стили (container, кнопки) и стили досок (cards-list)
import '../styles/main.css';
import '../styles/board.css';

function BoardDetailPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [newCardText, setNewCardText] = useState('');
  const [newCardDesc, setNewCardDesc] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState(null); // Добавляем state

  // Загрузка текущей доски
  const {
    data: boardData,
    isLoading: boardLoading,
    isError: boardError,
  } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoard(boardId),
  });

  // Загрузка карточек этой доски
  const {
    data: cards,
    isLoading: cardsLoading,
    isError: cardsError,
  } = useQuery({
    queryKey: ['cards', boardId],
    queryFn: () => fetchCards(boardId),
  });

  // Мутация для создания новой карточки
  const createCardMutation = useMutation({
    mutationFn: createCard,
    onSuccess: (createdCard) => {
      // После создания — привязать её к доске
      attachCardToBoardMutation.mutate({ boardId, cardId: createdCard.id });
    },
  });

  
  // Мутация для привязки карточки к доске
  const attachCardToBoardMutation = useMutation({
    mutationFn: ([boardId, cardId]) => attachCardToBoard(boardId, cardId),
    onSuccess: () => {
      queryClient.invalidateQueries(['boardDetail', selectedBoardId, 'cards']);
    },
  });
  // Обработка сабмита формы
  const handleCreateCard = (e) => {
    e.preventDefault();
    if (!newCardText.trim()) return;
    createCardMutation.mutate({
      text: newCardText,
      short_description: newCardDesc,
    });
  };

  // Пока загружаются данные
  if (boardLoading || cardsLoading) {
    return <div>Loading...</div>;
  }
  if (boardError || cardsError) {
    return <div>Error loading board or cards</div>;
  }

  return (
    <div className="container">
      <h1>{boardData.title}</h1>
      <p>{boardData.description}</p>

      <h2>Cards</h2>
      {cards && cards.length > 0 ? (
        <ul className="cards-list">
          {cards.map((card) => (
            <li key={card.id}>
              <strong>{card.text}</strong> – {card.short_description}
            </li>
          ))}
        </ul>
      ) : (
        <div>No cards yet.</div>
      )}

      <form onSubmit={handleCreateCard}>
        <input
          type="text"
          placeholder="Card Text"
          value={newCardText}
          onChange={(e) => setNewCardText(e.target.value)}
        />
        <textarea
          placeholder="Card Description"
          value={newCardDesc}
          onChange={(e) => setNewCardDesc(e.target.value)}
        />
        <button type="submit">Create Card</button>
      </form>

      <br />
      <button onClick={() => navigate('/')}>Go Back</button>
    </div>
  );
}

export default BoardDetailPage;
