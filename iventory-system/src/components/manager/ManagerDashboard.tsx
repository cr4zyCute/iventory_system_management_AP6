import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { hasPermission } from '../../common/permissions';
import MainLayout from '../layout/MainLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox, 
  faExclamationTriangle, 
  faClipboardList, 
  faDollarSign,
  faUsers,
  faChartBar,
  faBuilding,
  faArrowsRotate
} from '@fortawesome/free-solid-svg-icons';
import './css/dashboard.css';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalSuppliers: 0,
    monthlyRevenue: 0 as number | string,
    totalStaff: 0,
    pendingPurchaseOrders: 0,
    recentMovements: 0
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
        // Load real data from manager API
        const response = await fetch('/api/manager/stats');
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalProducts: data.totalProducts || 0,
            lowStockItems: data.lowStockItems || 0,
            totalSuppliers: data.totalSuppliers || 0,
            monthlyRevenue: data.totalSales || 0,
            totalStaff: data.totalStaff || 0,
            pendingPurchaseOrders: 0, // Will be implemented when PO system is ready
            recentMovements: data.recentMovements || 0
          });
        } else {
          // Fallback to mock data
          setStats({
            totalProducts: 125,
            lowStockItems: 12,
            totalSuppliers: 8,
            monthlyRevenue: 28450,
            totalStaff: 15,
            pendingPurchaseOrders: 3,
            recentMovements: 24
          });
        }
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        // Fallback data
        setStats({
          totalProducts: 125,
          lowStockItems: 12,
          totalSuppliers: 8,
          monthlyRevenue: 28450,
          totalStaff: 15,
          pendingPurchaseOrders: 3,
          recentMovements: 24
        });
      }
    };

    checkBackendConnection();
  }, []);


  return (
    <MainLayout title="Manager Dashboard">
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
            <div className="stat-icon" style={{ backgroundColor: '#ffc107' }}>
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.lowStockItems}</div>
              <div className="stat-label">Low Stock Items</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faBuilding} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalSuppliers}</div>
              <div className="stat-label">Suppliers</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalStaff}</div>
              <div className="stat-label">Team Members</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faDollarSign} />
            </div>
            <div className="stat-content">
              <div className="stat-value">₱{Number(stats.monthlyRevenue).toLocaleString()}</div>
              <div className="stat-label">Monthly Revenue</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faArrowsRotate} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.recentMovements}</div>
              <div className="stat-label">Recent Movements</div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
            {/* Inventory Management - Manager Permission */}
            {hasPermission(user?.role || 'staff', 'products.update') && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon"><FontAwesomeIcon icon={faBox} /></span>
                    Inventory Management
                  </h3>
                </div>
                <div className="card-content">
                  <p>Manage inventory items, stock levels, and product information.</p>
                  <div className="card-actions">
                    <button className="action-btn primary" onClick={() => navigate('/manager/inventory')}>Manage Items</button>
                    <button className="action-btn secondary" onClick={() => navigate('/manager/stock-movements')}>Stock Movements</button>
                  </div>
                </div>
              </div>
            )}

            {/* Purchase Orders - Manager Permission */}
            {hasPermission(user?.role || 'staff', 'purchase_orders.approve') && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon"><FontAwesomeIcon icon={faClipboardList} /></span>
                    Purchase Orders
                  </h3>
                </div>
                <div className="card-content">
                  <p>Review, approve and manage purchase orders from suppliers.</p>
                  <div className="card-actions">
                    <button className="action-btn primary" onClick={() => navigate('/manager/purchase-orders')}>Pending Approvals</button>
                    <button className="action-btn secondary" onClick={() => navigate('/manager/purchase-orders')}>Order History</button>
                  </div>
                </div>
              </div>
            )}

            {/* Staff Oversight */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon"><FontAwesomeIcon icon={faUsers} /></span>
                  Staff Oversight
                </h3>
              </div>
              <div className="card-content">
                <p>Monitor staff activities and manage team performance.</p>
                <div className="card-actions">
                  <button className="action-btn primary" onClick={() => navigate('/manager/staff')}>View Staff</button>
                  <button className="action-btn secondary" onClick={() => navigate('/manager/staff')}>Performance</button>
                </div>
              </div>
            </div>

            {/* Reports - Manager Permission */}
            {hasPermission(user?.role || 'staff', 'reports.sales') && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon"><FontAwesomeIcon icon={faChartBar} /></span>
                    Reports & Analytics
                  </h3>
                </div>
                <div className="card-content">
                  <p>Generate sales and inventory reports for management review.</p>
                  <div className="card-actions">
                    <button className="action-btn primary" onClick={() => navigate('/manager/reports')}>Sales Reports</button>
                    <button className="action-btn secondary" onClick={() => navigate('/manager/reports')}>Stock Reports</button>
                  </div>
                </div>
              </div>
            )}

            {/* Suppliers - Manager Permission */}
            {hasPermission(user?.role || 'staff', 'suppliers.update') && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon"><FontAwesomeIcon icon={faBuilding} /></span>
                    Suppliers
                  </h3>
                </div>
                <div className="card-content">
                  <p>Manage supplier relationships and procurement processes.</p>
                  <div className="card-actions">
                    <button className="action-btn primary" onClick={() => navigate('/manager/suppliers')}>Manage Suppliers</button>
                    <button className="action-btn secondary" onClick={() => navigate('/manager/suppliers')}>Procurement</button>
                  </div>
                </div>
              </div>
            )}

            {/* Stock Movements */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon"><FontAwesomeIcon icon={faArrowsRotate} /></span>
                  Stock Movements
                </h3>
              </div>
              <div className="card-content">
                <p>Monitor and approve stock adjustments and transfers.</p>
                <div className="card-actions">
                  <button className="action-btn primary" onClick={() => navigate('/manager/stock-movements')}>Pending Adjustments</button>
                  <button className="action-btn secondary" onClick={() => navigate('/manager/stock-movements')}>Movement History</button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ManagerDashboard;
