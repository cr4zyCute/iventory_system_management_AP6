import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../common/permissions';
import MainLayout from '../layout/MainLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faCheckCircle, faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './css/dashboard.css';

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [stats, setStats] = useState({
    assignedTasks: 0,
    completedToday: 0,
    pendingRequests: 0,
    lowStockAlerts: 0
  });

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch('/api/test');
        if (response.ok) {
          setBackendStatus('connected');
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
        setStats({
          assignedTasks: 5,
          completedToday: 3,
          pendingRequests: 2,
          lowStockAlerts: 8
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }
    };

    checkBackendConnection();
  }, []);


  return (
    <MainLayout title="💼 Staff Dashboard">
      <div className="staff-dashboard">
        <div className="content-header">
          <h1 className="content-title">Staff Dashboard</h1>
          <p className="content-subtitle">Daily tasks and inventory operations</p>
        </div>

        <div className="status-bar">
          <div className="status-indicator">
            <span className={`status-dot ${backendStatus}`}></span>
            Backend: {backendStatus === 'checking' ? 'Checking...' : backendStatus}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faClipboardList} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.assignedTasks}</div>
              <div className="stat-label">Assigned Tasks</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.completedToday}</div>
              <div className="stat-label">Completed Today</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.pendingRequests}</div>
              <div className="stat-label">Pending Requests</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.lowStockAlerts}</div>
              <div className="stat-label">Low Stock Alerts</div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
            {/* My Tasks */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">✅</span>
                  My Tasks
                </h3>
              </div>
              <div className="card-content">
                <p>View and manage your assigned tasks and responsibilities.</p>
                <div className="card-actions">
                  <button className="action-btn primary">View Tasks</button>
                  <button className="action-btn secondary">Update Status</button>
                </div>
              </div>
            </div>

            {/* Inventory Items */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">📦</span>
                  Inventory Items
                </h3>
              </div>
              <div className="card-content">
                <p>View inventory items and check stock availability.</p>
                <div className="card-actions">
                  <button className="action-btn primary">Browse Items</button>
                  <button className="action-btn secondary">Search</button>
                </div>
              </div>
            </div>

            {/* Stock Updates - Staff Permission */}
            {hasPermission(user?.role || 'staff', 'stock.record_in') && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">🔄</span>
                    Stock Updates
                  </h3>
                </div>
                <div className="card-content">
                  <p>Record stock movements and update inventory levels.</p>
                  <div className="card-actions">
                    <button className="action-btn primary">Record Stock In</button>
                    <button className="action-btn secondary">Record Stock Out</button>
                  </div>
                </div>
              </div>
            )}

            {/* Sales - Staff Permission */}
            {hasPermission(user?.role || 'staff', 'sales.create') && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">💰</span>
                    Sales
                  </h3>
                </div>
                <div className="card-content">
                  <p>Process sales transactions and manage orders.</p>
                  <div className="card-actions">
                    <button className="action-btn primary">New Sale</button>
                    <button className="action-btn secondary">Sales History</button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">🔔</span>
                  Notifications
                </h3>
              </div>
              <div className="card-content">
                <p>View important notifications and updates.</p>
                <div className="card-actions">
                  <button className="action-btn primary">View All</button>
                  <button className="action-btn secondary">Mark Read</button>
                </div>
              </div>
            </div>

            {/* My Profile */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">👤</span>
                  My Profile
                </h3>
              </div>
              <div className="card-content">
                <p>View and update your profile information.</p>
                <div className="card-actions">
                  <button className="action-btn primary">Edit Profile</button>
                  <button className="action-btn secondary">Change Password</button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffDashboard;
