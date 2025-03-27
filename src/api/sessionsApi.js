import apiClient from "./apiClient";

// Создать новую сессию
export const createSession = async (boardId, sessionType = "individual") => {
  const response = await apiClient.post("/sessions/", {
    board_id: boardId,
    type: sessionType,
  });
  return response.data;
};

//// Удалить сессию
//export const deleteSession = async (sessionId) => {
//  await apiClient.delete(`/sessions/${sessionId}`);
//};

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

// Получить список сессий по board_id
export const fetchSessionsByBoard = async (boardId) => {
  const response = await apiClient.get(`/sessions/by-board/${boardId}`);
  return response.data;
};

// Удалить сессию по id
export const deleteSession = async (sessionId) => {
  await apiClient.delete(`/sessions/${sessionId}`);
};