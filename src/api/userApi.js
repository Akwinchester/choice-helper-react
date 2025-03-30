export async function fetchUsers() {
  const res = await fetch('http://127.0.0.1:8000/auth/users/', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
  });
  if (!res.ok) throw new Error("Ошибка загрузки пользователей");
  return await res.json();
}
