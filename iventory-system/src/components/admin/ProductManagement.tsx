import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import './css/dashboard.css';

interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  category_id: number;
  category_name?: string;
  unit_price: number;
  cost_price: number;
  stock_quantity: number;
  min_stock_level: number;
  is_active: boolean;
  created_at: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadProducts();
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
      // Mock data for now
      setProducts([
        {
          id: 1,
          name: 'Laptop Dell XPS 13',
          description: 'High-performance laptop for business use',
          sku: 'DELL-XPS13-001',
          category_id: 1,
          category_name: 'Electronics',
          unit_price: 1299.99,
          cost_price: 999.99,
          stock_quantity: 15,
          min_stock_level: 5,
          is_active: true,
          created_at: '2025-09-23T08:07:44.846284'
        },
        {
          id: 2,
          name: 'Wireless Mouse',
          description: 'Ergonomic wireless mouse with USB receiver',
          sku: 'MOUSE-WL-001',
          category_id: 1,
          category_name: 'Electronics',
          unit_price: 29.99,
          cost_price: 19.99,
          stock_quantity: 50,
          min_stock_level: 10,
          is_active: true,
          created_at: '2025-09-23T08:07:44.846284'
        },
        {
          id: 3,
          name: 'A4 Paper Ream',
          description: 'White A4 copy paper, 500 sheets',
          sku: 'PAPER-A4-500',
          category_id: 2,
          category_name: 'Office Supplies',
          unit_price: 8.99,
          cost_price: 6.99,
          stock_quantity: 100,
          min_stock_level: 20,
          is_active: true,
          created_at: '2025-09-23T08:07:44.846284'
        },
        {
          id: 4,
          name: 'Office Chair',
          description: 'Ergonomic office chair with lumbar support',
          sku: 'CHAIR-ERG-001',
          category_id: 3,
          category_name: 'Furniture',
          unit_price: 299.99,
          cost_price: 199.99,
          stock_quantity: 8,
          min_stock_level: 3,
          is_active: true,
          created_at: '2025-09-23T08:07:44.846284'
        },
        {
          id: 5,
          name: 'Printer Ink Cartridge',
          description: 'Black ink cartridge for HP printers',
          sku: 'INK-HP-BK',
          category_id: 2,
          category_name: 'Office Supplies',
          unit_price: 39.99,
          cost_price: 24.99,
          stock_quantity: 25,
          min_stock_level: 5,
          is_active: true,
          created_at: '2025-09-23T08:07:44.846284'
        }
      ]);
    } finally {
      setLoading(false);
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

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category_name).filter(Boolean)))];

  return (
    <MainLayout title="📦 Product Management">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">Product Management</h1>
          <p className="content-subtitle">Manage inventory products and stock levels</p>
        </div>

        <div className="quick-actions">
          <button className="quick-action-btn">
            ➕ Add New Product
          </button>
          <button className="quick-action-btn">
            📊 Export Products
          </button>
          <button className="quick-action-btn" onClick={loadProducts}>
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className="alert error">
            <span>⚠️</span>
            {error}
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
                  {categories.map(category => (
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
              <span className="card-icon">📦</span>
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
                              ${product.unit_price.toFixed(2)}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666666' }}>
                              Cost: ${product.cost_price.toFixed(2)}
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
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              className="action-btn secondary"
                              style={{ minWidth: 'auto', padding: '6px 12px' }}
                            >
                              📊 Stock
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
