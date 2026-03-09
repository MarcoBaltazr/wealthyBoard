import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#1e1e2e',
        color: '#e0e0e0',
        fontSize: '18px'
      }}>
        Carregando...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
