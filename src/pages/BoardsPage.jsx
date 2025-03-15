import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBoards,
  createBoard,
  deleteBoard,
  fetchBoard,
  updateBoard,
} from "../api/boardsApi";
import { fetchCards, createCard, attachCardToBoard, deleteCard, updateCard } from "../api/cardsApi";

// Компоненты
import AddBoardModal from "../components/AddBoardModal";
import BoardDetailModal from "../components/BoardDetailModal";
import AddCardModal from "../components/AddCardModal";
import EditBoardModal from "../components/EditBoardModal";

import "../styles/main.css";
import "../styles/board.css";

function BoardsPage() {
  const queryClient = useQueryClient();

  // ---- [Модальные окна] ----
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ---- [Текущая доска] ----
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [boardToEdit, setBoardToEdit] = useState(null);

  // ---- [Запрос списка досок] ----
  const {
    data: boards,
    isLoading: isBoardsLoading,
    isError: isBoardsError,
    error: boardsError,
  } = useQuery({
    queryKey: ["boards"],
    queryFn: fetchBoards,
  });

  // ---- [Запрос данных одной доски] ----
  const {
    data: boardDetail,
    isLoading: isBoardDetailLoading,
    isError: isBoardDetailError,
  } = useQuery({
    queryKey: ["boardDetail", selectedBoardId],
    queryFn: () => fetchBoard(selectedBoardId),
    enabled: !!selectedBoardId,
  });

  // ---- [Запрос карточек доски] ----
  const {
    data: detailCards,
    isLoading: isDetailCardsLoading,
    isError: isDetailCardsError,
  } = useQuery({
    queryKey: ["boardDetail", selectedBoardId, "cards"],
    queryFn: () => fetchCards(selectedBoardId),
    enabled: !!selectedBoardId,
  });

  // ---- [Мутации (Создание/Редактирование/Удаление)] ----
  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => queryClient.invalidateQueries(["boards"]),
  });

  const deleteBoardMutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => queryClient.invalidateQueries(["boards"]),
  });

  const updateBoardMutation = useMutation({
    mutationFn: ({ boardId, data }) => updateBoard(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      if (selectedBoardId) queryClient.invalidateQueries(["boardDetail", selectedBoardId]);
    },
  });

  const createCardMutation = useMutation({
    mutationFn: createCard,
    onSuccess: (createdCard) => {
      attachCardToBoardMutation.mutate([selectedBoardId, createdCard.id]);
    },
  });

  const attachCardToBoardMutation = useMutation({
    mutationFn: ([boardId, cardId]) => attachCardToBoard(boardId, cardId),
    onSuccess: () => {
      queryClient.invalidateQueries(["boardDetail", selectedBoardId, "cards"]);
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => queryClient.invalidateQueries(["boardDetail", selectedBoardId, "cards"]),
  });

  const updateCardMutation = useMutation({
    mutationFn: ({ cardId, formData }) => updateCard(cardId, formData),
    onSuccess: () => queryClient.invalidateQueries(["boardDetail", selectedBoardId, "cards"]),
  });

  // ---- [Handlers] ----
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

  const openEditModal = (e, board) => {
    e.stopPropagation();
    setBoardToEdit(board);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setBoardToEdit(null);
  };

  const handleCreateBoard = (title, description) => {
    createBoardMutation.mutate({ title, description });
    closeCreateModal();
  };

  const handleDeleteBoard = (e, boardId) => {
    e.stopPropagation();
    deleteBoardMutation.mutate(boardId);
  };

  const handleCreateCard = (formData) => {
    createCardMutation.mutate(formData);
    closeAddCardModal();
  };

  const handleDeleteCard = (cardId) => {
    deleteCardMutation.mutate(cardId);
  };

  const handleUpdateBoard = (boardId, newData) => {
    updateBoardMutation.mutate({ boardId, data: newData });
    closeEditModal();
  };

  const handleUpdateCard = (cardId, formData) => {
    updateCardMutation.mutate({ cardId, formData });
  };

  return (
    <div className="container">
      <h1>Доски</h1>

      <button onClick={openCreateModal}>Создать доску</button>

      <ul className="boards-list">
        {boards?.map((board) => (
          <li key={board.id} onClick={() => openDetailModal(board.id)} style={{ cursor: "pointer" }}>
            <div>
              <strong>{board.title}</strong> - {board.description}
            </div>
            <button style={{ marginRight: "8px" }} onClick={(e) => openEditModal(e, board)}>
              Редактировать
            </button>
            <button className="icon-button delete" onClick={(e) => handleDeleteBoard(e, board.id)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>

      <AddBoardModal isOpen={isCreateModalOpen} onClose={closeCreateModal} onCreateBoard={handleCreateBoard} />
      <EditBoardModal isOpen={isEditModalOpen} onClose={closeEditModal} boardToEdit={boardToEdit} onUpdateBoard={handleUpdateBoard} />

      <BoardDetailModal
        isOpen={isDetailOpen}
        onClose={closeDetailModal}
        boardDetail={boardDetail}
        cards={detailCards}
        isLoading={isBoardDetailLoading || isDetailCardsLoading}
        isError={isBoardDetailError || isDetailCardsError}
        onOpenAddCardModal={openAddCardModal}
        onDeleteCard={handleDeleteCard}
        onUpdateCard={handleUpdateCard}
      />

      <AddCardModal isOpen={isAddCardModalOpen} onClose={closeAddCardModal} onCreateCard={handleCreateCard} />
    </div>
  );
}

export default BoardsPage;
