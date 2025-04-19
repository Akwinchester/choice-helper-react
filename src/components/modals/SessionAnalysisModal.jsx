import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { fetchSessionAnalytics } from "../../api/sessionsApi";
import "../../styles/modals/SessionModal.css"; // Можно вынести аналитику отдельно

function SessionAnalysisModal({ isOpen, onClose, sessionId }) {
  const [grouped, setGrouped] = useState([]);
  const [loading, setLoading] = useState(true); // 🆕 состояние загрузки

  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const load = async () => {
      setLoading(true); // 🆕 включаем загрузку
      try {
        const data = await fetchSessionAnalytics(sessionId);
        setGrouped(data);
      } catch (err) {
        console.error("Ошибка при загрузке аналитики:", err);
      } finally {
        setLoading(false); // 🆕 выключаем загрузку
      }
    };

    load();
  }, [isOpen, sessionId]);

  const renderCard = (card) => (
    <div key={card.id} className="liked-card">
      {card.image_url ? (
        <img
          src={`http://127.0.0.1:8000/${card.image_url}`}
          alt={card.text}
          className="liked-card-image"
        />
      ) : (
        <div className="no-image">Нет изображения</div>
      )}
      <div className="liked-card-text">
        <strong>{card.text}</strong>
        <p>{card.short_description}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Заглушка, пока грузится */}
      {isOpen && loading && (
        <Modal isOpen={true} onClose={onClose}>
          <h2>Загрузка анализа...</h2>
        </Modal>
      )}

      {/* Основное содержимое — только после загрузки */}
      {isOpen && !loading && (
        <Modal isOpen={true} onClose={onClose}>
          <h2>Анализ сессии</h2>
          {grouped.length === 0 ? (
            <p>Нет данных для анализа.</p>
          ) : (
            grouped.map((group) => (
              <div key={group.count} style={{ marginBottom: "1.5rem" }}>
                <h4>Выбрали {group.count} участника(ов):</h4>
                <div className="liked-cards-grid">
                  {group.cards.map(renderCard)}
                </div>
              </div>
            ))
          )}
          <button className="button red" onClick={onClose}>
            Закрыть
          </button>
        </Modal>
      )}
    </>
  );
}

export default SessionAnalysisModal;
