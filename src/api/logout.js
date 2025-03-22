import apiClient from "./apiClient";

export const logoutUser = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};