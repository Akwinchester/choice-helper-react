// src/components/AddBoardModal.jsx
import React, { useState } from 'react';
import Modal from './Modal'; // Переиспользуемый модальный компонент

function AddBoardModal({ isOpen, onClose, onCreateBoard }) {
  // Локальное состояние (заголовок + описание)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Сброс полей, когда модалка закрывается
  React.useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
    }
  }, [isOpen]);

  // Сабмит формы
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateBoard(title, description);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Создание новой доски</h2>
      <form className="add-board-form"onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название доски"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Описание доски"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Сохранить</button>
      </form>
    </Modal>
  );
}

export default AddBoardModal;
