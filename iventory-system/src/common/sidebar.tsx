import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from './permissions';
import './css/sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-text">Inventory System</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>×</button>
        </div>

        <nav className="sidebar-nav">
          {/* Dashboard */}
          <div className="menu-item">
            <div className="menu-item-content">
              <span className="menu-item-icon">📊</span>
              <span className="menu-item-label">Dashboard</span>
            </div>
          </div>

          {/* Products - All roles can view */}
          <div className="menu-item">
            <div className="menu-item-content">
              <span className="menu-item-icon">📦</span>
              <span className="menu-item-label">Products</span>
            </div>
          </div>

          {/* Sales - Staff and above */}
          {hasPermission(user?.role || 'staff', 'sales.read') && (
            <div className="menu-item">
              <div className="menu-item-content">
                <span className="menu-item-icon">🛒</span>
                <span className="menu-item-label">Sales</span>
              </div>
            </div>
          )}

          {/* Purchase Orders - Manager and above */}
          {hasPermission(user?.role || 'staff', 'purchase_orders.read') && (
            <div className="menu-item">
              <div className="menu-item-content">
                <span className="menu-item-icon">📋</span>
                <span className="menu-item-label">Purchase Orders</span>
              </div>
            </div>
          )}

          {/* Reports - Based on permissions */}
          {hasPermission(user?.role || 'staff', 'reports.stock') && (
            <div className="menu-item">
              <div className="menu-item-content">
                <span className="menu-item-icon">📈</span>
                <span className="menu-item-label">Reports</span>
              </div>
            </div>
          )}

          {/* User Management - Admin only */}
          {hasPermission(user?.role || 'staff', 'users.read') && (
            <div className="menu-item">
              <div className="menu-item-content">
                <span className="menu-item-icon">👥</span>
                <span className="menu-item-label">Users</span>
              </div>
            </div>
          )}

          {/* Settings - Admin and limited Manager */}
          {hasPermission(user?.role || 'staff', 'settings.read') && (
            <div className="menu-item">
              <div className="menu-item-content">
                <span className="menu-item-icon">⚙️</span>
                <span className="menu-item-label">Settings</span>
              </div>
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info-sidebar">
            <div className="user-avatar-small">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name-small">{user?.firstName} {user?.lastName}</span>
              <span className="user-role-small">{user?.role}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;