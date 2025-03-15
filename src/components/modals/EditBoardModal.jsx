// src/components/EditBoardModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from './Modal';

function EditBoardModal({ 
  isOpen, 
  onClose, 
  boardToEdit, // объект { id, title, description }
  onUpdateBoard 
}) {
  // Локальное состояние полей (изначально берем из boardToEdit)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // При открытии/закрытии модалки заполняем/сбрасываем данные
  useEffect(() => {
    if (isOpen && boardToEdit) {
      setTitle(boardToEdit.title);
      setDescription(boardToEdit.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [isOpen, boardToEdit]);

  // Сабмит формы
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onUpdateBoard(boardToEdit.id, { title, description });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Редактировать доску</h2>
      <form onSubmit={handleSubmit}>
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

export default EditBoardModal;
