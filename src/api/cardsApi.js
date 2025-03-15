const BASE_URL = 'http://127.0.0.1:8000';

// Получить карточки конкретной доски
export async function fetchCards(boardId) {
  const response = await fetch(`${BASE_URL}/boards/${boardId}/cards`);
  if (!response.ok) {
    throw new Error('Failed to fetch cards');
  }
  return response.json();
}

// Создать новую карточку
export async function createCard(formData) {
  const response = await fetch(`${BASE_URL}/cards/`, {
    method: 'POST',
    body: formData, // Передаем FormData напрямую
  });

  if (!response.ok) {
    throw new Error('Failed to create card');
  }

  return response.json(); // ✅ Return теперь внутри функции
}

// Привязать уже созданную карточку к доске
export async function attachCardToBoard(boardId, cardId) {
  console.log("attachCardToBoard boardId:", boardId);
  console.log("attachCardToBoard cardId:", cardId);

  if (!boardId || typeof boardId !== "string") {
    console.error("Ошибка: boardId должен быть строкой!", boardId);
    return;
  }

  const response = await fetch(`${BASE_URL}/boards/${boardId}/cards/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ card_id: cardId }),
  });

  if (!response.ok) {
    throw new Error('Failed to attach card to board');
  }

  return response.json();
}
