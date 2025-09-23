import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import './css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, 
  faPlus, 
  faEdit, 
  faTrash,
  faEye,
  faEnvelope,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: number;
  product_count?: number;
}

const SuppliersManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal states
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    is_active: true
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/manager/suppliers');
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data.suppliers || []);
      } else {
        setError('Failed to load suppliers');
      }
    } catch (err) {
      setError('Error loading suppliers');
      console.error('Suppliers loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/manager/suppliers/${editingId}` : '/api/manager/suppliers';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        await loadSuppliers();
        resetForm();
        setShowSupplierModal(false);
      } else {
        setError('Failed to save supplier');
      }
    } catch (err) {
      setError('Error saving supplier');
      console.error('Save error:', err);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingId(supplier.id);
    setForm({
      name: supplier.name,
      contact_person: supplier.contact_person || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      is_active: supplier.is_active
    });
    setShowSupplierModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        const response = await fetch(`/api/manager/suppliers/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await loadSuppliers();
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to delete supplier');
        }
      } catch (err) {
        setError('Error deleting supplier');
        console.error('Delete error:', err);
      }
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      is_active: true
    });
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowSupplierModal(true);
  };

  const viewDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowDetailsModal(true);
  };

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && supplier.is_active) ||
                         (filterStatus === 'inactive' && !supplier.is_active);
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <MainLayout title="Suppliers Management">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner"></div>
          <p>Loading suppliers...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Suppliers Management">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">Suppliers Management</h1>
          <p className="content-subtitle">Manage your supplier relationships and contacts</p>
        </div>

        {error && (
          <div className="alert error" style={{ marginBottom: '20px' }}>
            <span>⚠️</span>
            {error}
            <button onClick={() => setError('')} style={{ float: 'right', background: 'none', border: 'none', color: 'inherit' }}>×</button>
          </div>
        )}

        {/* Controls */}
        <div className="dashboard-card" style={{ marginBottom: '20px' }}>
          <div className="card-content" style={{ padding: '15px 20px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search suppliers..."
                className="form-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: 1, minWidth: '200px' }}
              />
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className="action-btn primary" onClick={openAddModal}>
                <FontAwesomeIcon icon={faPlus} /> Add Supplier
              </button>
            </div>
          </div>
        </div>

        {/* Suppliers Table */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon"><FontAwesomeIcon icon={faBuilding} /></span>
              Suppliers ({filteredSuppliers.length})
            </h3>
          </div>
          <div className="card-content">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Supplier Name</th>
                    <th>Contact Person</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td>
                        <div style={{ fontWeight: '500' }}>{supplier.name}</div>
                        <div style={{ fontSize: '12px', color: '#666666' }}>
                          ID: {supplier.id}
                        </div>
                      </td>
                      <td>{supplier.contact_person || '-'}</td>
                      <td>
                        {supplier.email ? (
                          <a href={`mailto:${supplier.email}`} style={{ color: '#007bff' }}>
                            {supplier.email}
                          </a>
                        ) : '-'}
                      </td>
                      <td>
                        {supplier.phone ? (
                          <a href={`tel:${supplier.phone}`} style={{ color: '#007bff' }}>
                            {supplier.phone}
                          </a>
                        ) : '-'}
                      </td>
                      <td>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2'
                        }}>
                          {supplier.product_count || 0} products
                        </span>
                      </td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: supplier.is_active ? '#d4edda' : '#f8d7da',
                          color: supplier.is_active ? '#155724' : '#721c24'
                        }}>
                          <FontAwesomeIcon icon={supplier.is_active ? faCheckCircle : faTimesCircle} />
                          {supplier.is_active ? ' Active' : ' Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            className="action-btn secondary small"
                            onClick={() => viewDetails(supplier)}
                            title="View Details"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            className="action-btn primary small"
                            onClick={() => handleEdit(supplier)}
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="action-btn danger small"
                            onClick={() => handleDelete(supplier.id)}
                            title="Delete"
                            disabled={Boolean(supplier.product_count && supplier.product_count > 0)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredSuppliers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666666' }}>
                  <FontAwesomeIcon icon={faBuilding} size="3x" style={{ marginBottom: '15px', opacity: 0.3 }} />
                  <p>No suppliers found</p>
                  <button className="action-btn primary" onClick={openAddModal}>
                    <FontAwesomeIcon icon={faPlus} /> Add First Supplier
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Supplier Modal */}
        {showSupplierModal && (
          <div className="modal-overlay" onClick={() => setShowSupplierModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h3>
                <button className="modal-close" onClick={() => setShowSupplierModal(false)}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Supplier Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact Person</label>
                      <input
                        type="text"
                        className="form-input"
                        value={form.contact_person}
                        onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-input"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label>Address</label>
                      <textarea
                        className="form-input"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={form.is_active}
                          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                          style={{ marginRight: '8px' }}
                        />
                        Active Supplier
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="action-btn secondary" onClick={() => setShowSupplierModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="action-btn primary">
                    {editingId ? 'Update' : 'Create'} Supplier
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Supplier Details Modal */}
        {showDetailsModal && selectedSupplier && (
          <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Supplier Details</h3>
                <button className="modal-close" onClick={() => setShowDetailsModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="supplier-details">
                  <div className="detail-section">
                    <h4><FontAwesomeIcon icon={faBuilding} /> Company Information</h4>
                    <div className="detail-grid">
                      <div><strong>Name:</strong> {selectedSupplier.name}</div>
                      <div><strong>Contact Person:</strong> {selectedSupplier.contact_person || 'N/A'}</div>
                      <div><strong>Status:</strong> 
                        <span style={{
                          marginLeft: '8px',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          backgroundColor: selectedSupplier.is_active ? '#d4edda' : '#f8d7da',
                          color: selectedSupplier.is_active ? '#155724' : '#721c24'
                        }}>
                          {selectedSupplier.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4><FontAwesomeIcon icon={faEnvelope} /> Contact Information</h4>
                    <div className="detail-grid">
                      <div><strong>Email:</strong> {selectedSupplier.email || 'N/A'}</div>
                      <div><strong>Phone:</strong> {selectedSupplier.phone || 'N/A'}</div>
                      <div><strong>Address:</strong> {selectedSupplier.address || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>System Information</h4>
                    <div className="detail-grid">
                      <div><strong>Supplier ID:</strong> {selectedSupplier.id}</div>
                      <div><strong>Products:</strong> {selectedSupplier.product_count || 0}</div>
                      <div><strong>Created:</strong> {new Date(selectedSupplier.created_at).toLocaleDateString()}</div>
                      <div><strong>Updated:</strong> {new Date(selectedSupplier.updated_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="action-btn secondary" onClick={() => setShowDetailsModal(false)}>
                  Close
                </button>
                <button className="action-btn primary" onClick={() => {
                  setShowDetailsModal(false);
                  handleEdit(selectedSupplier);
                }}>
                  <FontAwesomeIcon icon={faEdit} /> Edit Supplier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SuppliersManagement;
