// src/components/modals/CreateSessionModal.jsx
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { fetchUsers } from '../../api/userApi';
import { createGroupSession } from '../../api/sessionsApi';
import { getUserInfo } from '../../api/auth'; // ⏺ добавили
import '../../styles/modals/CreateSessionModal.css';

function CreateSessionModal({ isOpen, onClose, boardId, onCreated }) {
  const [sessionType, setSessionType] = useState('individual');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (isOpen && sessionType === 'group') {
      fetchUsers()
        .then(setUsers)
        .catch((err) => console.error("Ошибка загрузки пользователей", err));
    }
  }, [isOpen, sessionType]);

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    try {
      const currentUser = await getUserInfo();
      let allUserIds = [];

      if (sessionType === 'group') {
        // ⏺ добавляем инициатора в список
        allUserIds = [...new Set([...selectedUsers, currentUser.id])];
      } else {
        // ⏺ индивидуальная сессия = групповая с 1 участником
        allUserIds = [currentUser.id];
      }

      const created = await createGroupSession(boardId, allUserIds);
      onCreated?.(created);
      onClose();
    } catch (err) {
      console.error("Ошибка при создании сессии", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Создание сессии</h2>

      <label>Тип сессии:</label>
      <select
        value={sessionType}
        onChange={(e) => setSessionType(e.target.value)}
        className="select"
      >
        <option value="individual">Индивидуальная</option>
        <option value="group">Групповая</option>
      </select>

      {sessionType === 'group' && (
        <>
          <h4>Выберите участников:</h4>
          <div className="user-list">
            {users.map((user) => (
              <label key={user.id} className="user-checkbox">
                <input
                  type="checkbox"
                  value={user.id}
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                />
                {user.username}
              </label>
            ))}
          </div>
        </>
      )}

      <button className="button green" onClick={handleCreate}>
        Создать сессию
      </button>
    </Modal>
  );
}

export default CreateSessionModal;
