// src/api/auth.js
import apiClient from "./apiClient";

// ✅ Сохранение токенов
const saveAccessToken = (token) => {
  localStorage.setItem("access_token", token);
};

const saveRefreshToken = (token) => {
  localStorage.setItem("refresh_token", token);
};

// ✅ Получить текущего пользователя (GET /auth/protected)
export const getUserInfo = async () => {
  const response = await apiClient.get("/auth/protected");
  return response.data;
};

// ✅ Войти (POST /auth/token)
export const loginUser = async (data) => {
  try {
    const response = await apiClient.post("/auth/token", data);
    const { access_token, refresh_token } = response.data;

    saveAccessToken(access_token);
    saveRefreshToken(refresh_token);

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      alert("❌ Неверный логин или пароль");
    } else {
      console.error("Ошибка входа:", error);
    }
    throw error;
  }
};

// ✅ Обновить access токен по refresh токену
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("Refresh token отсутствует!");

    const response = await apiClient.post("/auth/refresh", {
      refresh_token: refreshToken,
    });

    const { access_token, refresh_token: newRefreshToken } = response.data;

    saveAccessToken(access_token);
    saveRefreshToken(newRefreshToken);

    return access_token;
  } catch (error) {
    console.error("Ошибка при обновлении токена", error);
    throw error;
  }
};

// ✅ Выйти (POST /auth/logout)
export const logoutUser = async () => {
  const response = await apiClient.post("/auth/logout");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  return response.data;
};

// ✅ Зарегистрировать пользователя (POST /auth/register)
export const registerUser = async (data) => {
  try {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Ошибка регистрации", error);
    throw error;
  }
};
