// src/components/modals/AddCardModal.jsx
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import AddCardForm from "./AddCardForm";

function AddCardModal({ isOpen, onClose, onCreateCard }) {
  const [cardText, setCardText] = useState("");
  const [cardDesc, setCardDesc] = useState("");
  const [originalFile, setOriginalFile] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);

  useEffect(() => {
    if (!isOpen) resetState();
  }, [isOpen]);

  const resetState = () => {
    setCardText("");
    setCardDesc("");
    setOriginalFile(null);
    setCroppedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardText.trim()) return;

    const formData = new FormData();
    formData.append("text", cardText);
    formData.append("short_description", cardDesc);

    if (croppedFile) {
      formData.append("image", croppedFile, "cropped-image.jpg");
    } else if (originalFile) {
      formData.append("image", originalFile, originalFile.name);
    }

    try {
      await onCreateCard(formData);
      resetState();
      onClose();
    } catch (error) {
      console.error("❌ Ошибка при создании карточки:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Создание новой карточки</h2>
      <AddCardForm
        cardText={cardText}
        setCardText={setCardText}
        cardDesc={cardDesc}
        setCardDesc={setCardDesc}
        originalFile={originalFile}
        setOriginalFile={setOriginalFile}
        croppedFile={croppedFile}
        setCroppedFile={setCroppedFile}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}

export default AddCardModal;
