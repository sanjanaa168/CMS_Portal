import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  ShieldAlert,
  ClipboardList,
  User,
} from 'lucide-react';
import { authService } from '../services/api';

export default function Sidebar({ isOpen, onCloseMobile }) {
  const user = authService.getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <ClipboardList size={20} />
        </div>
        <span className="sidebar-logo-text">CMS Portal</span>
        <span className="sidebar-badge">{isAdmin ? 'Admin' : 'User'}</span>
      </div>

      <nav className="sidebar-nav">
        {isAdmin ? (
          <>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <LayoutDashboard size={18} />
              <span>Admin Dashboard</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <LayoutDashboard size={18} />
              <span>My Complaints</span>
            </NavLink>

            <NavLink
              to="/complaints/create"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <PlusCircle size={18} />
              <span>File Complaint</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="user-snippet">
            <div className="user-avatar">{getInitials(user.name)}</div>
            <div className="user-info-text">
              <div className="user-name">{user.name}</div>
              <div className="user-role-badge">{user.email}</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
