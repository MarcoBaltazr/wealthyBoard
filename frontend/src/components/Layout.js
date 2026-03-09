import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, TrendingUp, Building2, Bitcoin, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/acoes', icon: TrendingUp, label: 'Ações & BDRs' },
    { path: '/fiis', icon: Building2, label: 'FIIs' },
    { path: '/cripto', icon: Bitcoin, label: 'Criptomoedas' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">💰</div>
            {!collapsed && <h1 className="logo-text">WealthyBoard</h1>}
          </div>
          {!collapsed && user && (
            <div className="user-info">
              <div className="user-name">{user.name}</div>
            </div>
          )}
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <button 
            className="logout-btn"
            onClick={handleLogout}
            title={collapsed ? 'Sair' : ''}
          >
            <LogOut size={20} />
            {!collapsed && <span>Sair</span>}
          </button>
          
          <button 
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expandir' : 'Recolher'}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
      </aside>
      
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
