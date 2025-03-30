// src/components/modals/BoardDetailModal.jsx
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "./Modal";
import CardDetailModal from "./CardDetailModal";
import SessionModal from "./SessionModal";
import BoardSessionsModal from "./BoardSessionsModal";
import CreateSessionModal from "./CreateSessionModal";
import { updateCard } from "../../api/cardsApi";
import CardGallery from "./CardGallery";
import BoardActionButtons from "./BoardActionButtons";
import "../../styles/modals/BoardDetailModal.css";

function BoardDetailModal({ isOpen, onClose, boardDetail, cards, onDeleteCard, onOpenAddCardModal }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createdSession, setCreatedSession] = useState(null);
  const queryClient = useQueryClient();

  const updateCardMutation = useMutation({
    mutationFn: ({ cardId, formData }) => updateCard(cardId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["cards", boardDetail?.id]);
    },
  });

  const handleUpdateCard = (cardId, formData) => {
    updateCardMutation.mutate({ cardId, formData });
  };

  const handleSessionCreated = (session) => {
    setCreatedSession(session);
    setIsSessionOpen(true);
  };

  if (!boardDetail) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>{boardDetail.title}</h2>
      <p>{boardDetail.description}</p>

      <h3>Карточки</h3>
      <CardGallery cards={cards} onCardClick={setSelectedCard} />

      <BoardActionButtons
        onAddCard={onOpenAddCardModal}
        onStartSession={() => setIsCreateModalOpen(true)}
        onViewSessions={() => setIsSessionsModalOpen(true)}
      />

      {selectedCard && (
        <CardDetailModal
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          card={selectedCard}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={onDeleteCard}
          onCardUpdated={setSelectedCard}
        />
      )}

      {isSessionOpen && createdSession && (
        <SessionModal
          isOpen={isSessionOpen}
          onClose={() => setIsSessionOpen(false)}
          boardId={boardDetail.id}
          sessionId={createdSession.id}
        />
      )}

      {isSessionsModalOpen && (
        <BoardSessionsModal
          isOpen={isSessionsModalOpen}
          onClose={() => setIsSessionsModalOpen(false)}
          boardId={boardDetail.id}
        />
      )}

      {isCreateModalOpen && (
        <CreateSessionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          boardId={boardDetail.id}
          onCreated={handleSessionCreated}
        />
      )}
    </Modal>
  );
}

export default BoardDetailModal;
