import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import './css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleDown, faArrowCircleUp, faChartBar, faChartSimple } from '@fortawesome/free-solid-svg-icons';

interface ReportData {
  totalProducts: number;
  totalUsers: number;
  lowStockItems: number;
  totalSales: number;
  monthlyRevenue: number | string; 
  topProducts: Array<{
    id: number;
    name: string;
    sales: number;
    revenue: number | string; 
  }>;
  stockMovements: Array<{
    id: number;
    product_name: string;
    movement_type: string;
    quantity: number;
    date: string;
  }>;
}

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('overview');

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/reports');
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        throw new Error('Failed to load reports');
      }
    } catch (err) {
      console.error('Error loading reports:', err);
      // Mock data for now
      setReportData({
        totalProducts: 125,
        totalUsers: 8,
        lowStockItems: 12,
        totalSales: 342,
        monthlyRevenue: 45230,
        topProducts: [
          { id: 1, name: 'Laptop Dell XPS 13', sales: 25, revenue: 32499.75 },
          { id: 2, name: 'Wireless Mouse', sales: 85, revenue: 2549.15 },
          { id: 3, name: 'Office Chair', sales: 15, revenue: 4499.85 },
          { id: 4, name: 'A4 Paper Ream', sales: 120, revenue: 1078.80 },
          { id: 5, name: 'Printer Ink Cartridge', sales: 45, revenue: 1799.55 }
        ],
        stockMovements: [
          { id: 1, product_name: 'Laptop Dell XPS 13', movement_type: 'out', quantity: 2, date: '2025-09-23' },
          { id: 2, product_name: 'Wireless Mouse', movement_type: 'in', quantity: 50, date: '2025-09-22' },
          { id: 3, product_name: 'A4 Paper Ream', movement_type: 'out', quantity: 10, date: '2025-09-22' },
          { id: 4, product_name: 'Office Chair', movement_type: 'in', quantity: 5, date: '2025-09-21' },
          { id: 5, product_name: 'Printer Ink Cartridge', movement_type: 'out', quantity: 3, date: '2025-09-21' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (type: string) => {
    // Mock export functionality
    const data = JSON.stringify(reportData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <MainLayout title="Reports">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title=" Reports">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">Reports & Analytics</h1>
          <p className="content-subtitle">Business intelligence and performance metrics</p>
        </div>

        <div className="quick-actions">
          <button 
            className="quick-action-btn"
            onClick={() => exportReport('overview')}
          >
            <i className="fa-solid fa-download"></i> Export Overview
          </button>
          <button 
            className="quick-action-btn"
            onClick={() => exportReport('sales')}
          >
            <i className="fa-solid fa-dollar-sign"></i> Export Sales
          </button>
          <button 
            className="quick-action-btn"
            onClick={loadReportData}
          >
            <i className="fa-solid fa-refresh"></i> Refresh
          </button>
        </div>

        {/* Report Navigation */}
        <div className="dashboard-card" style={{ marginBottom: '20px' }}>
          <div className="card-content" style={{ padding: '15px 20px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { id: 'overview', label: 'Overview', icon: <i className="fas fa-home"></i> },
                { id: 'sales', label: 'Sales Report', icon: <i className="fas fa-dollar-sign "></i> },
                { id: 'inventory', label: 'Inventory Report', icon: <i className="fas fa-box"></i> },
                { id: 'users', label: 'User Activity', icon: <i className="fas fa-users"></i> }
              ].map(report => (
                <button
                  key={report.id}
                  className={`action-btn ${selectedReport === report.id ? 'primary' : 'secondary'}`}
                  onClick={() => setSelectedReport(report.id)}
                  style={{ minWidth: 'auto' }}
                >
                  {report.icon} {report.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        {selectedReport === 'overview' && reportData && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-box"></i></div>
                <div className="stat-content">
                  <div className="stat-value">{reportData.totalProducts}</div>
                  <div className="stat-label">Total Products</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-user"></i></div>
                <div className="stat-content">
                  <div className="stat-value">{reportData.totalUsers}</div>
                  <div className="stat-label">Total Users</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-box"></i></div>
                <div className="stat-content">
                  <div className="stat-value">{reportData.lowStockItems}</div>
                  <div className="stat-label">Low Stock Items</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-dollar-sign"></i></div>
                <div className="stat-content">
                  <div className="stat-value">${Number(reportData.monthlyRevenue).toLocaleString()}</div>
                  <div className="stat-label">Monthly Revenue</div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              {/* Top Products */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon"><i className="fas fa-trophy"></i></span>
                    Top Selling Products
                  </h3>
                </div>
                <div className="card-content">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Sales</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.topProducts.map((product, index) => (
                        <tr key={product.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ 
                                background: index < 3 ? '#ffc107' : '#e9ecef',
                                color: index < 3 ? '#000' : '#666',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                {index + 1}
                              </span>
                              {product.name}
                            </div>
                          </td>
                          <td>{product.sales}</td>
                          <td>${Number(product.revenue).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Stock Movements */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon"><FontAwesomeIcon icon={faChartSimple} /></span>
                    Recent Stock Movements
                  </h3>
                </div>
                <div className="card-content">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.stockMovements.map(movement => (
                        <tr key={movement.id}>
                          <td>{movement.product_name}</td>
                          <td>
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: '3px',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: '#ffffff',
                              backgroundColor: movement.movement_type === 'in' ? '#28a745' : '#dc3545'
                            }}>
                             {movement.movement_type === 'in' ? (
                            <span>
                              <FontAwesomeIcon icon={faArrowCircleUp} className="text-green-500" /> IN
                            </span>
                          ) : (
                            <span>
                              <FontAwesomeIcon icon={faArrowCircleDown} className="text-red-500" /> OUT
                            </span>
                          )}
                            </span>
                          </td>
                          <td>{movement.quantity}</td>
                          <td>{new Date(movement.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Other report types placeholder */}
        {selectedReport !== 'overview' && (
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon"><FontAwesomeIcon icon={faChartBar} className="mr-2" /></span>
                {selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report
              </h3>
            </div>
            <div className="card-content">
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ fontSize: '18px', color: '#666666' }}>
                  {selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} report coming soon...
                </p>
                <p style={{ color: '#999999' }}>
                  This report will provide detailed insights about {selectedReport}.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Reports;
