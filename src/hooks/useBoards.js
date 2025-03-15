import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBoards,
  createBoard,
  deleteBoard,
  fetchBoard,
  updateBoard,
} from "../api/boardsApi";
import { fetchCards, createCard, attachCardToBoard, deleteCard, updateCard } from "../api/cardsApi";

export function useBoards() {
  const queryClient = useQueryClient();
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [boardToEdit, setBoardToEdit] = useState(null);

  const { data: boards, isLoading: isBoardsLoading, isError: isBoardsError } = useQuery({
    queryKey: ["boards"],
    queryFn: fetchBoards,
  });

  const { data: boardDetail, isLoading: isBoardDetailLoading } = useQuery({
    queryKey: ["boardDetail", selectedBoardId],
    queryFn: () => fetchBoard(selectedBoardId),
    enabled: !!selectedBoardId,
  });

  const { data: detailCards, isLoading: isDetailCardsLoading } = useQuery({
    queryKey: ["boardDetail", selectedBoardId, "cards"],
    queryFn: () => fetchCards(selectedBoardId),
    enabled: !!selectedBoardId,
  });

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
