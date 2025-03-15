import React, { useState } from "react";
import { useBoards } from "../hooks/useBoards";
import {
  openEditModal,
  closeEditModal,
  handleCreateBoard,
  handleDeleteBoard,
  handleCreateCard,
} from "../utils/handlers";

import AddBoardModal from "../components/modals/AddBoardModal";
import BoardDetailModal from "../components/modals/BoardDetailModal";
import AddCardModal from "../components/modals/AddCardModal";
import EditBoardModal from "../components/modals/EditBoardModal";

import "../styles/main.css";
import "../styles/board.css";

function BoardsPage() {
  const {
    boards,
    isBoardsLoading,
    selectedBoardId,
    setSelectedBoardId,
    boardDetail,
    isBoardDetailLoading,
    detailCards,
    isDetailCardsLoading,
    createBoardMutation,
    deleteBoardMutation,
    updateBoardMutation,
    createCardMutation,
    deleteCardMutation,
    updateCardMutation,
    boardToEdit,
    setBoardToEdit,
  } = useBoards();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="container">
      <h1>Доски</h1>

      <button onClick={() => setIsCreateModalOpen(true)}>Создать доску</button>

      <ul className="boards-list">
        {boards?.map((board) => (
          <li key={board.id} onClick={() => setSelectedBoardId(board.id) || setIsDetailOpen(true)} style={{ cursor: "pointer" }}>
            <div>
              <strong>{board.title}</strong> - {board.description}
            </div>
            <button style={{ marginRight: "8px" }} onClick={(e) => openEditModal(e, board, setBoardToEdit, setIsEditModalOpen)}>
              Редактировать
            </button>
            <button className="icon-button delete" onClick={(e) => handleDeleteBoard(e, board.id, deleteBoardMutation)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>

      <AddBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBoard={(title, description) => handleCreateBoard(title, description, createBoardMutation, () => setIsCreateModalOpen(false))}
      />

      <EditBoardModal
        isOpen={isEditModalOpen}
        onClose={() => closeEditModal(setIsEditModalOpen, setBoardToEdit)}
        boardToEdit={boardToEdit}
        onUpdateBoard={updateBoardMutation.mutate}
      />

      <BoardDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        boardDetail={boardDetail}
        cards={detailCards}
        isLoading={isBoardDetailLoading || isDetailCardsLoading}
        isError={false}
        onOpenAddCardModal={() => setIsAddCardModalOpen(true)}
        onDeleteCard={deleteCardMutation.mutate}
        onUpdateCard={updateCardMutation.mutate}
      />

      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        onCreateCard={(formData) => handleCreateCard(formData, createCardMutation, () => setIsAddCardModalOpen(false))}
      />
    </div>
  );
}

export default BoardsPage;
