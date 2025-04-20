import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { fetchInvitedSessions } from "../../api/sessionsApi";
import SessionModal from "./SessionModal";
import SessionAnalysisModal from "./SessionAnalysisModal";

import "../../styles/modals/InvitesModal.css";

function InvitesModal({ isOpen, onClose }) {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [analyticsSessionId, setAnalyticsSessionId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchInvitedSessions()
        .then((data) => {
          // ✅ фильтруем сессии, где пользователь НЕ является создателем
          const filtered = data.filter((session) => !session.is_creator);
          setInvites(filtered);
        })
        .catch((err) => console.error("Ошибка загрузки приглашений:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleOpenSession = (sessionId) => {
    setAnalyticsSessionId(null);
    setSelectedSessionId(sessionId);
    onClose();
  };

  const handleOpenAnalytics = (sessionId) => {
    setSelectedSessionId(null);
    setAnalyticsSessionId(sessionId);
    onClose();
  };

  return (
    <>
      {isOpen && !loading && (
        <Modal isOpen={true} onClose={onClose}>
          <h2>Приглашения в сессии</h2>
          {invites.length === 0 ? (
            <p>Нет активных приглашений.</p>
          ) : (
            <ul className="invites-list">
              {invites.map((session) => (
                <li key={session.id} className="invite-item">
                  <div className="session-info">
                    <strong>Доска:</strong> {session.board_title || "—"}
                    <br />
                    <strong>Автор:</strong> {session.board_owner_username || "—"}
                    <br />
                    <strong>Дата:</strong>{" "}
                    {new Date(session.created_at).toLocaleDateString("ru-RU")}
                  </div>

                  <div className="invite-buttons">
                    {!session.is_completed ? (
                      <button
                        className="button green"
                        onClick={() => handleOpenSession(session.id)}
                      >
                        Открыть
                      </button>
                    ) : (
                      <>
                        <button
                          className="button gray"
                          onClick={() => handleOpenSession(session.id)}
                        >
                          Мои лайки
                        </button>
                        <button
                          className="button blue"
                          onClick={() => handleOpenAnalytics(session.id)}
                        >
                          Результаты сессии
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}

      {isOpen && loading && (
        <Modal isOpen={true} onClose={onClose}>
          <h2>Загрузка приглашений...</h2>
        </Modal>
      )}

      {selectedSessionId && (
        <SessionModal
          isOpen={true}
          onClose={() => setSelectedSessionId(null)}
          sessionId={selectedSessionId}
        />
      )}

      {analyticsSessionId && (
        <SessionAnalysisModal
          isOpen={true}
          onClose={() => setAnalyticsSessionId(null)}
          sessionId={analyticsSessionId}
        />
      )}
    </>
  );
}

export default InvitesModal;
