import React, { useState } from "react";
import "../styles/RegisterPage.css"; // оставим только layout-классы
import { registerUser } from "../api/register";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { username, email, password };

    try {
      const dataRes = await registerUser(data);
      console.log("dataRes", dataRes);

      if (dataRes?.id) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Ошибка регистрации:", error);
    }
  };

  return (
    <div className="register-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} className="register-form" autoComplete="off">
        <input
          type="text"
          placeholder="Введите имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
          required
          autoComplete="off"
        />
        <input
          type="email"
          placeholder="Введите email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
          autoComplete="off"
        />
        <input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
          autoComplete="new-password"
        />
        <button type="submit" className="button green">Зарегистрироваться</button>
      </form>
      <p>Уже есть аккаунт?</p>
      <button className="button blue" onClick={() => navigate("/login")}>Войти</button>
    </div>
  );
};

export default RegisterPage;
