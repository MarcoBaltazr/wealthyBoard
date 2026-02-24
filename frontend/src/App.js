import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Stocks from './pages/Stocks';
import FIIs from './pages/FIIs';
import Crypto from './pages/Crypto';
import AssetDetails from './pages/AssetDetails';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/acoes" element={<Stocks />} />
          <Route path="/fiis" element={<FIIs />} />
          <Route path="/cripto" element={<Crypto />} />
          <Route path="/ativo/:ticker" element={<AssetDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
