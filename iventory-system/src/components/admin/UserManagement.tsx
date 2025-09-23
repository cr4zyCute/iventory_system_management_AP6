import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import './css/dashboard.css';

interface User {
  id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError('Error connecting to server');
      // Mock data for now
      setUsers([
        {
          id: 1,
          email: 'admin@gmail.com',
          role: 'admin',
          first_name: 'System',
          last_name: 'Administrator',
          is_active: true,
          created_at: '2025-09-23T08:07:44.846284',
          last_login: '2025-09-23T02:09:31.110Z'
        },
        {
          id: 2,
          email: 'manager@gmail.com',
          role: 'manager',
          first_name: 'John',
          last_name: 'Manager',
          is_active: true,
          created_at: '2025-09-23T08:07:44.846284'
        },
        {
          id: 3,
          email: 'staff@gmail.com',
          role: 'staff',
          first_name: 'Jane',
          last_name: 'Staff',
          is_active: true,
          created_at: '2025-09-23T08:07:44.846284'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive })
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, is_active: !isActive } : user
        ));
      }
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return '#dc3545';
      case 'manager': return '#ffc107';
      case 'staff': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <MainLayout title="👥 User Management">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">User Management</h1>
          <p className="content-subtitle">Manage system users and their permissions</p>
        </div>

        <div className="quick-actions">
          <button 
            className="quick-action-btn"
            onClick={() => setShowAddModal(true)}
          >
            ➕ Add New User
          </button>
          <button className="quick-action-btn">
            📊 Export Users
          </button>
          <button className="quick-action-btn">
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className="alert error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">👥</span>
              System Users ({users.length})
            </h3>
          </div>
          <div className="card-content">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="loading-spinner"></div>
                <p>Loading users...</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div 
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}
                          >
                            {user.first_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '500' }}>
                              {user.first_name} {user.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span 
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#ffffff',
                            backgroundColor: getRoleBadgeColor(user.role),
                            textTransform: 'uppercase'
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span 
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: user.is_active ? '#155724' : '#721c24',
                            backgroundColor: user.is_active ? '#d4edda' : '#f8d7da',
                            border: user.is_active ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
                          }}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        {user.last_login 
                          ? new Date(user.last_login).toLocaleDateString()
                          : 'Never'
                        }
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="action-btn secondary"
                            style={{ minWidth: 'auto', padding: '6px 12px' }}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="action-btn secondary"
                            style={{ minWidth: 'auto', padding: '6px 12px' }}
                            onClick={() => handleToggleActive(user.id, user.is_active)}
                          >
                            {user.is_active ? '🚫 Disable' : '✅ Enable'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
