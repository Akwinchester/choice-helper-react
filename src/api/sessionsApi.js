const BASE_URL = 'http://127.0.0.1:8000';

// Создать новую сессию
export async function createSession(boardId, sessionType = 'individual') {
  const response = await fetch(`${BASE_URL}/sessions/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      board_id: boardId,
      type: sessionType
    })
  });
  if (!response.ok) {
    throw new Error('Failed to create session');
  }
  return response.json();
}

// Удалить сессию
export async function deleteSession(sessionId) {
  const response = await fetch(`${BASE_URL}/sessions/${sessionId}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete session');
  }
  return response.text();
}

// Получить все свайпы/лайки в рамках одной сессии
export async function fetchSwipesForSession(sessionId) {
  const response = await fetch(`${BASE_URL}/swipes/session/${sessionId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch swipes');
  }
  return response.json();
}

// Отправить лайк или дизлайк
export async function sendSwipe(sessionId, cardId, liked) {
  const response = await fetch(`${BASE_URL}/swipes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      card_id: cardId,
      user_id: null, // или ваш userId
      liked: liked
    })
  });
  if (!response.ok) {
    throw new Error('Failed to send swipe');
  }
  return response.json();
}
