import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { fetchInvitedSessions } from "../../api/sessionsApi";
import SessionModal from "./SessionModal";

function InvitesModal({ isOpen, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      try {
        const res = await fetchInvitedSessions();
        // ✅ фильтруем только чужие приглашения (не созданные текущим пользователем)
        const filtered = res.filter((s) => !s.is_creator);
        setSessions(filtered);
      } catch (err) {
        console.error("Ошибка при загрузке приглашений", err);
      }
    };

    load();
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2>Ваши приглашения</h2>

        {sessions.length === 0 ? (
          <p>Нет приглашений на текущий момент.</p>
        ) : (
          <ul className="session-list">
            {sessions.map((s) => (
              <li key={s.id} className="session-item" style={{ marginBottom: "1rem" }}>
                <strong>Тип:</strong> {s.type} <br />
                <strong>Создана:</strong> {new Date(s.created_at).toLocaleString()} <br />
                <button className="button green" onClick={() => setSelectedSession(s)}>
                  Открыть сессию
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      {selectedSession && (
        <SessionModal
          isOpen={true}
          onClose={() => setSelectedSession(null)}
          sessionId={selectedSession.id}
        />
      )}
    </>
  );
}

export default InvitesModal;
