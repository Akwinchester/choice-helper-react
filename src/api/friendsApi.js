import apiClient from "./apiClient";


export const fetchIncomingRequests = async () => {
  const response = await apiClient.get("/friends/requests/incoming");
  return response.data;
};

export const fetchSentRequests = async () => {
  const response = await apiClient.get("/friends/requests/sent");
  return response.data;
};

export const acceptFriendRequest = async (requesterId) => {
  const response = await apiClient.post(`/friends/accept/${requesterId}`);
  return response.data;
};

export const removeFriend = async (friendId) => {
    const response = await apiClient.delete(`/friends/remove/${friendId}`);
    return response.data;
  };
  
  export const sendFriendRequest = async (targetId) => {
    const res = await fetch(`http://127.0.0.1:8000/friends/request/${targetId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!res.ok) throw new Error("Ошибка отправки запроса");
    return await res.json();
  };

  export async function fetchFriends() {
    const res = await fetch("http://127.0.0.1:8000/friends", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
  
    if (!res.ok) throw new Error("Не удалось загрузить друзей");
    return await res.json();
  }