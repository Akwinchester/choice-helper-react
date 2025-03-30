// src/components/boards/BoardsModals.jsx
import React from "react";
import AddBoardModal from "../modals/AddBoardModal";
import EditBoardModal from "../modals/EditBoardModal";
import BoardDetailModal from "../modals/BoardDetailModal";
import AddCardModal from "../modals/AddCardModal";
import InvitesModal from "../modals/InvitesModal";

function BoardsModals({
  isCreateModalOpen,
  isEditModalOpen,
  isDetailOpen,
  isAddCardModalOpen,
  isInvitesOpen,
  onCloseCreate,
  onCloseEdit,
  onCloseDetail,
  onCloseAddCard,
  onCloseInvites,
  boardToEdit,
  boardDetail,
  detailCards,
  isLoading,
  onUpdateBoard,
  onCreateBoard,
  onDeleteCard,
  onUpdateCard,
  onCreateCard,
}) {
  return (
    <>
      <InvitesModal isOpen={isInvitesOpen} onClose={onCloseInvites} />

      <AddBoardModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreate}
        onCreateBoard={onCreateBoard}
      />

      <EditBoardModal
        isOpen={isEditModalOpen}
        onClose={onCloseEdit}
        boardToEdit={boardToEdit}
        onUpdateBoard={onUpdateBoard}
      />

      <BoardDetailModal
        isOpen={isDetailOpen}
        onClose={onCloseDetail}
        boardDetail={boardDetail}
        cards={detailCards}
        isLoading={isLoading}
        isError={false}
        onOpenAddCardModal={onCloseAddCard}
        onDeleteCard={onDeleteCard}
        onUpdateCard={onUpdateCard}
      />

      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={onCloseAddCard}
        onCreateCard={onCreateCard}
      />
    </>
  );
}

export default BoardsModals;
