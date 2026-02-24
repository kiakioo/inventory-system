import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

// Komponen sederhana untuk Dashboard (sementara)
const DashboardPlaceholder = () => (
  <div className="p-10 text-center">
    <h1 className="text-4xl font-bold text-blue-600">Dashboard Berhasil Dimuat!</h1>
    <p>Selamat, Anda sudah melewati gerbang keamanan JWT.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;