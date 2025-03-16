import React, { useState } from "react";
import "../styles/LoginPage.css"; // Подключаем стили
import { loginUser } from "../api/login";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const data = { username, password }; // Формируем объект с данными

    try {
      const dataRes = await loginUser(data);
      console.log("dataRes", dataRes);

      if (dataRes?.access_token) {
        navigate("/"); // Навигация при успешном логине
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
          className="input-field"
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
          autoComplete="current-password"
        />
        <button type="submit" className="login-button">Войти</button>
      </form>
      <p>Нет аккаунта?</p>
      <button className="register-button" onClick={() => navigate("/register")}>Зарегистрироваться</button>
    </div>
  );
};

export default LoginPage;
