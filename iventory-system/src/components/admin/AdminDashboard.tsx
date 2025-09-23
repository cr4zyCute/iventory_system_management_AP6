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
  const [, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    lowStockItems: 0,
    totalSales: 0 as number | string
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
    <MainLayout title="Admin Dashboard">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">Admin Dashboard</h1>
          
        </div>

        {/* <div className="status-bar">
          <div className="status-indicator">
            <span className={`status-dot ${backendStatus}`}></span>
            Backend: {backendStatus === 'checking' ? 'Checking...' : backendStatus}
          </div>
        </div> */}

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
              <div className="stat-value">${Number(stats.totalSales).toLocaleString()}</div>
              <div className="stat-label">Total Sales</div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
            {/* Inventory Overview - Primary Feature */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">
                    <FontAwesomeIcon icon={faBox} />
                  </span>
                  Inventory Management
                </h3>
              </div>
           
            </div>

            
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
