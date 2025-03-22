import apiClient from "./apiClient";

// Сохраняем access_token в localStorage
const saveAccessToken = (token) => {
  localStorage.setItem("access_token", token);
};

// Сохраняем refresh_token в localStorage
const saveRefreshToken = (token) => {
  localStorage.setItem("refresh_token", token);
};

// 🔐 Вход пользователя
export const loginUser = async (data) => {
  try {
    const response = await apiClient.post("/auth/token", data);
    const { access_token, refresh_token } = response.data;

    saveAccessToken(access_token);
    saveRefreshToken(refresh_token);

    return response.data;
  } catch (error) {
    // ❗ Показываем уведомление при 401 (неверный логин или пароль)
    if (error.response?.status === 401) {
      alert("❌ Неверный логин или пароль");
    } else {
      console.error("Ошибка входа:", error);
    }

    throw error;
  }
};

// 🔄 Обновление access токена по refresh токену
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("Refresh token отсутствует!");

    const response = await apiClient.post("/auth/refresh", {
      refresh_token: refreshToken,
    });

    const { access_token, refresh_token: newRefreshToken } = response.data;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", newRefreshToken);

    return access_token;
  } catch (error) {
    console.error("Ошибка при обновлении токена", error);
    throw error;
  }
};
