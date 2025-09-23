import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import '../admin/css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox, 
  faSearch, 
  faFilter,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faBarcode,
  faTags,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';

interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  barcode?: string;
  category_name?: string;
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

const InventoryViewer: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/staff/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Error loading products');
      console.error('Products loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories for filter
  const categories = [...new Set(products.map(p => p.category_name).filter(Boolean))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category_name === filterCategory;
    
    let matchesStock = true;
    if (filterStock === 'low') {
      matchesStock = product.stock_quantity <= product.min_stock_level;
    } else if (filterStock === 'out') {
      matchesStock = product.stock_quantity === 0;
    } else if (filterStock === 'normal') {
      matchesStock = product.stock_quantity > product.min_stock_level;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity === 0) {
      return { status: 'out', color: '#dc3545', icon: faTimesCircle, text: 'Out of Stock' };
    } else if (product.stock_quantity <= product.min_stock_level) {
      return { status: 'low', color: '#ffc107', icon: faExclamationTriangle, text: 'Low Stock' };
    } else {
      return { status: 'normal', color: '#28a745', icon: faCheckCircle, text: 'In Stock' };
    }
  };

  if (loading) {
    return (
      <MainLayout title="Inventory Viewer">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner"></div>
          <p>Loading inventory...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Inventory Viewer">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">Inventory Viewer</h1>
          <p className="content-subtitle">View current inventory levels and product information</p>
        </div>

        {error && (
          <div className="alert error" style={{ marginBottom: '20px' }}>
            <span>⚠️</span>
            {error}
            <button onClick={() => setError('')} style={{ float: 'right', background: 'none', border: 'none', color: 'inherit' }}>×</button>
          </div>
        )}

        {/* Filters */}
        <div className="dashboard-card" style={{ marginBottom: '20px' }}>
          <div className="card-content" style={{ padding: '15px 20px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="form-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                className="form-select"
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
              >
                <option value="all">All Stock Levels</option>
                <option value="normal">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
              <button className="action-btn secondary" onClick={loadProducts}>
                <FontAwesomeIcon icon={faSearch} /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid" style={{ marginBottom: '20px' }}>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faBox} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{products.length}</div>
              <div className="stat-label">Total Products</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#28a745' }}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {products.filter(p => p.stock_quantity > p.min_stock_level).length}
              </div>
              <div className="stat-label">In Stock</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#ffc107' }}>
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {products.filter(p => p.stock_quantity <= p.min_stock_level && p.stock_quantity > 0).length}
              </div>
              <div className="stat-label">Low Stock</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#dc3545' }}>
              <FontAwesomeIcon icon={faTimesCircle} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {products.filter(p => p.stock_quantity === 0).length}
              </div>
              <div className="stat-label">Out of Stock</div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon"><FontAwesomeIcon icon={faBox} /></span>
              Products ({filteredProducts.length})
            </h3>
          </div>
          <div className="card-content">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>SKU</th>
                    <th>Stock Level</th>
                    <th>Unit Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <tr key={product.id}>
                        <td>
                          <div>
                            <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                              {product.name}
                            </div>
                            {product.description && (
                              <div style={{ fontSize: '12px', color: '#666666' }}>
                                {product.description.length > 50 
                                  ? product.description.substring(0, 50) + '...' 
                                  : product.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2'
                          }}>
                            <FontAwesomeIcon icon={faTags} style={{ marginRight: '4px' }} />
                            {product.category_name || 'Uncategorized'}
                          </span>
                        </td>
                        <td>
                          <code style={{
                            padding: '2px 6px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '3px',
                            fontSize: '12px'
                          }}>
                            <FontAwesomeIcon icon={faBarcode} style={{ marginRight: '4px' }} />
                            {product.sku}
                          </code>
                        </td>
                        <td>
                          <div>
                            <div style={{ 
                              fontWeight: '500',
                              color: stockStatus.color
                            }}>
                              {product.stock_quantity} {product.unit_of_measure || 'pcs'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666666' }}>
                              Min: {product.min_stock_level}
                              {product.max_stock_level && ` | Max: ${product.max_stock_level}`}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: '500' }}>
                            ${Number(product.unit_price).toFixed(2)}
                          </div>
                        </td>
                        <td>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: stockStatus.color + '20',
                            color: stockStatus.color,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <FontAwesomeIcon icon={stockStatus.icon} />
                            {stockStatus.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666666' }}>
                  <FontAwesomeIcon icon={faBox} size="3x" style={{ marginBottom: '15px', opacity: 0.3 }} />
                  <p>No products found matching your criteria</p>
                  <button className="action-btn secondary" onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                    setFilterStock('all');
                  }}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InventoryViewer;
