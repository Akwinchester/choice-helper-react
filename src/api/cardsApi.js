import apiClient from "./apiClient";

// Получить карточки конкретной доски
export const fetchCards = async (boardId) => {
  const response = await apiClient.get(`/boards/${boardId}/cards`);
  return response.data;
};

// Создать новую карточку
export const createCard = async (formData) => {
  const response = await apiClient.post("/cards/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Привязать уже созданную карточку к доске
export const attachCardToBoard = async (boardId, cardId) => {
  const response = await apiClient.post(`/boards/${boardId}/cards/`, {
    card_id: cardId,
  });
  return response.data;
};

// Обновить карточку
export const updateCard = async (cardId, formData) => {
  const response = await apiClient.put(`/cards/${cardId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Удалить карточку
export const deleteCard = async (cardId) => {
  await apiClient.delete(`/cards/${cardId}`);
};
