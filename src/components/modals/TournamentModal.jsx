import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { getNextPair, voteInBracket, getBracket } from "../../api/bracketApi";
import { fetchCards } from "../../api/cardsApi";
import { fetchSessionById } from "../../api/sessionsApi";
import BracketCard from "./BracketCard";
import "../../styles/modals/TournamentModal.css";

function TournamentModal({ bracketId, onClose }) {
  const [pair, setPair] = useState([]);
  const [roundNumber, setRoundNumber] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [cardsData, setCardsData] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [finalWinnerCard, setFinalWinnerCard] = useState(null);
  const [loading, setLoading] = useState(true); // 🆕

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true); // 🆕
        const bracket = await getBracket(bracketId);
        const session = await fetchSessionById(bracket.session_id);
        const boardId = session.board_id;

        const all = await fetchCards(boardId);
        setAllCards(all);

        if (bracket.results?.final_winner) {
          const winnerCard = all.find((c) => c.id === bracket.results.final_winner);
          setFinalWinnerCard(winnerCard);
          setIsFinished(true);
        } else {
          const next = await getNextPair(bracketId);
          if (next.finished) {
            setIsFinished(true);
          } else {
            setPair([next.participant_1, next.participant_2]);
            setRoundNumber(next.round_number);
            const selected = all.filter((c) =>
              [next.participant_1, next.participant_2].includes(c.id)
            );
            setCardsData(selected);
          }
        }
      } catch (err) {
        console.error("Ошибка инициализации турнира:", err);
      } finally {
        setLoading(false); // 🆕
      }
    };

    if (bracketId) init();
  }, [bracketId]);

  const handleVote = async (winnerId) => {
    try {
      setLoading(true); // 🆕 блокируем повторный клик
      await voteInBracket(bracketId, roundNumber, winnerId);

      const bracket = await getBracket(bracketId);
      if (bracket.results?.final_winner) {
        const winnerCard = allCards.find((c) => c.id === bracket.results.final_winner);
        setFinalWinnerCard(winnerCard);
        setIsFinished(true);
      } else {
        const next = await getNextPair(bracketId);
        if (next.finished) {
          setIsFinished(true);
        } else {
          setPair([next.participant_1, next.participant_2]);
          setRoundNumber(next.round_number);
          const selected = allCards.filter((c) =>
            [next.participant_1, next.participant_2].includes(c.id)
          );
          setCardsData(selected);
        }
      }
    } catch (err) {
      console.error("Ошибка голосования:", err);
    } finally {
      setLoading(false); // 🆕
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <h2>Турнир</h2>

      {loading ? (
        <p>Загрузка...</p>
      ) : isFinished && finalWinnerCard ? (
        <div className="winner-container">
          <h3>🏆 Победитель турнира:</h3>
          <BracketCard card={finalWinnerCard} onClick={() => {}} />
        </div>
      ) : cardsData.length === 2 ? (
        <div className="tournament-pair">
          {cardsData.map((card) => (
            <BracketCard
              key={card.id}
              card={card}
              onClick={loading ? () => {} : handleVote} // 🔐 безопасный клик
              disabled={loading} // 👇 передаём в карточку
            />
          ))}
        </div>
      ) : (
        <p>Нет доступных карточек</p>
      )}
    </Modal>
  );
}

export default TournamentModal;
