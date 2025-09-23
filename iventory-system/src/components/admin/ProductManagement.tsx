import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import './css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faPlus, faFileExport, faRotateRight, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  barcode?: string;
  category_id: number;
  category_name?: string;
  supplier_id?: number;
  supplier_name?: string;
  unit_price: number | string; // Can be string from database
  cost_price: number | string; // Can be string from database
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level?: number;
  unit_of_measure?: string;
  is_active: boolean;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    category_id: 0,
    supplier_id: 0,
    unit_price: 0,
    cost_price: 0,
    stock_quantity: 0,
    min_stock_level: 0,
    max_stock_level: 1000,
    unit_of_measure: 'pcs',
    is_active: true,
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadSuppliers();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (e) {
      // ignore for now; UI can still function
    }
  };

  const loadSuppliers = async () => {
    try {
      const res = await fetch('/api/admin/suppliers');
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data.suppliers || []);
      }
    } catch (e) {
      // ignore for now; UI can still function
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category_name === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity <= 0) {
      return { label: 'Out of Stock', color: '#dc3545' };
    } else if (product.stock_quantity <= product.min_stock_level) {
      return { label: 'Low Stock', color: '#ffc107' };
    } else {
      return { label: 'In Stock', color: '#28a745' };
    }
  };

  const categoryFilterOptions = ['all', ...Array.from(new Set(products.map(p => p.category_name).filter(Boolean)))];

  const openAddForm = () => {
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      sku: '',
      barcode: '',
      category_id: categories[0]?.id || 0,
      supplier_id: suppliers[0]?.id || 0,
      unit_price: 0,
      cost_price: 0,
      stock_quantity: 0,
      min_stock_level: 0,
      max_stock_level: 1000,
      unit_of_measure: 'pcs',
      is_active: true,
    });
    setShowForm(true);
  };

  const openEditForm = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      sku: p.sku,
      barcode: p.barcode || '',
      category_id: p.category_id,
      supplier_id: p.supplier_id || 0,
      unit_price: Number(p.unit_price),
      cost_price: Number(p.cost_price),
      stock_quantity: p.stock_quantity,
      min_stock_level: p.min_stock_level,
      max_stock_level: p.max_stock_level || 1000,
      unit_of_measure: p.unit_of_measure || 'pcs',
      is_active: p.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await loadProducts();
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
    <MainLayout title="Product Management">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">Product Management</h1>
          <p className="content-subtitle">Manage inventory products and stock levels</p>
        </div>

        <div className="quick-actions">
          <button className="quick-action-btn" onClick={openAddForm}>
            <FontAwesomeIcon icon={faPlus} /> Add New Product
          </button>
          <button className="quick-action-btn">
            <FontAwesomeIcon icon={faFileExport} /> Export Products
          </button>
          <button className="quick-action-btn" onClick={loadProducts}>
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
              <h3 className="card-title">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            </div>
            <div className="card-content">
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
                <div>
                  <label>Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label>SKU</label>
                  <input className="form-input" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} required />
                </div>
                <div>
                  <label>Barcode (Optional)</label>
                  <input className="form-input" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} />
                </div>
                <div>
                  <label>Category</label>
                  <select className="form-select" value={form.category_id} onChange={e => setForm({ ...form, category_id: Number(e.target.value) })} required>
                    <option value={0} disabled>Select category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Supplier (Optional)</label>
                  <select className="form-select" value={form.supplier_id} onChange={e => setForm({ ...form, supplier_id: Number(e.target.value) })}>
                    <option value={0}>No supplier</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Unit Price</label>
                  <input type="number" step="0.01" className="form-input" value={form.unit_price} onChange={e => setForm({ ...form, unit_price: Number(e.target.value) })} required />
                </div>
                <div>
                  <label>Cost Price</label>
                  <input type="number" step="0.01" className="form-input" value={form.cost_price} onChange={e => setForm({ ...form, cost_price: Number(e.target.value) })} required />
                </div>
                <div>
                  <label>Stock Quantity</label>
                  <input type="number" className="form-input" value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: Number(e.target.value) })} required />
                </div>
                <div>
                  <label>Min Stock Level</label>
                  <input type="number" className="form-input" value={form.min_stock_level} onChange={e => setForm({ ...form, min_stock_level: Number(e.target.value) })} required />
                </div>
                <div>
                  <label>Max Stock Level</label>
                  <input type="number" className="form-input" value={form.max_stock_level} onChange={e => setForm({ ...form, max_stock_level: Number(e.target.value) })} required />
                </div>
                <div>
                  <label>Unit of Measure</label>
                  <select className="form-select" value={form.unit_of_measure} onChange={e => setForm({ ...form, unit_of_measure: e.target.value })}>
                    <option value="pcs">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="lbs">Pounds</option>
                    <option value="box">Box</option>
                    <option value="pack">Pack</option>
                    <option value="set">Set</option>
                  </select>
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
                  <button type="submit" className="action-btn primary">{editingId ? 'Update Product' : 'Create Product'}</button>
                </div>
              </form>
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
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ margin: 0 }}
                />
              </div>
              <div style={{ minWidth: '150px' }}>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="form-select"
                  style={{ margin: 0 }}
                >
                  {categoryFilterOptions.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon"><FontAwesomeIcon icon={faBox} /></span>
              Products ({filteredProducts.length})
            </h3>
          </div>
          <div className="card-content">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <tr key={product.id}>
                        <td>
                          <div>
                            <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                              {product.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666666' }}>
                              {product.description}
                            </div>
                          </div>
                        </td>
                        <td>
                          <code style={{ 
                            background: '#f8f9fa', 
                            padding: '2px 6px', 
                            borderRadius: '3px',
                            fontSize: '12px'
                          }}>
                            {product.sku}
                          </code>
                        </td>
                        <td>{product.category_name}</td>
                        <td>
                          <div>
                            <div style={{ fontWeight: '500' }}>
                              ${Number(product.unit_price).toFixed(2)}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666666' }}>
                              Cost: ${Number(product.cost_price).toFixed(2)}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: '500' }}>
                              {product.stock_quantity}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666666' }}>
                              Min: {product.min_stock_level}
                            </div>
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
                              backgroundColor: stockStatus.color
                            }}
                          >
                            {stockStatus.label}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="action-btn secondary"
                              style={{ minWidth: 'auto', padding: '6px 12px' }}
                              onClick={() => openEditForm(product)}
                            >
                              <FontAwesomeIcon icon={faEdit} /> Edit
                            </button>
                            <button 
                              className="action-btn secondary"
                              style={{ minWidth: 'auto', padding: '6px 12px' }}
                              onClick={() => handleDelete(product.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductManagement;
