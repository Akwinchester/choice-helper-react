// src/pages/BoardsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBoards } from "../hooks/useBoards";
import { logoutUser, getUserInfo } from "../api/auth";
import {
  openEditModal,
  closeEditModal,
  handleCreateBoard,
  handleDeleteBoard,
  handleCreateCard,
} from "../utils/handlers";

import BoardsHeader from "../components/modals/BoardsHeader";
import BoardsToolbar from "../components/modals/BoardsToolbar";
import BoardList from "../components/modals/BoardList";
import BoardsModals from "../components/modals/BoardsModals";

import "../styles/main.css";
import "../styles/board.css";

function BoardsPage() {
  const {
    boards,
    selectedBoardId,
    setSelectedBoardId,
    boardDetail,
    detailCards,
    isBoardDetailLoading,
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

  const [username, setUsername] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInvitesOpen, setIsInvitesOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getUserInfo();
        setUsername(res?.username || "");
      } catch (error) {
        console.error("Ошибка получения пользователя:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  return (
    <div className="container">
      <BoardsHeader username={username} onLogout={handleLogout} />

      <BoardsToolbar
        onCreate={() => setIsCreateModalOpen(true)}
        onInvites={() => setIsInvitesOpen(true)}
      />

      <BoardList
        boards={boards}
        onSelect={(id) => {
          setSelectedBoardId(id);
          setIsDetailOpen(true);
        }}
        onEdit={(e, board) => openEditModal(e, board, setBoardToEdit, setIsEditModalOpen)}
        onDelete={(e, id) => handleDeleteBoard(e, id, deleteBoardMutation)}
      />

      <BoardsModals
        isCreateModalOpen={isCreateModalOpen}
        isEditModalOpen={isEditModalOpen}
        isDetailOpen={isDetailOpen}
        isAddCardModalOpen={isAddCardModalOpen}
        isInvitesOpen={isInvitesOpen}
        onCloseCreate={() => setIsCreateModalOpen(false)}
        onCloseEdit={() => closeEditModal(setIsEditModalOpen, setBoardToEdit)}
        onCloseDetail={() => setIsDetailOpen(false)}
        onOpenAddCard={() => setIsAddCardModalOpen(true)}
        onCloseAddCard={() => setIsAddCardModalOpen(false)}
        onCloseInvites={() => setIsInvitesOpen(false)}
        boardToEdit={boardToEdit}
        boardDetail={boardDetail}
        detailCards={detailCards}
        isLoading={isBoardDetailLoading || isDetailCardsLoading}
        onUpdateBoard={({ boardId, data }) => updateBoardMutation.mutate({ boardId, data })}
        onCreateBoard={(title, description) =>
          handleCreateBoard(title, description, createBoardMutation, () => setIsCreateModalOpen(false))
        }
        onDeleteCard={deleteCardMutation.mutate}
        onUpdateCard={updateCardMutation.mutate}
        onCreateCard={(formData) =>
          handleCreateCard(formData, createCardMutation, () => setIsAddCardModalOpen(false))
        }
      />
    </div>
  );
}

export default BoardsPage;
