import React, { useState } from "react";
import Modal from "./Modal";
import "./CardDetailModal.css";

function CardDetailModal({ isOpen, onClose, card, onUpdateCard, onDeleteCard }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(card?.text || "");
  const [editedDesc, setEditedDesc] = useState(card?.short_description || "");
  const [newImage, setNewImage] = useState(null);

  if (!card) return null;

  const handleSave = () => {
    const formData = new FormData();
    formData.append("text", editedText);
    formData.append("short_description", editedDesc);
    if (newImage) {
      formData.append("image", newImage);
    }

    onUpdateCard(card.id, formData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!onDeleteCard || typeof onDeleteCard !== "function") {
      console.error("Ошибка: `onDeleteCard` не является функцией.");
      return;
    }

    if (window.confirm("Вы уверены, что хотите удалить эту карточку?")) {
      onDeleteCard(card.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Детали карточки</h2>
      {isEditing ? (
        <div className="edit-form">
          <input type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
          <textarea value={editedDesc} onChange={(e) => setEditedDesc(e.target.value)} />
          <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} />
          <button onClick={handleSave}>Сохранить</button>
          <button onClick={() => setIsEditing(false)}>Отмена</button>
        </div>
      ) : (
        <div className="card-view">
          {card.image_url && <img src={`http://127.0.0.1:8000/${card.image_url}`} alt={card.text} />}
          <h3>{card.text}</h3>
          <p>{card.short_description}</p>
          {/* <button onClick={() => setIsEditing(true)}>Редактировать</button> */}
          <button onClick={handleDelete} className="delete-button">Удалить</button>
        </div>
      )}
    </Modal>
  );
}

export default CardDetailModal;
