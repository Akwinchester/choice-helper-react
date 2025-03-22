// src/components/AddBoardModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Переиспользуемый модальный компонент

function AddBoardModal({ isOpen, onClose, onCreateBoard }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateBoard(title, description);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Создание новой доски</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название доски"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />
        <textarea
          placeholder="Описание доски"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
        <button type="submit" className="button green">Сохранить</button>
      </form>
    </Modal>
  );
}

export default AddBoardModal;
