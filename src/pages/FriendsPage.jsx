import React, { useEffect, useState } from "react";
import { getUserInfo } from "../api/auth";
import { fetchUsers, searchUsers } from "../api/userApi";
import {
  fetchFriends,
  fetchIncomingRequests,
  fetchSentRequests,
  acceptFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "../api/friendsApi";
import { useNavigate } from "react-router-dom";
import "../styles/FriendsPage.css";

function FriendsPage() {
  const [username, setUsername] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const me = await getUserInfo();
      setUsername(me.username);

      const allUsers = await fetchUsers();
      setUsers(allUsers.filter((u) => u.username !== me.username));

      const f = await fetchFriends();
      const incoming = await fetchIncomingRequests();
      const sent = await fetchSentRequests();

      setFriends(f);
      setIncomingRequests(incoming);
      setSentRequests(sent);
    };
    load();
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!search.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const results = await searchUsers(search.trim());
        setSearchResults(results);
      } catch (err) {
        console.error("Ошибка при поиске:", err);
        setSearchResults([]);
      }
    };

    const delay = setTimeout(fetchSearch, 300); // небольшая задержка (debounce)
    return () => clearTimeout(delay);
  }, [search]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const handleAccept = async (userId) => {
    await acceptFriendRequest(userId);
    const acceptedUser = incomingRequests.find((u) => u.id === userId);
    setIncomingRequests((prev) => prev.filter((u) => u.id !== userId));
    setFriends((prev) => [...prev, acceptedUser]);
  };

  const handleRemoveFriend = async (userId) => {
    if (!window.confirm("Удалить этого пользователя из друзей?")) return;
    await removeFriend(userId);
    setFriends((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleSendRequest = async (userId) => {
    try {
      await sendFriendRequest(userId);
      const updatedSent = await fetchSentRequests();
      setSentRequests(updatedSent);
    } catch (err) {
      alert("Не удалось отправить заявку");
    }
  };

  const isInFriends = (id) => friends.some((f) => f.id === id);
  const isInRequests = (id) =>
    incomingRequests.some((r) => r.id === id) || sentRequests.some((r) => r.id === id);

  return (
    <div className="friends-container">
      <div className="friends-header">
        <h1>Друзья {username}</h1>
        <div className="friends-buttons">
          <button onClick={() => navigate("/")}>Доски</button>
          <button className="red" onClick={handleLogout}>Выйти</button>
        </div>
      </div>

      <input
        className="input"
        placeholder="Поиск пользователей..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search.trim() && (
        <div className="search-results-popup">
          {searchResults.length === 0 ? (
            <p>Пользователи не найдены</p>
          ) : (
            searchResults.map((user) => (
              <div key={user.id} className="friend-card">
                <span className="username">{user.username}</span>
                {!isInFriends(user.id) && !isInRequests(user.id) && (
                  <div className="card-buttons">
                    <button
                      className="button blue"
                      onClick={() => handleSendRequest(user.id)}
                    >
                      Добавить в друзья
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <h3>Мои друзья</h3>
      {friends.length === 0 ? (
        <p>Нет друзей</p>
      ) : (
        <div>
          {friends.map((f) => (
            <div key={f.id} className="friend-card">
              <span className="username">{f.username}</span>
              <div className="card-buttons">
                <button
                  className="button red"
                  onClick={() => handleRemoveFriend(f.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3>Входящие заявки</h3>
      {incomingRequests.length === 0 ? (
        <p>Нет входящих заявок</p>
      ) : (
        <div>
          {incomingRequests.map((user) => (
            <div key={user.id} className="friend-card">
              <span className="username">{user.username}</span>
              <div className="card-buttons">
                <button
                  className="button green"
                  onClick={() => handleAccept(user.id)}
                >
                  Принять
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3>Исходящие заявки</h3>
      {sentRequests.length === 0 ? (
        <p>Нет исходящих заявок</p>
      ) : (
        <div>
          {sentRequests.map((user) => (
            <div key={user.id} className="friend-card">
              <span className="username">{user.username}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FriendsPage;
