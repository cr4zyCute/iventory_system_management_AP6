import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import './css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faPlus, faFileExport, faRotateRight, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Category {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  created_by?: number;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/categories/all');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      } else {
        setError('Failed to load categories');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddForm = () => {
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      is_active: true,
    });
    setShowForm(true);
  };

  const openEditForm = (category: Category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description || '',
      is_active: category.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
      }
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await loadCategories();
        setShowForm(false);
        setEditingId(null);
      } else {
        const msg = await res.text();
        alert('Save failed: ' + msg);
      }
    } catch (e) {
      console.error('Save failed', e);
      alert('Save failed');
    }
  };

  return (
    <MainLayout title="Category Management">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">Category Management</h1>
          <p className="content-subtitle">Manage product categories and classifications</p>
        </div>

        <div className="quick-actions">
          <button className="quick-action-btn" onClick={openAddForm}>
            <FontAwesomeIcon icon={faPlus} /> Add New Category
          </button>
          <button className="quick-action-btn">
            <FontAwesomeIcon icon={faFileExport} /> Export Categories
          </button>
          <button className="quick-action-btn" onClick={loadCategories}>
            <FontAwesomeIcon icon={faRotateRight} /> Refresh
          </button>
        </div>

        {error && (
          <div className="alert error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Create / Edit Form */}
        {showForm && (
          <div className="dashboard-card" style={{ marginBottom: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
            </div>
            <div className="card-content">
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
                <div>
                  <label>Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input id="is_active" type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                  <label htmlFor="is_active">Active</label>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Description</label>
                  <textarea className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button type="button" className="action-btn secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
                  <button type="submit" className="action-btn primary">{editingId ? 'Update Category' : 'Create Category'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="dashboard-card" style={{ marginBottom: '20px' }}>
          <div className="card-content" style={{ padding: '15px 20px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ margin: 0 }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon"><FontAwesomeIcon icon={faTags} /></span>
              Categories ({filteredCategories.length})
            </h3>
          </div>
          <div className="card-content">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="loading-spinner"></div>
                <p>Loading categories...</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map(category => (
                    <tr key={category.id}>
                      <td>
                        <div style={{ fontWeight: '500' }}>
                          {category.name}
                        </div>
                      </td>
                      <td>
                        <div style={{ color: '#666666', fontSize: '14px' }}>
                          {category.description || 'No description'}
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
                            backgroundColor: category.is_active ? '#28a745' : '#dc3545'
                          }}
                        >
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '14px', color: '#666666' }}>
                          {new Date(category.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="action-btn secondary"
                            style={{ minWidth: 'auto', padding: '6px 12px' }}
                            onClick={() => openEditForm(category)}
                          >
                            <FontAwesomeIcon icon={faEdit} /> Edit
                          </button>
                          <button 
                            className="action-btn secondary"
                            style={{ minWidth: 'auto', padding: '6px 12px' }}
                            onClick={() => handleDelete(category.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} /> Delete
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

export default CategoryManagement;
