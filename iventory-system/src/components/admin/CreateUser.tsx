import React, { useState } from 'react';
import MainLayout from '../layout/MainLayout';
import './css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faUserTag, faCheck, faTimes, faArrowLeft, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

interface CreateUserForm {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  password: string;
  is_active: boolean;
}

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [form, setForm] = useState<CreateUserForm>({
    email: '',
    first_name: '',
    last_name: '',
    role: 'staff',
    password: '',
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth if needed
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(`User created successfully! Password: ${form.password}`);
        // Reset form
        setForm({
          email: '',
          first_name: '',
          last_name: '',
          role: 'staff',
          password: '',
          is_active: true
        });
        
        // Optionally redirect after 2 seconds
        setTimeout(() => {
          navigate('/admin/users');
        }, 2000);
      } else {
        setError(result.message || 'Failed to create user');
      }
    } catch (err) {
      setError('Error connecting to server. Please try again.');
      console.error('Create user error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateUserForm, value: string | boolean) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setForm({
      email: '',
      first_name: '',
      last_name: '',
      role: 'staff',
      password: '',
      is_active: true
    });
    setError('');
    setSuccess('');
  };

  return (
    <MainLayout title="Create New User">
      <div className="admin-dashboard">
        <div className="content-header">
          <button 
            className="action-btn secondary"
            onClick={() => navigate('/admin/users')}
            style={{ marginRight: '15px' }}
          >
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }} />
            Back to Users
          </button>
          <h1 className="content-title">Create New User</h1>
        </div>

        <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">
                <FontAwesomeIcon icon={faUser} />
              </span>
              User Information
            </h3>
          </div>
          
          <div className="card-content">
            {error && (
              <div className="alert error" style={{ marginBottom: '20px' }}>
                <span>⚠️</span>
                {error}
              </div>
            )}

            {success && (
              <div className="alert success" style={{ marginBottom: '20px' }}>
                <span>✅</span>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label htmlFor="email">
                    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px' }} />
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="user@example.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">
                    <FontAwesomeIcon icon={faUserTag} style={{ marginRight: '8px' }} />
                    Role *
                  </label>
                  <select
                    id="role"
                    className="form-select"
                    value={form.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    required
                    disabled={loading}
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="first_name">
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                    First Name *
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    className="form-input"
                    value={form.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    placeholder="name"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                    Last Name *
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    className="form-input"
                    value={form.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    placeholder="last name"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <FontAwesomeIcon icon={faLock} style={{ marginRight: '8px' }} />
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-input"
                    value={form.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter secure password"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    Minimum 6 characters
                  </small>
                </div>
              </div>

              {/* <div className="form-group" style={{ marginTop: '20px' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    style={{ marginRight: '8px' }}
                    disabled={loading}
                  />
                  <FontAwesomeIcon icon={faCheck} style={{ marginRight: '8px' }} />
                  Active User (User can log in immediately)
                </label>
              </div> */}
{/* 
              <div className="alert info" style={{ margin: '20px 0' }}>
                <span>ℹ️</span>
                <strong>Important:</strong> New users will receive the password you set above.
                <br />
                They should change this password on their first login for security.
              </div> */}

              <div className="form-actions" style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' }}>
                <button 
                  type="button" 
                  className="action-btn secondary"
                  onClick={handleReset}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faTimes} style={{ marginRight: '8px' }} />
                  Reset Form
                </button>
                
                <button 
                  type="submit" 
                  className="action-btn primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheck} style={{ marginRight: '8px' }} />
                      Create User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Role Information Card */}
        {/* <div className="dashboard-card" style={{ maxWidth: '600px', margin: '20px auto 0' }}>
          <div className="card-header">
            <h3 className="card-title">Role Permissions</h3>
          </div>
          <div className="card-content">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
              <div className="role-info">
                <h4 style={{ color: '#28a745', marginBottom: '8px' }}>👤 Staff</h4>
                <ul style={{ fontSize: '14px', color: '#666', margin: 0, paddingLeft: '20px' }}>
                  <li>View inventory</li>
                  <li>Create requests</li>
                  <li>Update profile</li>
                </ul>
              </div>
              
              <div className="role-info">
                <h4 style={{ color: '#ffc107', marginBottom: '8px' }}>👨‍💼 Manager</h4>
                <ul style={{ fontSize: '14px', color: '#666', margin: 0, paddingLeft: '20px' }}>
                  <li>Manage inventory</li>
                  <li>Approve requests</li>
                  <li>View reports</li>
                  <li>Manage suppliers</li>
                </ul>
              </div>
              
              <div className="role-info">
                <h4 style={{ color: '#dc3545', marginBottom: '8px' }}>⚡ Admin</h4>
                <ul style={{ fontSize: '14px', color: '#666', margin: 0, paddingLeft: '20px' }}>
                  <li>Full system access</li>
                  <li>User management</li>
                  <li>System settings</li>
                  <li>Analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </MainLayout>
  );
};

export default CreateUser;
