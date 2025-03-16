import apiClient from "./apiClient";

// Получить список всех досок
export const fetchBoards = async () => {
  const response = await apiClient.get("/boards");
  return response.data;
};

// Создать новую доску
export const createBoard = async (data) => {
  const response = await apiClient.post("/boards/", data);
  return response.data;
};

// Удалить доску
export const deleteBoard = async (boardId) => {
  await apiClient.delete(`/boards/${boardId}`);
};

// Обновить доску
export const updateBoard = async (boardId, data) => {
  const response = await apiClient.put(`/boards/${boardId}`, data);
  return response.data;
};

// Получить детали конкретной доски
export const fetchBoard = async (boardId) => {
  const response = await apiClient.get(`/boards/${boardId}`);
  return response.data;
};
