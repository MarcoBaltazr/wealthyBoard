import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Stocks from './pages/Stocks';
import FIIs from './pages/FIIs';
import Crypto from './pages/Crypto';
import AssetDetails from './pages/AssetDetails';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rotas protegidas */}
          <Route path="/" element={<PrivateRoute><Navigate to="/dashboard" replace /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/acoes" element={<PrivateRoute><Layout><Stocks /></Layout></PrivateRoute>} />
          <Route path="/fiis" element={<PrivateRoute><Layout><FIIs /></Layout></PrivateRoute>} />
          <Route path="/cripto" element={<PrivateRoute><Layout><Crypto /></Layout></PrivateRoute>} />
          <Route path="/ativo/:ticker" element={<PrivateRoute><Layout><AssetDetails /></Layout></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
