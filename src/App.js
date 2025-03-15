import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BoardsPage from './pages/BoardsPage';
import BoardDetailPage from './pages/BoardDetailPage';
import SessionPage from './pages/SessionPage';
import './App.css';


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
      </Routes>
    </div>
  );
}

export default App;
