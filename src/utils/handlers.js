export const openEditModal = (e, board, setBoardToEdit, setIsEditModalOpen) => {
    e.stopPropagation();
    setBoardToEdit(board);
    setIsEditModalOpen(true);
  };
  
  export const closeEditModal = (setIsEditModalOpen, setBoardToEdit) => {
    setIsEditModalOpen(false);
    setBoardToEdit(null);
  };
  
  export const handleCreateBoard = (title, description, createBoardMutation, closeCreateModal) => {
    createBoardMutation.mutate({ title, description });
    closeCreateModal();
  };
  
  export const handleDeleteBoard = (e, boardId, deleteBoardMutation) => {
    e.stopPropagation();
    deleteBoardMutation.mutate(boardId);
  };
  
  export const handleCreateCard = (formData, createCardMutation, closeAddCardModal) => {
    createCardMutation.mutate(formData);
    closeAddCardModal();
  };
  