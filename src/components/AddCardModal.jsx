import React, { useState, useEffect } from 'react';
import Modal from './Modal';

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

    // Создаем FormData
    const formData = new FormData();
    formData.append('text', cardText);
    formData.append('short_description', cardDesc);
    if (cardImage) {
      formData.append('image', cardImage);
    }

    // Передаем FormData в onCreateCard
    onCreateCard(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Новая карточка</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Card Text"
          value={cardText}
          onChange={(e) => setCardText(e.target.value)}
        />
        <textarea
          placeholder="Card Description"
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
