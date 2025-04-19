import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BoardsPage from './pages/BoardsPage';
import BoardDetailPage from './pages/BoardDetailPage';
import SessionPage from './pages/SessionPage';
import './App.css';
import './styles/main.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FriendsPage from "./pages/FriendsPage";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Главная страница (список досок) */}
        <Route path="/" element={<BoardsPage />} />

        {/* Детальная страница выбранной доски */}
        <Route path="/board/:boardId" element={<BoardDetailPage />} />

        {/* Страница сессии (просмотр карточек, лайки и т.д.) */}
        <Route path="/session/:sessionId" element={<SessionPage />} />

        {/* Страница авторизации (просмотр карточек, лайки и т.д.) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Страница регистрации (просмотр карточек, лайки и т.д.) */}
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/friends" element={<FriendsPage />} />
      </Routes>
    </div>
  );
}

export default App;
