// src/components/modals/BoardSessionsModal.jsx
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { fetchSessionsByBoard, deleteSession } from "../../api/sessionsApi";
import "../../styles/modals/BoardSessionsModal.css";

function BoardSessionsModal({ isOpen, onClose, boardId }) {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSessionsByBoard(boardId);
      setSessions(data);
    } catch (err) {
      console.error("Ошибка при загрузке сессий:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && boardId) {
      loadSessions();
    }
  }, [isOpen, boardId]);

  const handleDelete = async (sessionId) => {
    const confirmed = window.confirm("Удалить эту сессию?");
    if (!confirmed) return;

    try {
      await deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      console.error("Ошибка при удалении сессии:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Сессии этой доски</h2>
      {isLoading ? (
        <p>Загрузка...</p>
      ) : sessions.length === 0 ? (
        <p>Сессии пока не созданы.</p>
      ) : (
        <ul className="session-list">
          {sessions.map((session) => (
            <li key={session.id} className="session-item">
              <div>
                <strong>ID:</strong> {session.id}
                <br />
                <strong>Тип:</strong> {session.type}
                <br />
                <strong>Создана:</strong> {new Date(session.created_at).toLocaleString()}
              </div>
              <button className="button red" onClick={() => handleDelete(session.id)}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

export default BoardSessionsModal;
