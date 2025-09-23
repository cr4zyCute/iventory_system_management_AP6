import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './css/navbar.css';

interface NavbarProps {
  title: string;
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ title, onMenuToggle }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h1 className="navbar-title">{title}</h1>
      </div>

      <div className="navbar-right">
        <div className="user-info">
          <div className="user-avatar">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.firstName} {user?.lastName}</span>
            <span className="user-role">{user?.role?.toUpperCase()}</span>
          </div>
        </div>
        
        <button className="logout-btn" onClick={logout} title="Logout">
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
