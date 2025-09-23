import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../common/permissions';
import MainLayout from '../layout/MainLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faExclamationTriangle, faClipboardList, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import './css/dashboard.css';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    monthlyRevenue: 0
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
          totalProducts: 125,
          lowStockItems: 12,
          pendingOrders: 8,
          monthlyRevenue: 28450
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }
    };

    checkBackendConnection();
  }, []);


  return (
    <MainLayout title="📊 Manager Dashboard">
      <div className="manager-dashboard">
        <div className="content-header">
          <h1 className="content-title">Manager Dashboard</h1>
          <p className="content-subtitle">Inventory management and team oversight</p>
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
              <FontAwesomeIcon icon={faBox} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalProducts}</div>
              <div className="stat-label">Total Products</div>
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
              <FontAwesomeIcon icon={faClipboardList} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.pendingOrders}</div>
              <div className="stat-label">Pending Orders</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faDollarSign} />
            </div>
            <div className="stat-content">
              <div className="stat-value">${stats.monthlyRevenue.toLocaleString()}</div>
              <div className="stat-label">Monthly Revenue</div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
            {/* Inventory Management - Manager Permission */}
            {hasPermission(user?.role || 'staff', 'products.update') && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">📦</span>
                    Inventory Management
                  </h3>
                </div>
                <div className="card-content">
                  <p>Manage inventory items, stock levels, and product information.</p>
                  <div className="card-actions">
                    <button className="action-btn primary">Manage Items</button>
                    <button className="action-btn secondary">Stock Levels</button>
                  </div>
                </div>
              </div>
            )}

            {/* Purchase Orders - Manager Permission */}
            {hasPermission(user?.role || 'staff', 'purchase_orders.approve') && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">📋</span>
                    Purchase Orders
                  </h3>
                </div>
                <div className="card-content">
                  <p>Review, approve and manage purchase orders from suppliers.</p>
                  <div className="card-actions">
                    <button className="action-btn primary">Pending Approvals</button>
                    <button className="action-btn secondary">Order History</button>
                  </div>
                </div>
              </div>
            )}

            {/* Staff Oversight */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">👥</span>
                  Staff Oversight
                </h3>
              </div>
              <div className="card-content">
                <p>Monitor staff activities and manage team performance.</p>
                <div className="card-actions">
                  <button className="action-btn primary">View Staff</button>
                  <button className="action-btn secondary">Performance</button>
                </div>
              </div>
            </div>

            {/* Reports - Manager Permission */}
            {hasPermission(user?.role || 'staff', 'reports.sales') && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">📊</span>
                    Reports & Analytics
                  </h3>
                </div>
                <div className="card-content">
                  <p>Generate sales and inventory reports for management review.</p>
                  <div className="card-actions">
                    <button className="action-btn primary">Sales Reports</button>
                    <button className="action-btn secondary">Stock Reports</button>
                  </div>
                </div>
              </div>
            )}

            {/* Suppliers - Manager Permission */}
            {hasPermission(user?.role || 'staff', 'suppliers.update') && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">🏢</span>
                    Suppliers
                  </h3>
                </div>
                <div className="card-content">
                  <p>Manage supplier relationships and procurement processes.</p>
                  <div className="card-actions">
                    <button className="action-btn primary">Manage Suppliers</button>
                    <button className="action-btn secondary">Procurement</button>
                  </div>
                </div>
              </div>
            )}

            {/* Stock Movements */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">🔄</span>
                  Stock Movements
                </h3>
              </div>
              <div className="card-content">
                <p>Monitor and approve stock adjustments and transfers.</p>
                <div className="card-actions">
                  <button className="action-btn primary">Pending Adjustments</button>
                  <button className="action-btn secondary">Movement History</button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ManagerDashboard;
