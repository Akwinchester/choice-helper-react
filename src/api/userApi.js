export async function fetchUsers() {
  const res = await fetch('http://127.0.0.1:8000/auth/users/', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
  });
  if (!res.ok) throw new Error("Ошибка загрузки пользователей");
  return await res.json();
}

export const searchUsers = async (query) => {
  const res = await fetch(`http://127.0.0.1:8000/auth/search?q=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
  if (!res.ok) throw new Error("Ошибка поиска");
  return await res.json();
};