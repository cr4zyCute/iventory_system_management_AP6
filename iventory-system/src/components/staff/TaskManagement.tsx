import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import '../admin/css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTasks, 
  faCheckCircle, 
  faClock,
  faExclamationTriangle,
  faPlay,
  faCheck,
  faCalendarAlt,
  faUser,
  faFlag
} from '@fortawesome/free-solid-svg-icons';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  assigned_by: string;
}

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/staff/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      } else {
        setError('Failed to load tasks');
      }
    } catch (err) {
      setError('Error loading tasks');
      console.error('Tasks loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/staff/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus as Task['status'] } : task
        ));
      } else {
        setError('Failed to update task');
      }
    } catch (err) {
      setError('Error updating task');
      console.error('Update error:', err);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'in_progress': return '#007bff';
      case 'pending': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return faCheckCircle;
      case 'in_progress': return faPlay;
      case 'pending': return faClock;
      default: return faClock;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  if (loading) {
    return (
      <MainLayout title="Task Management">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Task Management">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">Task Management</h1>
          <p className="content-subtitle">Manage your assigned tasks and track progress</p>
        </div>

        {error && (
          <div className="alert error" style={{ marginBottom: '20px' }}>
            <span>⚠️</span>
            {error}
            <button onClick={() => setError('')} style={{ float: 'right', background: 'none', border: 'none', color: 'inherit' }}>×</button>
          </div>
        )}

        {/* Task Stats */}
        <div className="stats-grid" style={{ marginBottom: '20px' }}>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faTasks} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{tasks.length}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#6c757d' }}>
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {tasks.filter(t => t.status === 'pending').length}
              </div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#007bff' }}>
              <FontAwesomeIcon icon={faPlay} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {tasks.filter(t => t.status === 'in_progress').length}
              </div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#28a745' }}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {tasks.filter(t => t.status === 'completed').length}
              </div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="dashboard-card" style={{ marginBottom: '20px' }}>
          <div className="card-content" style={{ padding: '15px 20px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                className="form-select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <button className="action-btn secondary" onClick={loadTasks}>
                <FontAwesomeIcon icon={faTasks} /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon"><FontAwesomeIcon icon={faTasks} /></span>
              Tasks ({filteredTasks.length})
            </h3>
          </div>
          <div className="card-content">
            {filteredTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666666' }}>
                <FontAwesomeIcon icon={faTasks} size="3x" style={{ marginBottom: '15px', opacity: 0.3 }} />
                <p>No tasks found</p>
              </div>
            ) : (
              <div className="tasks-list">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="task-card" style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '15px',
                    backgroundColor: '#ffffff',
                    borderLeft: `4px solid ${getPriorityColor(task.priority)}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                          {task.title}
                        </h4>
                        <p style={{ margin: '0 0 12px 0', color: '#666666', fontSize: '14px' }}>
                          {task.description}
                        </p>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', fontSize: '12px', color: '#888888' }}>
                          <span>
                            <FontAwesomeIcon icon={faUser} style={{ marginRight: '4px' }} />
                            Assigned by: {task.assigned_by}
                          </span>
                          <span>
                            <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '4px' }} />
                            Due: {new Date(task.due_date).toLocaleDateString()}
                            {isOverdue(task.due_date) && (
                              <span style={{ color: '#dc3545', marginLeft: '4px' }}>
                                (Overdue)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: getPriorityColor(task.priority) + '20',
                          color: getPriorityColor(task.priority)
                        }}>
                          <FontAwesomeIcon icon={faFlag} style={{ marginRight: '4px' }} />
                          {task.priority.toUpperCase()}
                        </span>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: getStatusColor(task.status) + '20',
                          color: getStatusColor(task.status)
                        }}>
                          <FontAwesomeIcon icon={getStatusIcon(task.status)} style={{ marginRight: '4px' }} />
                          {task.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    {task.status !== 'completed' && (
                      <div style={{ display: 'flex', gap: '10px', paddingTop: '15px', borderTop: '1px solid #f0f0f0' }}>
                        {task.status === 'pending' && (
                          <button
                            className="action-btn primary small"
                            onClick={() => updateTaskStatus(task.id, 'in_progress')}
                          >
                            <FontAwesomeIcon icon={faPlay} /> Start Task
                          </button>
                        )}
                        {task.status === 'in_progress' && (
                          <button
                            className="action-btn success small"
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                          >
                            <FontAwesomeIcon icon={faCheck} /> Mark Complete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TaskManagement;
