import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './AddCardModal.css';

function AddCardModal({ isOpen, onClose, onCreateCard }) {
  const [cardText, setCardText] = useState('');
  const [cardDesc, setCardDesc] = useState('');
  const [cardImage, setCardImage] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setCardText('');
      setCardDesc('');
      setCardImage(null);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardText.trim()) return;

    const formData = new FormData();
    formData.append('text', cardText);
    formData.append('short_description', cardDesc);
    if (cardImage) {
      formData.append('image', cardImage);
    }

    onCreateCard(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Новая карточка</h2>
      <form className="add-card-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название карточки"
          value={cardText}
          onChange={(e) => setCardText(e.target.value)}
        />
        <textarea
          placeholder="Описание"
          value={cardDesc}
          onChange={(e) => setCardDesc(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCardImage(e.target.files[0])}
        />
        <button type="submit">Сохранить</button>
      </form>
    </Modal>
  );
}

export default AddCardModal;
