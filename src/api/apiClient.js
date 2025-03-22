import axios from "axios";
import { refreshAccessToken } from "./login";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 👉 Добавляем access token в каждый запрос
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👉 Ответы: ловим ошибки
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ⛔ Не пытаться рефрешить токен для /auth/token и /auth/refresh
    const isAuthEndpoint =
      originalRequest.url.includes("/auth/token") ||
      originalRequest.url.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // Сохраняем новый access token
        localStorage.setItem("access_token", newAccessToken);

        // Обновляем заголовок и повторяем запрос
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("❌ Ошибка при обновлении токена:", refreshError);

        // 🔓 Можно очистить токены и разлогинить
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
