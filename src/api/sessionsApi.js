import apiClient from "./apiClient";

// Создать новую сессию
export const createSession = async (boardId, sessionType = "individual") => {
  const response = await apiClient.post("/sessions/", {
    board_id: boardId,
    type: sessionType,
  });
  return response.data;
};

// Удалить сессию
export const deleteSession = async (sessionId) => {
  await apiClient.delete(`/sessions/${sessionId}`);
};

// Получить все свайпы/лайки в рамках одной сессии
export const fetchSwipesForSession = async (sessionId) => {
  const response = await apiClient.get(`/swipes/session/${sessionId}`);
  return response.data;
};

// Отправить лайк или дизлайк
export const sendSwipe = async (sessionId, cardId, liked) => {
  const response = await apiClient.post("/swipes/", {
    session_id: sessionId,
    card_id: cardId,
    user_id: null, // или ваш userId
    liked: liked,
  });
  return response.data;
};
