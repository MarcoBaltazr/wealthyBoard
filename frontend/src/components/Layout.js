import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, TrendingUp, Building2, Bitcoin, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Detectar mudanças no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fechar menu ao mudar de página no mobile
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location, isMobile]);

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
      {/* Botão hamburguer mobile */}
      {isMobile && (
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Backdrop mobile */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="mobile-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${isMobile && !isMobileMenuOpen ? 'mobile-hidden' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">💰</div>
            {!isCollapsed && <h1 className="logo-text">WealthyBoard</h1>}
          </div>
          {!isCollapsed && user && (
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
                title={isCollapsed ? item.label : ''}
              >
                <Icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <button 
            className="logout-btn"
            onClick={handleLogout}
            title={isCollapsed ? 'Sair' : ''}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Sair</span>}
          </button>
          
          <button 
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expandir' : 'Recolher'}
          >
            {isCollapsed ? '→' : '←'}
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
