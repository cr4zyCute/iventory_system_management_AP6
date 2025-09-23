import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../common/permissions';
import MainLayout from '../layout/MainLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardList, 
  faCheckCircle, 
  faClock, 
  faExclamationTriangle,
  faTasks,
  faBox,
  faArrowsRotate,
  faDollarSign,
  faBell,
  faUser,
  faPlay,
  faPause,
  faStop,
  faChartLine,
  faStar,
  faCalendarAlt,
  faHistory,
  faAward,
  faBullseye
} from '@fortawesome/free-solid-svg-icons';
import '../admin/css/dashboard.css';

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [stats, setStats] = useState({
    // Personal Task Metrics
    assignedTasks: 0,
    completedToday: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    
    // Performance Metrics
    completionRate: 0,
    averageTaskTime: '0h',
    performanceScore: 0,
    weeklyGoal: 0,
    
    // Inventory Access
    productsManaged: 0,
    lowStockAlerts: 0,
    stockAdjustments: 0,
    
    // Recent Activities
    recentTasks: [] as any[],
    upcomingDeadlines: [] as any[]
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
        const response = await fetch('/api/staff/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          // Comprehensive fallback data for staff
          setStats({
            // Personal Task Metrics
            assignedTasks: 8,
            completedToday: 3,
            inProgressTasks: 2,
            overdueTasks: 1,
            
            // Performance Metrics
            completionRate: 85,
            averageTaskTime: '2.5h',
            performanceScore: 92,
            weeklyGoal: 15,
            
            // Inventory Access
            productsManaged: 45,
            lowStockAlerts: 6,
            stockAdjustments: 12,
            
            // Recent Activities
            recentTasks: [
              { id: 1, title: 'Update inventory levels', status: 'completed', time: '1h ago' },
              { id: 2, title: 'Process stock adjustment', status: 'in_progress', time: '2h ago' },
              { id: 3, title: 'Check low stock items', status: 'pending', time: '3h ago' }
            ],
            upcomingDeadlines: [
              { task: 'Monthly inventory count', due: 'Tomorrow', priority: 'high' },
              { task: 'Update product descriptions', due: '2 days', priority: 'medium' },
              { task: 'Review supplier orders', due: '3 days', priority: 'low' }
            ]
          });
        }
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        // Same fallback data
        setStats({
          assignedTasks: 8,
          completedToday: 3,
          inProgressTasks: 2,
          overdueTasks: 1,
          completionRate: 85,
          averageTaskTime: '2.5h',
          performanceScore: 92,
          weeklyGoal: 15,
          productsManaged: 45,
          lowStockAlerts: 6,
          stockAdjustments: 12,
          recentTasks: [
            { id: 1, title: 'Update inventory levels', status: 'completed', time: '1h ago' },
            { id: 2, title: 'Process stock adjustment', status: 'in_progress', time: '2h ago' },
            { id: 3, title: 'Check low stock items', status: 'pending', time: '3h ago' }
          ],
          upcomingDeadlines: [
            { task: 'Monthly inventory count', due: 'Tomorrow', priority: 'high' },
            { task: 'Update product descriptions', due: '2 days', priority: 'medium' },
            { task: 'Review supplier orders', due: '3 days', priority: 'low' }
          ]
        });
      }
    };

    checkBackendConnection();
  }, []);


  return (
    <MainLayout title="Staff Dashboard">
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

        {/* Personal Performance Overview */}
        <div className="content-subtitle" style={{ marginBottom: '20px' }}>
          Personal Performance & Task Management
        </div>

        {/* Key Performance Indicators */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faTasks} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.assignedTasks}</div>
              <div className="stat-label">Assigned Tasks</div>
              <div className="stat-trend" style={{ fontSize: '12px', color: '#666' }}>
                {stats.inProgressTasks} in progress
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#28a745' }}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.completedToday}</div>
              <div className="stat-label">Completed Today</div>
              <div className="stat-trend" style={{ fontSize: '12px', color: '#28a745' }}>
                Goal: {stats.weeklyGoal} this week
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stats.overdueTasks > 0 ? '#dc3545' : '#ffc107' }}>
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.overdueTasks}</div>
              <div className="stat-label">Overdue Tasks</div>
              <div className="stat-trend" style={{ 
                fontSize: '12px', 
                color: stats.overdueTasks > 0 ? '#dc3545' : '#28a745' 
              }}>
                {stats.overdueTasks > 0 ? 'Needs attention' : 'On track'}
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.performanceScore}%</div>
              <div className="stat-label">Performance Score</div>
              <div className="stat-trend" style={{ fontSize: '12px', color: '#007bff' }}>
                <FontAwesomeIcon icon={faStar} /> Excellent
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faBox} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.productsManaged}</div>
              <div className="stat-label">Products Managed</div>
              <div className="stat-trend" style={{ fontSize: '12px', color: '#666' }}>
                Your responsibility
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#ffc107' }}>
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.lowStockAlerts}</div>
              <div className="stat-label">Low Stock Alerts</div>
              <div className="stat-trend" style={{ fontSize: '12px', color: '#ffc107' }}>
                Requires attention
              </div>
            </div>
          </div>
        </div>

        {/* Task Management & Activities */}
        <div className="dashboard-grid" style={{ marginTop: '30px' }}>
          {/* Recent Tasks */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon"><FontAwesomeIcon icon={faHistory} /></span>
                Recent Tasks
              </h3>
            </div>
            <div className="card-content">
              <div style={{ display: 'grid', gap: '10px' }}>
                {stats.recentTasks && stats.recentTasks.map((task) => (
                  <div key={task.id} style={{ 
                    padding: '12px', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    borderLeft: `4px solid ${
                      task.status === 'completed' ? '#28a745' : 
                      task.status === 'in_progress' ? '#007bff' : '#ffc107'
                    }`
                  }}>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>{task.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        backgroundColor: task.status === 'completed' ? '#d4edda' : 
                                       task.status === 'in_progress' ? '#cce5ff' : '#fff3cd',
                        color: task.status === 'completed' ? '#155724' : 
                               task.status === 'in_progress' ? '#004085' : '#856404'
                      }}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span style={{ fontSize: '12px', color: '#666' }}>{task.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon"><FontAwesomeIcon icon={faCalendarAlt} /></span>
                Upcoming Deadlines
              </h3>
            </div>
            <div className="card-content">
              <div style={{ display: 'grid', gap: '10px' }}>
                {stats.upcomingDeadlines && stats.upcomingDeadlines.map((deadline, index) => (
                  <div key={index} style={{ 
                    padding: '12px', 
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    borderLeft: `4px solid ${
                      deadline.priority === 'high' ? '#dc3545' : 
                      deadline.priority === 'medium' ? '#ffc107' : '#28a745'
                    }`
                  }}>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>{deadline.task}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>Due: {deadline.due}</span>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        backgroundColor: deadline.priority === 'high' ? '#f8d7da' : 
                                       deadline.priority === 'medium' ? '#fff3cd' : '#d4edda',
                        color: deadline.priority === 'high' ? '#721c24' : 
                               deadline.priority === 'medium' ? '#856404' : '#155724'
                      }}>
                        {deadline.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon"><FontAwesomeIcon icon={faAward} /></span>
                Performance Summary
              </h3>
            </div>
            <div className="card-content">
              <div style={{ display: 'grid', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Completion Rate:</span>
                  <strong style={{ color: '#28a745' }}>{stats.completionRate}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Average Task Time:</span>
                  <strong>{stats.averageTaskTime}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Stock Adjustments:</span>
                  <strong>{stats.stockAdjustments} this month</strong>
                </div>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: '#e3f2fd', 
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1976d2' }}>
                    {stats.performanceScore}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Overall Performance</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-grid" style={{ marginTop: '30px' }}>
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon"><FontAwesomeIcon icon={faBullseye} /></span>
                Quick Actions
              </h3>
            </div>
            <div className="card-content">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                <button className="action-btn primary">
                  <FontAwesomeIcon icon={faPlay} /> Start Task
                </button>
                <button className="action-btn secondary">
                  <FontAwesomeIcon icon={faBox} /> View Inventory
                </button>
                <button className="action-btn secondary">
                  <FontAwesomeIcon icon={faArrowsRotate} /> Stock Update
                </button>
                {hasPermission(user?.role || 'staff', 'sales.create') && (
                  <button className="action-btn secondary">
                    <FontAwesomeIcon icon={faDollarSign} /> New Sale
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

            {/* Stock Updates - Staff Permission */}
            {hasPermission(user?.role || 'staff', 'stock.record_in') && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon"><FontAwesomeIcon icon={faArrowsRotate} /></span>
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
                    <span className="card-icon"><FontAwesomeIcon icon={faDollarSign} /></span>
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
                  <span className="card-icon"><FontAwesomeIcon icon={faBell} /></span>
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
                  <span className="card-icon"><FontAwesomeIcon icon={faUser} /></span>
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
      
    </MainLayout>
  );
};

export default StaffDashboard;
