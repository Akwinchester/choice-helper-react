import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBoards,
  createBoard,
  deleteBoard,
  fetchBoard,
  updateBoard,
} from "../api/boardsApi";
import {
  fetchCards,
  createCard,
  attachCardToBoard,
  deleteCard,
  updateCard,
} from "../api/cardsApi";

export function useBoards(setIsEditModalOpenExternally) {
  const queryClient = useQueryClient();
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [boardToEdit, setBoardToEdit] = useState(null);

  // 🔄 Получить все доски
  const { data: boards, isLoading: isBoardsLoading, isError: isBoardsError } = useQuery({
    queryKey: ["boards"],
    queryFn: fetchBoards,
  });

  // 🔄 Детали конкретной доски
  const { data: boardDetail, isLoading: isBoardDetailLoading } = useQuery({
    queryKey: ["boardDetail", selectedBoardId],
    queryFn: () => fetchBoard(selectedBoardId),
    enabled: !!selectedBoardId,
  });

  // 🔄 Карточки доски
  const { data: detailCards, isLoading: isDetailCardsLoading } = useQuery({
    queryKey: ["boardDetail", selectedBoardId, "cards"],
    queryFn: () => fetchCards(selectedBoardId),
    enabled: !!selectedBoardId,
  });

  // ✅ Создание доски
  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => queryClient.invalidateQueries(["boards"]),
  });

  // ✅ Удаление доски
  const deleteBoardMutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => queryClient.invalidateQueries(["boards"]),
  });

  // ✅ ОБНОВЛЕНИЕ ДОСКИ + закрытие модалки
  const updateBoardMutation = useMutation({
    mutationFn: ({ boardId, data }) => updateBoard(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      if (selectedBoardId) {
        queryClient.invalidateQueries(["boardDetail", selectedBoardId]);
      }

      // ✅ Закрыть модалку редактирования, если функция передана
      if (setIsEditModalOpenExternally) {
        setIsEditModalOpenExternally(false);
        setBoardToEdit(null);
      }
    },
  });

  // ✅ Создание карточки
  const createCardMutation = useMutation({
    mutationFn: createCard,
    onSuccess: (createdCard) => {
      attachCardToBoardMutation.mutate([selectedBoardId, createdCard.id]);
    },
  });

  // ✅ Привязка карточки
  const attachCardToBoardMutation = useMutation({
    mutationFn: ([boardId, cardId]) => attachCardToBoard(boardId, cardId),
    onSuccess: () => {
      queryClient.invalidateQueries(["boardDetail", selectedBoardId, "cards"]);
    },
  });

  // ✅ Удаление карточки
  const deleteCardMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () =>
      queryClient.invalidateQueries(["boardDetail", selectedBoardId, "cards"]),
  });

  // ✅ Обновление карточки
  const updateCardMutation = useMutation({
    mutationFn: ({ cardId, formData }) => updateCard(cardId, formData),
    onSuccess: () =>
      queryClient.invalidateQueries(["boardDetail", selectedBoardId, "cards"]),
  });

  return {
    boards,
    isBoardsLoading,
    isBoardsError,
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
    attachCardToBoardMutation,
    deleteCardMutation,
    updateCardMutation,
    boardToEdit,
    setBoardToEdit,
  };
}
