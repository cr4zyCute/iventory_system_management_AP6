import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../common/permissions';
import MainLayout from '../layout/MainLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox, 
  faUsers, 
  faExclamationTriangle, 
  faDollarSign,
  faCog,
  faChartBar,
  faClipboardList,
  faHeartbeat
} from '@fortawesome/free-solid-svg-icons';
import './css/dashboard.css';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    lowStockItems: 0,
    totalSales: 0
  });

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch('/api/test');
        if (response.ok) {
          setBackendStatus('connected');
          // Load dashboard stats
          loadDashboardStats();
        } else {
          setBackendStatus('disconnected');
        }
      } catch (error) {
        setBackendStatus('disconnected');
      }
    };

    const loadDashboardStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          // Fallback to mock data
          setStats({
            totalProducts: 125,
            totalUsers: 8,
            lowStockItems: 12,
            totalSales: 45230
          });
        }
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        // Fallback to mock data
        setStats({
          totalProducts: 125,
          totalUsers: 8,
          lowStockItems: 12,
          totalSales: 45230
        });
      }
    };

    checkBackendConnection();
  }, []);


  return (
    <MainLayout title="🛡️ Admin Dashboard">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">Admin Dashboard</h1>
          <p className="content-subtitle">System overview and management tools</p>
        </div>

        <div className="status-bar">
          <div className="status-indicator">
            <span className={`status-dot ${backendStatus}`}></span>
            Backend: {backendStatus === 'checking' ? 'Checking...' : backendStatus}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faBox} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalProducts}</div>
              <div className="stat-label">Total Products</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.lowStockItems}</div>
              <div className="stat-label">Low Stock Items</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faDollarSign} />
            </div>
            <div className="stat-content">
              <div className="stat-value">${stats.totalSales.toLocaleString()}</div>
              <div className="stat-label">Total Sales</div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
            {/* System Management - Admin Only */}
            {hasPermission(user?.role || 'staff', 'settings.update') && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">
                      <FontAwesomeIcon icon={faCog} />
                    </span>
                    System Management
                  </h3>
                </div>
                <div className="card-content">
                  <p>Manage system settings, configurations, and global preferences.</p>
                  <div className="card-actions">
                    <button className="action-btn primary">System Settings</button>
                    <button className="action-btn secondary">Backup & Restore</button>
                  </div>
                </div>
              </div>
            )}

            {/* User Management - Admin Only */}
            {hasPermission(user?.role || 'staff', 'users.create') && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">
                      <FontAwesomeIcon icon={faUsers} />
                    </span>
                    User Management
                  </h3>
                </div>
                <div className="card-content">
                  <p>Create, edit, and manage user accounts and permissions.</p>
                  <div className="card-actions">
                    <button className="action-btn primary">Manage Users</button>
                    <button className="action-btn secondary">Role Permissions</button>
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Overview */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">
                    <FontAwesomeIcon icon={faBox} />
                  </span>
                  Inventory Overview
                </h3>
              </div>
              <div className="card-content">
                <p>Complete overview of all inventory items and categories.</p>
                <div className="card-actions">
                  <button className="action-btn primary">View All Items</button>
                  <button className="action-btn secondary">Categories</button>
                </div>
              </div>
            </div>

            {/* Reports & Analytics */}
            {hasPermission(user?.role || 'staff', 'reports.audit') && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">
                      <FontAwesomeIcon icon={faChartBar} />
                    </span>
                    Reports & Analytics
                  </h3>
                </div>
                <div className="card-content">
                  <p>Generate comprehensive reports and view system analytics.</p>
                  <div className="card-actions">
                    <button className="action-btn primary">Generate Reports</button>
                    <button className="action-btn secondary">Analytics</button>
                  </div>
                </div>
              </div>
            )}

            {/* Audit Logs - Admin Only */}
            {hasPermission(user?.role || 'staff', 'audit.read') && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">
                      <FontAwesomeIcon icon={faClipboardList} />
                    </span>
                    Audit Logs
                  </h3>
                </div>
                <div className="card-content">
                  <p>View system audit logs and user activity tracking.</p>
                  <div className="card-actions">
                    <button className="action-btn primary">View Logs</button>
                    <button className="action-btn secondary">Export Logs</button>
                  </div>
                </div>
              </div>
            )}

            {/* System Health */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">
                    <FontAwesomeIcon icon={faHeartbeat} />
                  </span>
                  System Health
                </h3>
              </div>
              <div className="card-content">
                <p>Monitor system performance and health metrics.</p>
                <div className="card-actions">
                  <button className="action-btn primary">Health Check</button>
                  <button className="action-btn secondary">Performance</button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
