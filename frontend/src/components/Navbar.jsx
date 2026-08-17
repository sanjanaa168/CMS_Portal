import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, Shield, User } from 'lucide-react';
import { authService } from '../services/api';

export default function Navbar({ title, onToggleSidebar }) {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="nav-title-group">
        <button
          className="mobile-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="page-heading">{title || 'Dashboard'}</h1>
      </div>

      <div className="navbar-actions">
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: user.role === 'ADMIN' ? '#FEF2F2' : '#EEF2FF',
                color: user.role === 'ADMIN' ? '#DC2626' : '#4F46E5',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              {user.role === 'ADMIN' ? <Shield size={14} /> : <User size={14} />}
              <span>{user.role}</span>
            </div>

            <button onClick={handleLogout} className="btn-logout" title="Log out of application">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
