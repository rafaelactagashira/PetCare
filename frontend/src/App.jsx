import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/admin/login"
          element={user ? <Navigate to="/admin" replace /> : <LoginPage onLogin={setUser} />}
        />
        <Route
          path="/admin"
          element={user ? <AdminPanel user={user} onLogout={() => setUser(null)} /> : <Navigate to="/admin/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
