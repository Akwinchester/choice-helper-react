// src/components/modals/CardDetailModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import CardView from "./CardView";
import CardEditForm from "./CardEditForm";
import "../../styles/modals/CardDetailModal.css";

function CardDetailModal({ isOpen, onClose, card, onUpdateCard, onDeleteCard, onCardUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(card?.text || "");
  const [editedDesc, setEditedDesc] = useState(card?.short_description || "");
  const [originalFile, setOriginalFile] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    setIsEditing(false);
    setEditedText(card?.text || "");
    setEditedDesc(card?.short_description || "");
    setOriginalFile(null);
    setCroppedFile(null);
  }, [isOpen, card]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("text", editedText);
    formData.append("short_description", editedDesc);

    if (croppedFile) {
      formData.append("image", croppedFile, croppedFile.name);
    }

    try {
      const updatedCard = await onUpdateCard(card.id, formData);
      onCardUpdated(updatedCard);
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при обновлении карточки:", error);
    }
  };

  if (!card) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Детали карточки</h2>

      {isEditing ? (
        <CardEditForm
          editedText={editedText}
          setEditedText={setEditedText}
          editedDesc={editedDesc}
          setEditedDesc={setEditedDesc}
          setOriginalFile={setOriginalFile}
          setCroppedFile={setCroppedFile}
          originalFile={originalFile}
          croppedFile={croppedFile}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <CardView
          card={card}
          onEdit={() => setIsEditing(true)}
          onDelete={() => {
            if (window.confirm("Вы уверены, что хотите удалить эту карточку?")) {
              onDeleteCard(card.id);
              onClose();
            }
          }}
        />
      )}
    </Modal>
  );
}

export default CardDetailModal;
