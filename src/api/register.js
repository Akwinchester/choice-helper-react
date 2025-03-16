import apiClient from "./apiClient";

export const registerUser = async (data) => {
  try {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Ошибка регистрации", error);
    throw error;
  }
};
