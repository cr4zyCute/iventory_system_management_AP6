import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import './css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSync, faUserPlus, faUserCheck, faUserSlash, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [addForm, setAddForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'staff',
    is_active: true
  });
  const [editForm, setEditForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'staff',
    is_active: true
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm)
      });

      if (response.ok) {
        const result = await response.json();
        // Add the new user to the list
        setUsers(prev => [...prev, result.user]);
        setShowAddModal(false);
        setAddForm({
          email: '',
          first_name: '',
          last_name: '',
          role: 'staff',
          is_active: true
        });
        alert(`User created successfully! Temporary password: changeme123`);
      } else {
        const error = await response.json();
        setError(error.message || 'Failed to create user');
      }
    } catch (err) {
      setError('Error creating user');
      console.error('Create error:', err);
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddForm({
      email: '',
      first_name: '',
      last_name: '',
      role: 'staff',
      is_active: true
    });
  };

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

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      is_active: user.is_active
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...editForm } : user
        ));
        setShowEditModal(false);
        setEditingUser(null);
      } else {
        setError('Failed to update user');
      }
    } catch (err) {
      setError('Error updating user');
      console.error('Update error:', err);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditForm({
      email: '',
      first_name: '',
      last_name: '',
      role: 'staff',
      is_active: true
    });
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
    <MainLayout title=" User Management">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">User Management</h1>
        </div>

        <div className="quick-actions">
          <button
            className="action-btn primary"
            onClick={() => navigate('/admin/create-user')}
            style={{ marginRight: '10px' }}
          >
            <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '8px' }} />
            Create New User
          </button>
          <button className="quick-action-btn">
            <FontAwesomeIcon icon={faDownload} />
          </button>
          <button className="quick-action-btn" onClick={loadUsers}>
            <FontAwesomeIcon icon={faSync} />
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
              <span className="card-icon"><i className="fa-solid fa-users"></i></span>
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
                            onClick={() => openEditModal(user)}
                            title="Edit User"
                          >
                           <FontAwesomeIcon icon={faEdit} /> 
                          </button>
                          <button 
                            className="action-btn secondary"
                            style={{ minWidth: 'auto', padding: '6px 12px' }}
                            onClick={() => handleToggleActive(user.id, user.is_active)}
                          >
                            {user.is_active ? <FontAwesomeIcon icon={faUserSlash} /> : <FontAwesomeIcon icon={faUserCheck} />}
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

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="modal-overlay" onClick={closeEditModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit User</h3>
                <button className="modal-close" onClick={closeEditModal}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        className="form-input"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editForm.first_name}
                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editForm.last_name}
                        onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Role *</label>
                      <select
                        className="form-select"
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        required
                      >
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={editForm.is_active}
                          onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                          style={{ marginRight: '8px' }}
                        />
                        Active User
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="action-btn secondary" onClick={closeEditModal}>
                    Cancel
                  </button>
                  <button type="submit" className="action-btn primary">
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={closeAddModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New User</h3>
                <button className="modal-close" onClick={closeAddModal}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        className="form-input"
                        value={addForm.email}
                        onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={addForm.first_name}
                        onChange={(e) => setAddForm({ ...addForm, first_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={addForm.last_name}
                        onChange={(e) => setAddForm({ ...addForm, last_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Role *</label>
                      <select
                        className="form-select"
                        value={addForm.role}
                        onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                        required
                      >
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={addForm.is_active}
                          onChange={(e) => setAddForm({ ...addForm, is_active: e.target.checked })}
                          style={{ marginRight: '8px' }}
                        />
                        Active User
                      </label>
                    </div>
                  </div>
                  <div className="alert info" style={{ marginTop: '15px' }}>
                    <span>ℹ️</span>
                    New users will receive a temporary password: <strong>changeme123</strong>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="action-btn secondary" onClick={closeAddModal}>
                    Cancel
                  </button>
                  <button type="submit" className="action-btn primary">
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UserManagement;