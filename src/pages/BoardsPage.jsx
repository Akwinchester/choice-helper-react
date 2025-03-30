import React, { useState, useEffect } from "react";
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

import AddBoardModal from "../components/modals/AddBoardModal";
import BoardDetailModal from "../components/modals/BoardDetailModal";
import AddCardModal from "../components/modals/AddCardModal";
import EditBoardModal from "../components/modals/EditBoardModal";
import InvitesModal from "../components/modals/InvitesModal"; // ✅ новое

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

  const [username, setUsername] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInvitesOpen, setIsInvitesOpen] = useState(false); // ✅ новое

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

      {/* 🔹 Общий верхний хедер */}
      <div className="header">
        <h1>Доски</h1>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
          <span>{username}</span>
          <button className="button red small" onClick={handleLogout}>Выйти</button>
        </div>
      </div>

      {/* 🔘 Кнопки действий */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
        <button className="button blue" onClick={() => setIsInvitesOpen(true)}>
          Приглашения
        </button>
        <button className="button green" onClick={() => setIsCreateModalOpen(true)}>
          Создать доску
        </button>
      </div>

      {/* 📋 Список досок */}
      <ul className="boards-list">
        {boards?.map((board) => (
          <li
            key={board.id}
            onClick={() => setSelectedBoardId(board.id) || setIsDetailOpen(true)}
          >
            <div className="board-title">
              <strong>{board.title}</strong>
            </div>
            <div
              className="board-actions"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="icon-button edit"
                onClick={(e) => openEditModal(e, board, setBoardToEdit, setIsEditModalOpen)}
              >
                Редактировать
              </button>
              <button
                className="icon-button delete"
                onClick={(e) => handleDeleteBoard(e, board.id, deleteBoardMutation)}
              >
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* ✅ Модалка приглашений */}
      <InvitesModal isOpen={isInvitesOpen} onClose={() => setIsInvitesOpen(false)} />

      {/* 📦 Модалки */}
      <AddBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBoard={(title, description) =>
          handleCreateBoard(title, description, createBoardMutation, () =>
            setIsCreateModalOpen(false)
          )
        }
      />

      <EditBoardModal
        isOpen={isEditModalOpen}
        onClose={() => closeEditModal(setIsEditModalOpen, setBoardToEdit)}
        boardToEdit={boardToEdit}
        onUpdateBoard={(boardId, data) =>
          updateBoardMutation.mutate({ boardId, data })
        }
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
        onCreateCard={(formData) =>
          handleCreateCard(formData, createCardMutation, () =>
            setIsAddCardModalOpen(false)
          )
        }
      />
    </div>
  );
}

export default BoardsPage;
