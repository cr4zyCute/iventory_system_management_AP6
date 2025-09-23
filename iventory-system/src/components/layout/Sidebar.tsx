import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUsers, 
  faBox, 
  faClipboardList, 
  faTags, 
  faShoppingCart, 
  faFileAlt, 
  faCog, 
  faEye, 
  faUser,
  faTasks,
  faChartBar,
  faWarehouse,
  faTimes,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import './css/sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any; // FontAwesome icon
  path?: string;
  children?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['inventory']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuClick = (path?: string) => {
    if (path) {
      navigate(path);
      // Let MainLayout handle whether to close or not based on screen size
      onClose();
    }
  };

  // Define menu items based on user role
  const getMenuItems = (): MenuItem[] => {
    const role = user?.role || 'staff';
    
    const baseItems: MenuItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: faChartLine,
        path: '/dashboard'
      }
    ];

    if (role === 'admin') {
      return [
        ...baseItems,
        {
          id: 'users',
          label: 'User Management',
          icon: faUsers,
          path: '/admin/users'
        },
        {
          id: 'inventory',
          label: 'Inventory',
          icon: faBox,
          children: [
            {
              id: 'products',
              label: 'Products',
              icon: faClipboardList,
              path: '/admin/products'
            },
            {
              id: 'categories',
              label: 'Categories',
              icon: faTags,
              path: '/admin/categories'
            }
          ]
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: faChartBar,
          path: '/admin/reports'
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: faCog,
          path: '/admin/settings'
        }
      ];
    }

    if (role === 'manager') {
      return [
        ...baseItems,
        {
          id: 'inventory',
          label: 'Inventory',
          icon: faBox,
          children: [
            {
              id: 'inventory-management',
              label: 'Inventory Management',
              icon: faClipboardList,
              path: '/manager/inventory'
            },
            {
              id: 'stock-movements',
              label: 'Stock Movements',
              icon: faWarehouse,
              path: '/manager/stock-movements'
            }
          ]
        },
        {
          id: 'purchase-orders',
          label: 'Purchase Orders',
          icon: faShoppingCart,
          path: '/manager/purchase-orders'
        },
        {
          id: 'staff-oversight',
          label: 'Staff Management',
          icon: faUsers,
          path: '/manager/staff'
        },
        {
          id: 'suppliers',
          label: 'Suppliers',
          icon: faBox,
          path: '/manager/suppliers'
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: faFileAlt,
          path: '/manager/reports'
        }
      ];
    }

    // Staff menu
    return [
      ...baseItems,
      {
        id: 'tasks',
        label: 'My Tasks',
        icon: faTasks,
        path: '/staff/tasks'
      },
      {
        id: 'inventory-view',
        label: 'View Inventory',
        icon: faEye,
        path: '/staff/inventory'
      },
      {
        id: 'profile',
        label: 'Profile',
        icon: faUser,
        path: '/staff/profile'
      }
    ];
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const isActive = location.pathname === item.path;

    return (
      <div key={item.id} className={`menu-item level-${level}`}>
        <div 
          className={`menu-item-content ${isActive ? 'active' : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleMenu(item.id);
            } else {
              handleMenuClick(item.path);
            }
          }}
        >
          <span className="menu-item-icon">
            <FontAwesomeIcon icon={item.icon} />
          </span>
          <span className="menu-item-label">{item.label}</span>
          {hasChildren && (
            <span className={`menu-arrow ${isExpanded ? 'expanded' : ''}`}>
              <FontAwesomeIcon icon={faChevronDown} />
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="submenu">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">
              <FontAwesomeIcon icon={faBox} />
            </span>
            <span className="logo-text">Inventory Pro</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {getMenuItems().map(item => renderMenuItem(item))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info-sidebar">
            <div className="user-avatar-small">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="user-details-small">
              <span className="user-name-small">{user?.firstName} {user?.lastName}</span>
              <span className="user-role-small">{user?.role?.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
