import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import './css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faPlus, faFileExport, faRotateRight, faEdit, faEye, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

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
  unit_price: number | string;
  cost_price: number | string;
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

const InventoryManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Form state for stock adjustment
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState({
    quantity: 0,
    type: 'add', // 'add' or 'remove'
    reason: ''
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadSuppliers();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Mock data for now
      setProducts([
        {
          id: 1,
          name: 'Laptop Dell XPS 13',
          description: 'High-performance ultrabook',
          sku: 'DELL-XPS13-001',
          category_id: 1,
          category_name: 'Electronics',
          supplier_id: 1,
          supplier_name: 'Dell Inc.',
          unit_price: 1299.99,
          cost_price: 999.99,
          stock_quantity: 5,
          min_stock_level: 10,
          max_stock_level: 50,
          unit_of_measure: 'pcs',
          is_active: true,
          created_at: '2025-01-01'
        },
        {
          id: 2,
          name: 'Wireless Mouse',
          description: 'Ergonomic wireless mouse',
          sku: 'MOUSE-WRL-001',
          category_id: 1,
          category_name: 'Electronics',
          supplier_id: 2,
          supplier_name: 'Logitech',
          unit_price: 29.99,
          cost_price: 19.99,
          stock_quantity: 25,
          min_stock_level: 20,
          max_stock_level: 100,
          unit_of_measure: 'pcs',
          is_active: true,
          created_at: '2025-01-01'
        },
        {
          id: 3,
          name: 'Office Chair',
          description: 'Ergonomic office chair',
          sku: 'CHAIR-OFF-001',
          category_id: 2,
          category_name: 'Furniture',
          supplier_id: 3,
          supplier_name: 'Herman Miller',
          unit_price: 299.99,
          cost_price: 199.99,
          stock_quantity: 2,
          min_stock_level: 5,
          max_stock_level: 25,
          unit_of_measure: 'pcs',
          is_active: true,
          created_at: '2025-01-01'
        }
      ]);
    } catch (err) {
      setError('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    setCategories([
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Furniture' },
      { id: 3, name: 'Office Supplies' }
    ]);
  };

  const loadSuppliers = async () => {
    setSuppliers([
      { id: 1, name: 'Dell Inc.' },
      { id: 2, name: 'Logitech' },
      { id: 3, name: 'Herman Miller' }
    ]);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category_name === filterCategory;
    
    let matchesStock = true;
    if (filterStock === 'low') {
      matchesStock = product.stock_quantity <= product.min_stock_level;
    } else if (filterStock === 'out') {
      matchesStock = product.stock_quantity === 0;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity <= 0) {
      return { label: 'Out of Stock', color: '#dc3545', priority: 'critical' };
    } else if (product.stock_quantity <= product.min_stock_level) {
      return { label: 'Low Stock', color: '#ffc107', priority: 'warning' };
    } else {
      return { label: 'In Stock', color: '#28a745', priority: 'normal' };
    }
  };

  const categoryFilterOptions = ['all', ...Array.from(new Set(products.map(p => p.category_name).filter(Boolean)))];

  const openStockAdjustment = (product: Product) => {
    setSelectedProduct(product);
    setStockAdjustment({
      quantity: 0,
      type: 'add',
      reason: ''
    });
    setShowStockModal(true);
  };

  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      // Mock API call
      const newQuantity = stockAdjustment.type === 'add' 
        ? selectedProduct.stock_quantity + stockAdjustment.quantity
        : selectedProduct.stock_quantity - stockAdjustment.quantity;

      // Update local state
      setProducts(prev => prev.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, stock_quantity: Math.max(0, newQuantity) }
          : p
      ));

      setShowStockModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Stock adjustment failed:', error);
    }
  };

  const exportInventory = () => {
    const data = JSON.stringify(filteredProducts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout title="Inventory Management">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">Inventory Management</h1>
          <p className="content-subtitle">Monitor and manage inventory levels and stock movements</p>
        </div>

        <div className="quick-actions">
          <button className="quick-action-btn" onClick={exportInventory}>
            <FontAwesomeIcon icon={faFileExport} /> Export Inventory
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

        {/* Stock Adjustment Modal */}
        {showStockModal && selectedProduct && (
          <div className="modal-overlay" onClick={() => setShowStockModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Adjust Stock - {selectedProduct.name}</h3>
                <button 
                  className="modal-close" 
                  onClick={() => setShowStockModal(false)}
                  type="button"
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleStockAdjustment}>
                  <div style={{ marginBottom: '15px' }}>
                    <p><strong>Current Stock:</strong> {selectedProduct.stock_quantity} {selectedProduct.unit_of_measure}</p>
                    <p><strong>Min Level:</strong> {selectedProduct.min_stock_level}</p>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label>Adjustment Type</label>
                    <select 
                      className="form-select" 
                      value={stockAdjustment.type}
                      onChange={e => setStockAdjustment({...stockAdjustment, type: e.target.value})}
                    >
                      <option value="add">Add Stock</option>
                      <option value="remove">Remove Stock</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label>Quantity</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={stockAdjustment.quantity}
                      onChange={e => setStockAdjustment({...stockAdjustment, quantity: Number(e.target.value)})}
                      min="1"
                      required 
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label>Reason</label>
                    <textarea 
                      className="form-input" 
                      value={stockAdjustment.reason}
                      onChange={e => setStockAdjustment({...stockAdjustment, reason: e.target.value})}
                      rows={3}
                      placeholder="Reason for stock adjustment..."
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button type="button" className="action-btn secondary" onClick={() => setShowStockModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="action-btn primary">
                      Adjust Stock
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
              <div style={{ minWidth: '120px' }}>
                <select
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="form-select"
                  style={{ margin: 0 }}
                >
                  <option value="all">All Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon"><FontAwesomeIcon icon={faBox} /></span>
              Inventory Items ({filteredProducts.length})
            </h3>
          </div>
          <div className="card-content">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="loading-spinner"></div>
                <p>Loading inventory...</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Supplier</th>
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
                        <td>{product.supplier_name}</td>
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
                            <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              {stockStatus.priority === 'critical' && <FontAwesomeIcon icon={faExclamationTriangle} color="#dc3545" />}
                              {stockStatus.priority === 'warning' && <FontAwesomeIcon icon={faExclamationTriangle} color="#ffc107" />}
                              {product.stock_quantity} {product.unit_of_measure}
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
                              onClick={() => openStockAdjustment(product)}
                              title="Adjust Stock"
                            >
                              <FontAwesomeIcon icon={faEdit} />
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

export default InventoryManagement;
