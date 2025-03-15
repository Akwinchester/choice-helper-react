// src/pages/BoardsPage.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchBoards,
  createBoard,
  deleteBoard,
  fetchBoard,
  updateBoard  // <-- не забудьте импортировать
} from '../api/boardsApi';
import {
  fetchCards,
  createCard,
  attachCardToBoard
} from '../api/cardsApi';

// Наши компоненты
import AddBoardModal from '../components/AddBoardModal';
import BoardDetailModal from '../components/BoardDetailModal';
import AddCardModal from '../components/AddCardModal';
import EditBoardModal from '../components/EditBoardModal'; // <-- новый компонент

import '../styles/main.css';
import '../styles/board.css';

function BoardsPage() {


  const queryClient = useQueryClient();

  // ---- [Создание доски] ----
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // ---- [Детальный просмотр доски] ----
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // ---- [Добавление карточки] ----
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

  // ---- [Редактирование доски] ----
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [boardToEdit, setBoardToEdit] = useState(null);

  // Загрузка списка досок
  const {
    data: boards,
    isLoading: isBoardsLoading,
    isError: isBoardsError,
    error: boardsError,
  } = useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoards,
  });

  // ----- Мутации -----
  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
    },
  });

  const createCardMutation = useMutation({
    mutationFn: createCard,
    onSuccess: (createdCard) => {
      attachCardToBoardMutation.mutate({
        boardId: selectedBoardId,
        cardId: createdCard.id,
      });
    },
  });

const attachCardToBoardMutation = useMutation({
  mutationFn: ([boardId, cardId]) => attachCardToBoard(boardId, cardId),
  onSuccess: () => {
    queryClient.invalidateQueries(['boardDetail', selectedBoardId, 'cards']);
  },
});

  // ---- Мутация для редактирования доски ----
  const updateBoardMutation = useMutation({
    mutationFn: ({ boardId, data }) => updateBoard(boardId, data),
    onSuccess: () => {
      // Обновляем список досок
      queryClient.invalidateQueries(['boards']);
      // Обновляем, если нужно, деталку
      if (selectedBoardId) {
        queryClient.invalidateQueries(['boardDetail', selectedBoardId]);
      }
    },
  });

  // -----------------------------------------
  // Функционал для детального просмотра
  // (fetchBoard, fetchCards) ...
  // -----------------------------------------
  const {
    data: boardDetail,
    isLoading: isBoardDetailLoading,
    isError: isBoardDetailError,
  } = useQuery({
    queryKey: ['boardDetail', selectedBoardId],
    queryFn: () => fetchBoard(selectedBoardId),
    enabled: !!selectedBoardId,
  });

  const {
    data: detailCards,
    isLoading: isDetailCardsLoading,
    isError: isDetailCardsError,
  } = useQuery({
    queryKey: ['boardDetail', selectedBoardId, 'cards'],
    queryFn: () => fetchCards(selectedBoardId),
    enabled: !!selectedBoardId,
  });

  // -----------------------------------------
  // Handlers
  // -----------------------------------------
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openDetailModal = (boardId) => {
    setSelectedBoardId(boardId);
    setIsDetailOpen(true);
  };
  const closeDetailModal = () => {
    setIsDetailOpen(false);
    setSelectedBoardId(null);
  };

  const openAddCardModal = () => setIsAddCardModalOpen(true);
  const closeAddCardModal = () => setIsAddCardModalOpen(false);

  // Редактирование доски
  const openEditModal = (e, board) => {
    e.stopPropagation(); // чтобы не открывался детальный просмотр
    setBoardToEdit(board);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setBoardToEdit(null);
  };

  // -----------------------------------------
  // Логика
  // -----------------------------------------
  const handleCreateBoard = (title, description) => {
    createBoardMutation.mutate({ title, description });
    closeCreateModal();
  };

  const handleDeleteBoard = (e, boardId) => {
    e.stopPropagation();
    deleteBoardMutation.mutate(boardId);
  };

  const handleCreateCard = (formData) => {
    createCardMutation.mutate(formData, {
      onSuccess: (createdCard) => {
        console.log("Created card:", createdCard);
        console.log("selectedBoardId:", selectedBoardId);
        
        if (!selectedBoardId) {
          console.error("Ошибка: boardId не определен!");
          return;
        }
  
        // Здесь важно передавать **отдельные аргументы**, а не один объект
        attachCardToBoardMutation.mutate([selectedBoardId, createdCard.id]);
      },
    });
    closeAddCardModal();
  };
  // Вызов «Обновить список досок»
  const handleRefreshBoards = () => {
    queryClient.invalidateQueries(['boards']);
  };

  // Самое главное — логика обновления:
  const handleUpdateBoard = (boardId, newData) => {
    updateBoardMutation.mutate({ boardId, data: newData });
    closeEditModal();
  };

  // -----------------------------------------
  // Render
  // -----------------------------------------
  if (isBoardsLoading) return <div>Загрузка досок...</div>;
  if (isBoardsError) return <div>Ошибка: {boardsError.message}</div>;

  return (
    <div className="container">
      <h1>Доски</h1>

      <button onClick={openCreateModal}>Создать доску</button>
      <button onClick={handleRefreshBoards} style={{ marginLeft: '10px' }}>
        Обновить список
      </button>

      <ul className="boards-list">
        {boards?.map((board) => (
          <li
            key={board.id}
            onClick={() => openDetailModal(board.id)}
            style={{ cursor: 'pointer' }}
          >
            <div>
              <strong>{board.title}</strong> - {board.description}
            </div>
            {/* Кнопка «Редактировать» */}
            <button
              style={{ marginRight: '8px' }}
              onClick={(e) => openEditModal(e, board)}
            >
              Редактировать
            </button>
            {/* Кнопка «Удалить» */}
            <button
              className="icon-button delete"
              onClick={(e) => handleDeleteBoard(e, board.id)}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>

      {/* Модалка «Создать доску» */}
      <AddBoardModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onCreateBoard={handleCreateBoard}
      />

      {/* Модалка «Редактировать доску» */}
      <EditBoardModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        boardToEdit={boardToEdit}
        onUpdateBoard={handleUpdateBoard}
      />

      {/* Модалка «Детальная информация» */}
      <BoardDetailModal
        isOpen={isDetailOpen}
        onClose={closeDetailModal}
        boardDetail={boardDetail}
        cards={detailCards}
        isLoading={isBoardDetailLoading || isDetailCardsLoading}
        isError={isBoardDetailError || isDetailCardsError}
        onOpenAddCardModal={openAddCardModal}
      />

      {/* Модалка «Добавить карточку» */}
      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={closeAddCardModal}
        onCreateCard={handleCreateCard}
        boardId={selectedBoardId}
      />
    </div>
  );
}

export default BoardsPage;
