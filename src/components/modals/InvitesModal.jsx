// src/components/modals/InvitesModal.jsx
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import SessionModal from "./SessionModal";
import { fetchInvitedSessions } from "../../api/sessionsApi";

function InvitesModal({ isOpen, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    fetchInvitedSessions()
      .then(setSessions)
      .catch((err) => console.error("Ошибка загрузки приглашений", err))
      .finally(() => setIsLoading(false));
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2>Приглашения</h2>

        {isLoading ? (
          <p>Загрузка...</p>
        ) : sessions.length === 0 ? (
          <p>Нет приглашений</p>
        ) : (
          <ul className="session-list">
            {sessions.map((session) => (
              <li key={session.id} className="session-item">
                <div className="session-info">
                  <strong>Доска:</strong> {session.board_title || "—"}
                  <br />
                  <strong>Автор:</strong> {session.board_owner_username || "—"}
                  <br />
                  <strong>Дата:</strong>{" "}
                  {new Date(session.created_at).toLocaleDateString("ru-RU")}
                </div>
                <div className="session-actions">
                  <button
                    className="button green"
                    onClick={() => setSelectedSessionId(session.id)}
                  >
                    Открыть
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      {/* Открытие выбранной сессии */}
      {selectedSessionId && (
        <SessionModal
          isOpen={true}
          onClose={() => setSelectedSessionId(null)}
          sessionId={selectedSessionId}
        />
      )}
    </>
  );
}

export default InvitesModal;
