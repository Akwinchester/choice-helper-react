import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { createGroupSession } from '../../api/sessionsApi';
import { getUserInfo } from '../../api/auth';
import { fetchFriends } from "../../api/friendsApi";

import '../../styles/modals/CreateSessionModal.css';

function CreateSessionModal({ isOpen, onClose, boardId, onCreated }) {
  const [sessionType, setSessionType] = useState('individual');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await getUserInfo();
        setCurrentUser(me);

        const friends = await fetchFriends();
        setUsers(friends);
      } catch (err) {
        console.error("Ошибка загрузки друзей", err);
      }
    };

    if (isOpen && sessionType === 'group') {
      load();
    }
  }, [isOpen, sessionType]);

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    try {
      const me = await getUserInfo();
      let allUserIds = [];

      if (sessionType === 'group') {
        allUserIds = [...new Set([...selectedUsers, me.id])];
      } else {
        allUserIds = [me.id];
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
            {users.filter((u) => currentUser && u.id !== currentUser.id).length === 0 ? (
              <p className="placeholder-text">Сначала добавьте кого-нибудь в друзья</p>
            ) : (
              users
                .filter((user) => currentUser && user.id !== currentUser.id)
                .map((user) => (
                  <label key={user.id} className="user-checkbox">
                    <input
                      type="checkbox"
                      value={user.id}
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUser(user.id)}
                    />
                    {user.username}
                  </label>
                ))
            )}
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
