import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import './css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartBar, 
  faFileExport, 
  faRotateRight, 
  faDollarSign,
  faBox,
  faArrowUp,
  faArrowDown,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

interface ReportData {
  salesReport?: {
    totalSales: number | string;
    totalOrders: number;
    averageOrderValue: number | string;
    salesGrowth: number;
    monthlySales: Array<{
      month: string;
      sales: number | string;
      orders: number;
    }>;
    topProducts: Array<{
      name: string;
      sales: number;
      quantity: number;
      revenue: number | string;
    }>;
  };
  inventoryReport?: {
    totalProducts: number;
    lowStockItems: number;
    outOfStockItems: number;
    totalValue: number | string;
    categoryBreakdown: Array<{
      category: string;
      count: number;
      value: number | string;
    }>;
    recentMovements: Array<{
      id: number;
      product_name: string;
      movement_type: string;
      quantity: number;
      date: string;
    }>;
  };
  staffReport?: {
    totalStaff: number;
    activeStaff: number;
    tasksCompleted: number;
    averagePerformance: number;
    staffList: Array<{
      id: number;
      name: string;
      role: string;
      performance: number;
      tasks_completed: number;
    }>;
    departmentPerformance: Array<{
      department: string;
      staff: number;
      performance: number;
      tasksCompleted: number;
    }>;
  };
}

const ManagerReports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState<'sales' | 'inventory' | 'staff'>('sales');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-09-01',
    endDate: '2025-09-23'
  });

  useEffect(() => {
    loadReportData();
  }, [selectedReport, dateRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load data based on selected report
      let response;
      if (selectedReport === 'sales') {
        response = await fetch('/api/manager/reports/sales');
      } else if (selectedReport === 'inventory') {
        response = await fetch('/api/manager/reports/inventory');
      } else if (selectedReport === 'staff') {
        response = await fetch('/api/manager/reports/staff');
      }
      
      if (response && response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        // Fallback to mock data
        setReportData({
          salesReport: {
            totalSales: 245230,
            totalOrders: 1627,
            averageOrderValue: 150.75,
            salesGrowth: 12.5,
            monthlySales: [
              { month: 'Jan', sales: 35000, orders: 250 },
              { month: 'Feb', sales: 38500, orders: 295 },
              { month: 'Mar', sales: 42000, orders: 320 },
              { month: 'Apr', sales: 39800, orders: 305 },
              { month: 'May', sales: 45230, orders: 342 },
              { month: 'Jun', sales: 48900, orders: 365 }
            ],
            topProducts: [
              { name: 'Laptop Dell XPS 13', sales: 25, quantity: 25, revenue: 32499.75 },
              { name: 'Wireless Mouse', sales: 85, quantity: 85, revenue: 2549.15 },
              { name: 'Office Chair', sales: 15, quantity: 15, revenue: 4499.85 },
              { name: 'Monitor 24"', sales: 30, quantity: 30, revenue: 8999.70 },
              { name: 'Keyboard Mechanical', sales: 45, quantity: 45, revenue: 4499.55 }
            ]
          },
          inventoryReport: {
            totalProducts: 125,
            lowStockItems: 12,
            outOfStockItems: 3,
            totalValue: 285750.00,
            categoryBreakdown: [
              { category: 'Electronics', count: 45, value: 125000 },
              { category: 'Furniture', count: 25, value: 85000 },
              { category: 'Office Supplies', count: 35, value: 45000 },
              { category: 'Accessories', count: 20, value: 30750 }
            ],
            recentMovements: [
              { id: 1, product_name: 'Laptop Dell XPS 13', movement_type: 'out', quantity: 2, date: '2025-09-23' },
              { id: 2, product_name: 'Wireless Mouse', movement_type: 'in', quantity: 50, date: '2025-09-22' },
              { id: 3, product_name: 'Office Chair', movement_type: 'out', quantity: 5, date: '2025-09-22' },
              { id: 4, product_name: 'Monitor 24"', movement_type: 'in', quantity: 20, date: '2025-09-21' },
              { id: 5, product_name: 'Keyboard Mechanical', movement_type: 'out', quantity: 8, date: '2025-09-21' }
            ]
          },
          staffReport: {
            totalStaff: 8,
            activeStaff: 7,
            tasksCompleted: 156,
            averagePerformance: 85.5,
            staffList: [
              { id: 1, name: 'John Smith', role: 'manager', performance: 92, tasks_completed: 45 },
              { id: 2, name: 'Jane Doe', role: 'staff', performance: 88, tasks_completed: 38 },
              { id: 3, name: 'Mike Johnson', role: 'staff', performance: 85, tasks_completed: 42 },
              { id: 4, name: 'Sarah Wilson', role: 'staff', performance: 90, tasks_completed: 31 }
            ],
            departmentPerformance: [
              { department: 'Warehouse', staff: 3, performance: 88, tasksCompleted: 65 },
              { department: 'Inventory', staff: 2, performance: 92, tasksCompleted: 45 },
              { department: 'Receiving', staff: 2, performance: 78, tasksCompleted: 32 },
              { department: 'Quality Control', staff: 1, performance: 85, tasksCompleted: 14 }
            ]
          }
        });
      }
    } catch (err) {
      setError('Error loading report data');
      console.error('Report loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!reportData) return;
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (loading) {
    return (
      <MainLayout title="Manager Reports">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Manager Reports">
        <div className="alert error">
          <span>⚠️</span>
          {error}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Manager Reports">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">Manager Reports</h1>
          <p className="content-subtitle">Comprehensive business analytics and insights</p>
        </div>

        {/* Report Controls */}
        <div className="dashboard-card" style={{ marginBottom: '20px' }}>
          <div className="card-content" style={{ padding: '15px 20px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <label style={{ marginRight: '8px' }}>Report Type:</label>
                <select 
                  className="form-select" 
                  value={selectedReport} 
                  onChange={(e) => setSelectedReport(e.target.value as 'sales' | 'inventory' | 'staff')}
                  style={{ minWidth: '150px' }}
                >
                  <option value="sales">Sales Report</option>
                  <option value="inventory">Inventory Report</option>
                  <option value="staff">Staff Report</option>
                </select>
              </div>
              <div>
                <label style={{ marginRight: '8px' }}>Start Date:</label>
                <input
                  type="date"
                  className="form-input"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  style={{ width: '150px' }}
                />
              </div>
              <div>
                <label style={{ marginRight: '8px' }}>End Date:</label>
                <input
                  type="date"
                  className="form-input"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  style={{ width: '150px' }}
                />
              </div>
              <button className="action-btn primary" onClick={loadReportData}>
                <FontAwesomeIcon icon={faRotateRight} /> Refresh
              </button>
              <button className="action-btn secondary" onClick={exportReport}>
                <FontAwesomeIcon icon={faFileExport} /> Export
              </button>
            </div>
          </div>
        </div>

        {reportData && (
          <>
            {/* Sales Report */}
            {selectedReport === 'sales' && reportData.salesReport && (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FontAwesomeIcon icon={faDollarSign} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">${Number(reportData.salesReport.totalSales).toLocaleString()}</div>
                      <div className="stat-label">Total Sales</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FontAwesomeIcon icon={faBox} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{reportData.salesReport.totalOrders}</div>
                      <div className="stat-label">Total Orders</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FontAwesomeIcon icon={faChartLine} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">${Number(reportData.salesReport.averageOrderValue).toFixed(2)}</div>
                      <div className="stat-label">Avg Order Value</div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-grid">
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <span className="card-icon"><FontAwesomeIcon icon={faChartBar} /></span>
                        Monthly Sales Trend
                      </h3>
                    </div>
                    <div className="card-content">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>Sales</th>
                            <th>Orders</th>
                            <th>Avg Order</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.salesReport.monthlySales.map((month, index) => (
                            <tr key={index}>
                              <td>{month.month}</td>
                              <td>${Number(month.sales).toLocaleString()}</td>
                              <td>{month.orders}</td>
                              <td>${(Number(month.sales) / Number(month.orders)).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <span className="card-icon"><FontAwesomeIcon icon={faChartBar} /></span>
                        Top Selling Products
                      </h3>
                    </div>
                    <div className="card-content">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.salesReport.topProducts.map((product, index) => (
                            <tr key={index}>
                              <td>{product.name}</td>
                              <td>{product.quantity}</td>
                              <td>${Number(product.revenue).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Inventory Report */}
            {selectedReport === 'inventory' && reportData.inventoryReport && (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FontAwesomeIcon icon={faBox} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{reportData.inventoryReport.totalProducts}</div>
                      <div className="stat-label">Total Products</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#ffc107' }}>
                      <FontAwesomeIcon icon={faArrowDown} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{reportData.inventoryReport.lowStockItems}</div>
                      <div className="stat-label">Low Stock Items</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#dc3545' }}>
                      <FontAwesomeIcon icon={faBox} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{reportData.inventoryReport.outOfStockItems}</div>
                      <div className="stat-label">Out of Stock</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FontAwesomeIcon icon={faDollarSign} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">${Number(reportData.inventoryReport.totalValue).toLocaleString()}</div>
                      <div className="stat-label">Total Value</div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-grid">
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <span className="card-icon"><FontAwesomeIcon icon={faChartBar} /></span>
                        Category Breakdown
                      </h3>
                    </div>
                    <div className="card-content">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Count</th>
                            <th>Value</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.inventoryReport.categoryBreakdown.map((category, index) => (
                            <tr key={index}>
                              <td>{category.category}</td>
                              <td>{category.count}</td>
                              <td>${Number(category.value).toLocaleString()}</td>
                              <td>{((Number(category.value) / Number(reportData.inventoryReport!.totalValue)) * 100).toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <span className="card-icon"><FontAwesomeIcon icon={faArrowUp} /></span>
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
                          {reportData.inventoryReport.recentMovements.map((movement) => (
                            <tr key={movement.id}>
                              <td>{movement.product_name}</td>
                              <td>
                                <span style={{
                                  padding: '2px 6px',
                                  borderRadius: '3px',
                                  fontSize: '12px',
                                  backgroundColor: movement.movement_type === 'in' ? '#d4edda' : '#f8d7da',
                                  color: movement.movement_type === 'in' ? '#155724' : '#721c24'
                                }}>
                                  {movement.movement_type.toUpperCase()}
                                </span>
                              </td>
                              <td>{movement.quantity}</td>
                              <td>{movement.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Staff Report */}
            {selectedReport === 'staff' && reportData.staffReport && (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FontAwesomeIcon icon={faBox} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{reportData.staffReport.totalStaff}</div>
                      <div className="stat-label">Total Staff</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FontAwesomeIcon icon={faBox} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{reportData.staffReport.tasksCompleted}</div>
                      <div className="stat-label">Tasks Completed</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FontAwesomeIcon icon={faChartLine} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{reportData.staffReport.averagePerformance}%</div>
                      <div className="stat-label">Avg Performance</div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <span className="card-icon"><FontAwesomeIcon icon={faChartBar} /></span>
                      Staff Performance
                    </h3>
                  </div>
                  <div className="card-content">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Performance</th>
                          <th>Tasks Completed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.staffReport.staffList.map((staff) => (
                          <tr key={staff.id}>
                            <td>{staff.name}</td>
                            <td style={{ textTransform: 'capitalize' }}>{staff.role}</td>
                            <td>{staff.performance}%</td>
                            <td>{staff.tasks_completed}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ManagerReports;
