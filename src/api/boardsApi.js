const BASE_URL = 'http://127.0.0.1:8000';

// Получить список всех досок
export async function fetchBoards() {
  const response = await fetch(`${BASE_URL}/boards`);
  if (!response.ok) {
    throw new Error('Failed to fetch boards');
  }
  return response.json();
}

// Создать новую доску
export async function createBoard(data) {
  const response = await fetch(`${BASE_URL}/boards/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to create board');
  }
  return response.json();
}

// Удалить доску
export async function deleteBoard(boardId) {
  const response = await fetch(`${BASE_URL}/boards/${boardId}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete board');
  }
  return response.text();
}

// Обновить доску
export async function updateBoard(boardId, data) {
  const response = await fetch(`${BASE_URL}/boards/${boardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to update board');
  }
  return response.json();
}

// Получить детали конкретной доски
export async function fetchBoard(boardId) {
  const response = await fetch(`${BASE_URL}/boards/${boardId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch board detail');
  }
  return response.json();
}
