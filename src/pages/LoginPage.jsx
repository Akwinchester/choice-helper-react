import React, { useState } from "react";
import "../styles/LoginPage.css"; // Здесь оставим только layout (контейнеры)
import { loginUser } from "../api/login";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { username, password };

    try {
      const dataRes = await loginUser(data);
      console.log("dataRes", dataRes);

      if (dataRes?.access_token) {
        navigate("/");
      }
    } catch (error) {
      console.error("Ошибка входа:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Авторизация</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Введите имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
          autoComplete="current-password"
        />
        <button type="submit" className="button green">Войти</button>
      </form>
      <p>Нет аккаунта?</p>
      <button className="button blue" onClick={() => navigate("/register")}>
        Зарегистрироваться
      </button>
    </div>
  );
};

export default LoginPage;
