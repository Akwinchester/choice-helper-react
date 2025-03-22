// src/components/EditBoardModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from './Modal';

function EditBoardModal({ isOpen, onClose, boardToEdit, onUpdateBoard }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    console.log("🔍 boardToEdit:", boardToEdit); // лог
    if (isOpen && boardToEdit) {
      setTitle(boardToEdit.title || '');
      setDescription(boardToEdit.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [isOpen, boardToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    console.log("📤 Пытаемся обновить доску:", boardToEdit.id); // лог
    if (!boardToEdit?.id) {
      alert("❌ Ошибка: boardToEdit.id не задан!");
      return;
    }

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
