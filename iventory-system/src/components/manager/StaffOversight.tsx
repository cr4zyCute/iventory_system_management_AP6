import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import './css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faUserCheck, 
  faUserClock, 
  faChartLine, 
  faCalendarAlt,
  faEye,
  faTasks,
  faClipboardCheck,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'on_leave';
  last_login: string;
  tasks_assigned: number;
  tasks_completed: number;
  performance_score: number;
  join_date: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  assigned_to: number;
  assigned_to_name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  created_date: string;
}

const StaffOversight: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'staff' | 'tasks' | 'performance'>('staff');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal states
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigned_to: 0,
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: ''
  });

  useEffect(() => {
    loadStaffData();
    loadTasks();
  }, []);

  const loadStaffData = async () => {
    try {
      setLoading(true);
      // Mock data
      setStaff([
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice@company.com',
          role: 'staff',
          department: 'Warehouse',
          status: 'active',
          last_login: '2025-09-23T10:30:00Z',
          tasks_assigned: 15,
          tasks_completed: 12,
          performance_score: 85,
          join_date: '2024-01-15'
        },
        {
          id: 2,
          name: 'Bob Smith',
          email: 'bob@company.com',
          role: 'staff',
          department: 'Inventory',
          status: 'active',
          last_login: '2025-09-23T09:15:00Z',
          tasks_assigned: 20,
          tasks_completed: 18,
          performance_score: 92,
          join_date: '2023-08-20'
        },
        {
          id: 3,
          name: 'Carol Davis',
          email: 'carol@company.com',
          role: 'staff',
          department: 'Receiving',
          status: 'on_leave',
          last_login: '2025-09-20T16:45:00Z',
          tasks_assigned: 8,
          tasks_completed: 6,
          performance_score: 78,
          join_date: '2024-03-10'
        },
        {
          id: 4,
          name: 'David Wilson',
          email: 'david@company.com',
          role: 'staff',
          department: 'Quality Control',
          status: 'active',
          last_login: '2025-09-23T11:20:00Z',
          tasks_assigned: 12,
          tasks_completed: 10,
          performance_score: 88,
          join_date: '2023-11-05'
        }
      ]);
    } catch (err) {
      setError('Error loading staff data');
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      setTasks([
        {
          id: 1,
          title: 'Inventory Count - Electronics',
          description: 'Complete physical count of all electronics inventory',
          assigned_to: 1,
          assigned_to_name: 'Alice Johnson',
          status: 'in_progress',
          priority: 'high',
          due_date: '2025-09-25',
          created_date: '2025-09-20'
        },
        {
          id: 2,
          title: 'Supplier Audit - Dell',
          description: 'Review and audit Dell supplier documentation',
          assigned_to: 2,
          assigned_to_name: 'Bob Smith',
          status: 'completed',
          priority: 'medium',
          due_date: '2025-09-22',
          created_date: '2025-09-18'
        },
        {
          id: 3,
          title: 'Stock Replenishment',
          description: 'Replenish low stock items in warehouse section A',
          assigned_to: 1,
          assigned_to_name: 'Alice Johnson',
          status: 'pending',
          priority: 'medium',
          due_date: '2025-09-24',
          created_date: '2025-09-21'
        },
        {
          id: 4,
          title: 'Quality Check - Office Chairs',
          description: 'Perform quality inspection on new office chair shipment',
          assigned_to: 4,
          assigned_to_name: 'David Wilson',
          status: 'overdue',
          priority: 'high',
          due_date: '2025-09-22',
          created_date: '2025-09-19'
        }
      ]);
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assigned_to_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'inactive': return '#6c757d';
      case 'on_leave': return '#ffc107';
      case 'pending': return '#ffc107';
      case 'in_progress': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'overdue': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return '#28a745';
    if (score >= 75) return '#ffc107';
    return '#dc3545';
  };

  const viewStaffDetails = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setShowStaffModal(true);
  };

  const createNewTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const assignedStaff = staff.find(s => s.id === newTask.assigned_to);
      const task: Task = {
        id: tasks.length + 1,
        ...newTask,
        assigned_to_name: assignedStaff?.name || '',
        status: 'pending',
        created_date: new Date().toISOString().split('T')[0]
      };
      
      setTasks(prev => [...prev, task]);
      setShowTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        assigned_to: 0,
        priority: 'medium',
        due_date: ''
      });
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const updateTaskStatus = (taskId: number, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <MainLayout title="Staff Oversight">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">Staff Oversight</h1>
          <p className="content-subtitle">Monitor team performance and manage staff activities</p>
        </div>

        {/* Tab Navigation */}
        <div className="dashboard-card" style={{ marginBottom: '20px' }}>
          <div className="card-content" style={{ padding: '15px 20px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { id: 'staff', label: 'Staff Members', icon: faUsers },
                { id: 'tasks', label: 'Task Management', icon: faTasks },
                { id: 'performance', label: 'Performance', icon: faChartLine }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`action-btn ${activeTab === tab.id ? 'primary' : 'secondary'}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{ minWidth: 'auto' }}
                >
                  <FontAwesomeIcon icon={tab.icon} /> {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Staff Details Modal */}
        {showStaffModal && selectedStaff && (
          <div className="modal-overlay" onClick={() => setShowStaffModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Staff Details - {selectedStaff.name}</h3>
                <button 
                  className="modal-close" 
                  onClick={() => setShowStaffModal(false)}
                  type="button"
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <h4>Personal Information</h4>
                    <p><strong>Name:</strong> {selectedStaff.name}</p>
                    <p><strong>Email:</strong> {selectedStaff.email}</p>
                    <p><strong>Role:</strong> {selectedStaff.role}</p>
                    <p><strong>Department:</strong> {selectedStaff.department}</p>
                    <p><strong>Join Date:</strong> {new Date(selectedStaff.join_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4>Performance Metrics</h4>
                    <p><strong>Status:</strong> 
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        backgroundColor: getStatusColor(selectedStaff.status),
                        color: '#ffffff',
                        marginLeft: '8px',
                        fontSize: '12px'
                      }}>
                        {selectedStaff.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </p>
                    <p><strong>Tasks Assigned:</strong> {selectedStaff.tasks_assigned}</p>
                    <p><strong>Tasks Completed:</strong> {selectedStaff.tasks_completed}</p>
                    <p><strong>Completion Rate:</strong> {Math.round((selectedStaff.tasks_completed / selectedStaff.tasks_assigned) * 100)}%</p>
                    <p><strong>Performance Score:</strong> 
                      <span style={{ 
                        color: getPerformanceColor(selectedStaff.performance_score),
                        fontWeight: 'bold',
                        marginLeft: '8px'
                      }}>
                        {selectedStaff.performance_score}%
                      </span>
                    </p>
                    <p><strong>Last Login:</strong> {new Date(selectedStaff.last_login).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Task Modal */}
        {showTaskModal && (
          <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Create New Task</h3>
                <button 
                  className="modal-close" 
                  onClick={() => setShowTaskModal(false)}
                  type="button"
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={createNewTask}>
                  <div style={{ marginBottom: '15px' }}>
                    <label>Task Title</label>
                    <input 
                      className="form-input" 
                      value={newTask.title}
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label>Description</label>
                    <textarea 
                      className="form-input" 
                      value={newTask.description}
                      onChange={e => setNewTask({...newTask, description: e.target.value})}
                      rows={3}
                      required 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <label>Assign To</label>
                      <select 
                        className="form-select" 
                        value={newTask.assigned_to}
                        onChange={e => setNewTask({...newTask, assigned_to: Number(e.target.value)})}
                        required
                      >
                        <option value={0}>Select Staff Member</option>
                        {staff.filter(s => s.status === 'active').map(s => (
                          <option key={s.id} value={s.id}>{s.name} - {s.department}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label>Priority</label>
                      <select 
                        className="form-select" 
                        value={newTask.priority}
                        onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label>Due Date</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={newTask.due_date}
                        onChange={e => setNewTask({...newTask, due_date: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button type="button" className="action-btn secondary" onClick={() => setShowTaskModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="action-btn primary">
                      Create Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="dashboard-card" style={{ marginBottom: '20px' }}>
          <div className="card-content" style={{ padding: '15px 20px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ margin: 0 }}
                />
              </div>
              <div style={{ minWidth: '150px' }}>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-select"
                  style={{ margin: 0 }}
                >
                  <option value="all">All Status</option>
                  {activeTab === 'staff' ? (
                    <>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on_leave">On Leave</option>
                    </>
                  ) : (
                    <>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                    </>
                  )}
                </select>
              </div>
              {activeTab === 'tasks' && (
                <button className="action-btn primary" onClick={() => setShowTaskModal(true)}>
                  <FontAwesomeIcon icon={faClipboardCheck} /> New Task
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon"><FontAwesomeIcon icon={faUsers} /></span>
                Staff Members ({filteredStaff.length})
              </h3>
            </div>
            <div className="card-content">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="loading-spinner"></div>
                  <p>Loading staff data...</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Staff Member</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Tasks</th>
                      <th>Performance</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map(member => (
                      <tr key={member.id}>
                        <td>
                          <div>
                            <div style={{ fontWeight: '500' }}>{member.name}</div>
                            <div style={{ fontSize: '12px', color: '#666666' }}>{member.email}</div>
                          </div>
                        </td>
                        <td>{member.department}</td>
                        <td>
                          <span 
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: '#ffffff',
                              backgroundColor: getStatusColor(member.status)
                            }}
                          >
                            {member.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: '500' }}>
                              {member.tasks_completed}/{member.tasks_assigned}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666666' }}>
                              {Math.round((member.tasks_completed / member.tasks_assigned) * 100)}% complete
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ 
                            fontWeight: '500', 
                            color: getPerformanceColor(member.performance_score) 
                          }}>
                            {member.performance_score}%
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '12px' }}>
                            {new Date(member.last_login).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <button 
                            className="action-btn secondary"
                            style={{ minWidth: 'auto', padding: '6px 12px' }}
                            onClick={() => viewStaffDetails(member)}
                          >
                            <FontAwesomeIcon icon={faEye} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon"><FontAwesomeIcon icon={faTasks} /></span>
                Task Management ({filteredTasks.length})
              </h3>
            </div>
            <div className="card-content">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assigned To</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: '500' }}>{task.title}</div>
                          <div style={{ fontSize: '12px', color: '#666666' }}>{task.description}</div>
                        </div>
                      </td>
                      <td>{task.assigned_to_name}</td>
                      <td>
                        <span 
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#ffffff',
                            backgroundColor: getPriorityColor(task.priority)
                          }}
                        >
                          {task.priority.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {task.status === 'overdue' && <FontAwesomeIcon icon={faExclamationTriangle} color="#dc3545" />}
                          <FontAwesomeIcon icon={faCalendarAlt} color="#666" />
                          {new Date(task.due_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <span 
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#ffffff',
                            backgroundColor: getStatusColor(task.status)
                          }}
                        >
                          {task.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {task.status !== 'completed' && (
                            <select
                              className="form-select"
                              style={{ minWidth: '120px', margin: 0, padding: '4px 8px', fontSize: '12px' }}
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon"><FontAwesomeIcon icon={faChartLine} /></span>
                Performance Overview
              </h3>
            </div>
            <div className="card-content">
              <div className="stats-grid" style={{ marginBottom: '20px' }}>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FontAwesomeIcon icon={faUserCheck} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{staff.filter(s => s.status === 'active').length}</div>
                    <div className="stat-label">Active Staff</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FontAwesomeIcon icon={faUserClock} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{staff.filter(s => s.status === 'on_leave').length}</div>
                    <div className="stat-label">On Leave</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FontAwesomeIcon icon={faTasks} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{tasks.filter(t => t.status === 'pending').length}</div>
                    <div className="stat-label">Pending Tasks</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{tasks.filter(t => t.status === 'overdue').length}</div>
                    <div className="stat-label">Overdue Tasks</div>
                  </div>
                </div>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Department</th>
                    <th>Tasks Assigned</th>
                    <th>Tasks Completed</th>
                    <th>Completion Rate</th>
                    <th>Performance Score</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map(member => (
                    <tr key={member.id}>
                      <td>
                        <div style={{ fontWeight: '500' }}>{member.name}</div>
                      </td>
                      <td>{member.department}</td>
                      <td>{member.tasks_assigned}</td>
                      <td>{member.tasks_completed}</td>
                      <td>
                        <div style={{ fontWeight: '500' }}>
                          {Math.round((member.tasks_completed / member.tasks_assigned) * 100)}%
                        </div>
                      </td>
                      <td>
                        <div style={{ 
                          fontWeight: '500', 
                          color: getPerformanceColor(member.performance_score) 
                        }}>
                          {member.performance_score}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StaffOversight;
