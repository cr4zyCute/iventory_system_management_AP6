import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faSignOutAlt, 
  faUser, 
  faCog, 
  faBell,
  faChevronDown,
  faUserShield,
  faUserTie,
  faUserCog,
  faCrown,
  faTools,
  faClipboardList,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import './css/navbar.css';

interface NavbarProps {
  title: string;
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ title, onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Get role-specific info
  const getRoleInfo = () => {
    switch (user?.role) {
      case 'admin':
        return {
          icon: faUserShield,
          badge: 'System Administrator',
          color: '#dc3545',
          notifications: 3
        };
      case 'manager':
        return {
          icon: faUserTie,
          badge: 'Operations Manager',
          color: '#ffc107',
          notifications: 5
        };
      case 'staff':
        return {
          icon: faUserCog,
          badge: 'Staff Member',
          color: '#28a745',
          notifications: 2
        };
      default:
        return {
          icon: faUser,
          badge: 'User',
          color: '#6c757d',
          notifications: 0
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h1 className="navbar-title">{title}</h1>
      </div>

      <div className="navbar-right">
        {/* Notifications */}
        <div className="navbar-notifications">
          <button className="notification-btn" title="Notifications">
            <FontAwesomeIcon icon={faBell} />
            {roleInfo.notifications > 0 && (
              <span className="notification-badge">{roleInfo.notifications}</span>
            )}
          </button>
        </div>

        {/* Role-specific Profile */}
        <div className="user-info" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
          <div className="user-avatar" style={{ backgroundColor: roleInfo.color }}>
            <FontAwesomeIcon icon={roleInfo.icon} />
          </div>
          <div className="user-details">
            <span className="user-name">{user?.firstName} {user?.lastName}</span>
            <span className="user-role" style={{ color: roleInfo.color }}>
              {roleInfo.badge}
            </span>
          </div>
          <FontAwesomeIcon icon={faChevronDown} className="dropdown-arrow" />
        </div>

        {/* Profile Dropdown */}
        {showProfileDropdown && (
          <div className="profile-dropdown">
            <div className="dropdown-header">
              <div className="dropdown-avatar" style={{ backgroundColor: roleInfo.color }}>
                <FontAwesomeIcon icon={roleInfo.icon} />
              </div>
              <div className="dropdown-info">
                <div className="dropdown-name">{user?.firstName} {user?.lastName}</div>
                <div className="dropdown-email">{user?.email}</div>
                <div className="dropdown-role" style={{ color: roleInfo.color }}>
                  {roleInfo.badge}
                </div>
              </div>
            </div>
            
            <div className="dropdown-divider"></div>
            
            <div className="dropdown-menu">
              <button className="dropdown-item">
                <FontAwesomeIcon icon={faUser} />
                <span>Profile Settings</span>
              </button>
              
              {user?.role === 'admin' && (
                <>
                  {/* <button className="dropdown-item">
                    <FontAwesomeIcon icon={faCrown} />
                    <span>Admin Panel</span>
                  </button>
                  <button className="dropdown-item">
                    <FontAwesomeIcon icon={faCog} />
                    <span>System Settings</span>
                  </button> */}
                </>
              )}
              
              {user?.role === 'manager' && (
                <>
                  <button className="dropdown-item">
                    <FontAwesomeIcon icon={faTools} />
                    <span>Manager Tools</span>
                  </button>
                  <button className="dropdown-item">
                    <FontAwesomeIcon icon={faChartBar} />
                    <span>Reports</span>
                  </button>
                </>
              )}
              
              {user?.role === 'staff' && (
                <button className="dropdown-item">
                  <FontAwesomeIcon icon={faClipboardList} />
                  <span>My Tasks</span>
                </button>
              )}
              
              <div className="dropdown-divider"></div>
              
              <button className="dropdown-item logout-item" onClick={logout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
