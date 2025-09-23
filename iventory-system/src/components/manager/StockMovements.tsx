import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import './css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowsRotate, 
  faPlus, 
  faFileExport, 
  faRotateRight, 
  faArrowUp,
  faArrowDown,
  faEye,
  faCheck,
  faTimes,
  faCalendarAlt,
  faUser,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

interface StockMovement {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reason: string;
  reference_number?: string;
  created_by: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  location_from?: string;
  location_to?: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  current_stock: number;
  min_stock_level: number;
}

const StockMovements: React.FC = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal states
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);

  // Form state
  const [form, setForm] = useState({
    product_id: 0,
    movement_type: 'adjustment' as 'in' | 'out' | 'adjustment' | 'transfer',
    quantity: 0,
    reason: '',
    reference_number: '',
    location_from: '',
    location_to: ''
  });

  useEffect(() => {
    loadStockMovements();
    loadProducts();
  }, []);

  const loadStockMovements = async () => {
    try {
      setLoading(true);
      // Mock data
      setMovements([
        {
          id: 1,
          product_id: 1,
          product_name: 'Laptop Dell XPS 13',
          sku: 'DELL-XPS13-001',
          movement_type: 'in',
          quantity: 10,
          previous_quantity: 5,
          new_quantity: 15,
          reason: 'New stock arrival from supplier',
          reference_number: 'PO-2025-001',
          created_by: 'John Manager',
          created_at: '2025-09-23T10:30:00Z',
          status: 'approved',
          approved_by: 'Admin User',
          approved_at: '2025-09-23T11:00:00Z'
        },
        {
          id: 2,
          product_id: 2,
          product_name: 'Wireless Mouse',
          sku: 'MOUSE-WRL-001',
          movement_type: 'out',
          quantity: 5,
          previous_quantity: 25,
          new_quantity: 20,
          reason: 'Sale to customer',
          reference_number: 'SO-2025-045',
          created_by: 'Alice Staff',
          created_at: '2025-09-23T09:15:00Z',
          status: 'approved',
          approved_by: 'John Manager',
          approved_at: '2025-09-23T09:30:00Z'
        },
        {
          id: 3,
          product_id: 3,
          product_name: 'Office Chair',
          sku: 'CHAIR-OFF-001',
          movement_type: 'adjustment',
          quantity: -2,
          previous_quantity: 4,
          new_quantity: 2,
          reason: 'Damaged items found during inspection',
          created_by: 'Bob Staff',
          created_at: '2025-09-22T16:45:00Z',
          status: 'pending'
        },
        {
          id: 4,
          product_id: 1,
          product_name: 'Laptop Dell XPS 13',
          sku: 'DELL-XPS13-001',
          movement_type: 'transfer',
          quantity: 3,
          previous_quantity: 15,
          new_quantity: 12,
          reason: 'Transfer to branch office',
          location_from: 'Main Warehouse',
          location_to: 'Branch Office A',
          created_by: 'Carol Manager',
          created_at: '2025-09-22T14:20:00Z',
          status: 'pending'
        },
        {
          id: 5,
          product_id: 4,
          product_name: 'Monitor 24"',
          sku: 'MON-24-001',
          movement_type: 'out',
          quantity: 2,
          previous_quantity: 8,
          new_quantity: 6,
          reason: 'Customer return processing',
          reference_number: 'RET-2025-012',
          created_by: 'David Staff',
          created_at: '2025-09-21T11:30:00Z',
          status: 'rejected',
          approved_by: 'John Manager',
          approved_at: '2025-09-21T12:00:00Z'
        }
      ]);
    } catch (err) {
      setError('Error loading stock movements');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    setProducts([
      { id: 1, name: 'Laptop Dell XPS 13', sku: 'DELL-XPS13-001', current_stock: 12, min_stock_level: 10 },
      { id: 2, name: 'Wireless Mouse', sku: 'MOUSE-WRL-001', current_stock: 20, min_stock_level: 15 },
      { id: 3, name: 'Office Chair', sku: 'CHAIR-OFF-001', current_stock: 2, min_stock_level: 5 },
      { id: 4, name: 'Monitor 24"', sku: 'MON-24-001', current_stock: 6, min_stock_level: 8 }
    ]);
  };

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.created_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || movement.movement_type === filterType;
    const matchesStatus = filterStatus === 'all' || movement.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'in': return '#28a745';
      case 'out': return '#dc3545';
      case 'adjustment': return '#ffc107';
      case 'transfer': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'pending': return '#ffc107';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in': return faArrowUp;
      case 'out': return faArrowDown;
      case 'adjustment': return faExclamationTriangle;
      case 'transfer': return faArrowsRotate;
      default: return faArrowsRotate;
    }
  };

  const handleApproveMovement = async (movementId: number) => {
    try {
      setMovements(prev => prev.map(movement => 
        movement.id === movementId 
          ? { 
              ...movement, 
              status: 'approved' as const,
              approved_by: 'Current Manager',
              approved_at: new Date().toISOString()
            } 
          : movement
      ));
    } catch (error) {
      console.error('Failed to approve movement:', error);
    }
  };

  const handleRejectMovement = async (movementId: number) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      try {
        setMovements(prev => prev.map(movement => 
          movement.id === movementId 
            ? { 
                ...movement, 
                status: 'rejected' as const,
                approved_by: 'Current Manager',
                approved_at: new Date().toISOString()
              } 
            : movement
        ));
      } catch (error) {
        console.error('Failed to reject movement:', error);
      }
    }
  };

  const viewMovementDetails = (movement: StockMovement) => {
    setSelectedMovement(movement);
    setShowDetailsModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedProduct = products.find(p => p.id === form.product_id);
      if (!selectedProduct) return;

      let newQuantity = selectedProduct.current_stock;
      let quantity = form.quantity;

      if (form.movement_type === 'in') {
        newQuantity += quantity;
      } else if (form.movement_type === 'out' || form.movement_type === 'transfer') {
        newQuantity -= quantity;
      } else if (form.movement_type === 'adjustment') {
        // For adjustments, quantity can be positive or negative
        newQuantity += quantity;
      }

      const newMovement: StockMovement = {
        id: movements.length + 1,
        product_id: form.product_id,
        product_name: selectedProduct.name,
        sku: selectedProduct.sku,
        movement_type: form.movement_type,
        quantity: Math.abs(quantity),
        previous_quantity: selectedProduct.current_stock,
        new_quantity: Math.max(0, newQuantity),
        reason: form.reason,
        reference_number: form.reference_number,
        created_by: 'Current Manager',
        created_at: new Date().toISOString(),
        status: 'pending',
        location_from: form.location_from,
        location_to: form.location_to
      };

      setMovements(prev => [newMovement, ...prev]);
      setShowMovementModal(false);
      setForm({
        product_id: 0,
        movement_type: 'adjustment',
        quantity: 0,
        reason: '',
        reference_number: '',
        location_from: '',
        location_to: ''
      });
    } catch (error) {
      console.error('Failed to create movement:', error);
    }
  };

  const exportMovements = () => {
    const data = JSON.stringify(filteredMovements, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock_movements_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout title="Stock Movements">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">Stock Movements</h1>
          <p className="content-subtitle">Monitor and approve stock adjustments and transfers</p>
        </div>

        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => setShowMovementModal(true)}>
            <FontAwesomeIcon icon={faPlus} /> Create Movement
          </button>
          <button className="quick-action-btn" onClick={exportMovements}>
            <FontAwesomeIcon icon={faFileExport} /> Export Movements
          </button>
          <button className="quick-action-btn" onClick={loadStockMovements}>
            <FontAwesomeIcon icon={faRotateRight} /> Refresh
          </button>
        </div>

        {error && (
          <div className="alert error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Create Movement Modal */}
        {showMovementModal && (
          <div className="modal-overlay" onClick={() => setShowMovementModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Create Stock Movement</h3>
                <button 
                  className="modal-close" 
                  onClick={() => setShowMovementModal(false)}
                  type="button"
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <label>Product</label>
                      <select 
                        className="form-select" 
                        value={form.product_id}
                        onChange={e => setForm({...form, product_id: Number(e.target.value)})}
                        required
                      >
                        <option value={0}>Select Product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} (Current: {product.current_stock})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label>Movement Type</label>
                      <select 
                        className="form-select" 
                        value={form.movement_type}
                        onChange={e => setForm({...form, movement_type: e.target.value as any})}
                      >
                        <option value="in">Stock In</option>
                        <option value="out">Stock Out</option>
                        <option value="adjustment">Adjustment</option>
                        <option value="transfer">Transfer</option>
                      </select>
                    </div>

                    <div>
                      <label>Quantity</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={form.quantity}
                        onChange={e => setForm({...form, quantity: Number(e.target.value)})}
                        min={form.movement_type === 'adjustment' ? undefined : "1"}
                        required 
                      />
                      {form.movement_type === 'adjustment' && (
                        <small style={{ color: '#666', fontSize: '12px' }}>
                          Use negative numbers to reduce stock
                        </small>
                      )}
                    </div>

                    <div>
                      <label>Reference Number (Optional)</label>
                      <input 
                        className="form-input" 
                        value={form.reference_number}
                        onChange={e => setForm({...form, reference_number: e.target.value})}
                        placeholder="PO, SO, or other reference"
                      />
                    </div>
                  </div>

                  {form.movement_type === 'transfer' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div>
                        <label>From Location</label>
                        <input 
                          className="form-input" 
                          value={form.location_from}
                          onChange={e => setForm({...form, location_from: e.target.value})}
                          placeholder="Source location"
                          required
                        />
                      </div>
                      <div>
                        <label>To Location</label>
                        <input 
                          className="form-input" 
                          value={form.location_to}
                          onChange={e => setForm({...form, location_to: e.target.value})}
                          placeholder="Destination location"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: '20px' }}>
                    <label>Reason</label>
                    <textarea 
                      className="form-input" 
                      value={form.reason}
                      onChange={e => setForm({...form, reason: e.target.value})}
                      rows={3}
                      placeholder="Reason for stock movement..."
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button type="button" className="action-btn secondary" onClick={() => setShowMovementModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="action-btn primary">
                      Create Movement
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Movement Details Modal */}
        {showDetailsModal && selectedMovement && (
          <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Movement Details - {selectedMovement.product_name}</h3>
                <button 
                  className="modal-close" 
                  onClick={() => setShowDetailsModal(false)}
                  type="button"
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <h4>Movement Information</h4>
                    <p><strong>Product:</strong> {selectedMovement.product_name}</p>
                    <p><strong>SKU:</strong> <code>{selectedMovement.sku}</code></p>
                    <p><strong>Type:</strong> 
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        backgroundColor: getMovementTypeColor(selectedMovement.movement_type),
                        color: '#ffffff',
                        marginLeft: '8px',
                        fontSize: '12px'
                      }}>
                        <FontAwesomeIcon icon={getMovementIcon(selectedMovement.movement_type)} /> {selectedMovement.movement_type.toUpperCase()}
                      </span>
                    </p>
                    <p><strong>Quantity:</strong> {selectedMovement.quantity}</p>
                    <p><strong>Previous Stock:</strong> {selectedMovement.previous_quantity}</p>
                    <p><strong>New Stock:</strong> {selectedMovement.new_quantity}</p>
                  </div>
                  <div>
                    <h4>Process Information</h4>
                    <p><strong>Status:</strong> 
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        backgroundColor: getStatusColor(selectedMovement.status),
                        color: '#ffffff',
                        marginLeft: '8px',
                        fontSize: '12px'
                      }}>
                        {selectedMovement.status.toUpperCase()}
                      </span>
                    </p>
                    <p><strong>Created By:</strong> {selectedMovement.created_by}</p>
                    <p><strong>Created At:</strong> {new Date(selectedMovement.created_at).toLocaleString()}</p>
                    {selectedMovement.approved_by && (
                      <>
                        <p><strong>Approved By:</strong> {selectedMovement.approved_by}</p>
                        <p><strong>Approved At:</strong> {selectedMovement.approved_at ? new Date(selectedMovement.approved_at).toLocaleString() : 'N/A'}</p>
                      </>
                    )}
                    {selectedMovement.reference_number && (
                      <p><strong>Reference:</strong> {selectedMovement.reference_number}</p>
                    )}
                  </div>
                </div>

                {selectedMovement.movement_type === 'transfer' && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4>Transfer Details</h4>
                    <p><strong>From:</strong> {selectedMovement.location_from}</p>
                    <p><strong>To:</strong> {selectedMovement.location_to}</p>
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <h4>Reason</h4>
                  <p>{selectedMovement.reason}</p>
                </div>

                {selectedMovement.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button 
                      className="action-btn secondary" 
                      onClick={() => {
                        handleRejectMovement(selectedMovement.id);
                        setShowDetailsModal(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} /> Reject
                    </button>
                    <button 
                      className="action-btn primary" 
                      onClick={() => {
                        handleApproveMovement(selectedMovement.id);
                        setShowDetailsModal(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faCheck} /> Approve
                    </button>
                  </div>
                )}
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
                  placeholder="Search movements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ margin: 0 }}
                />
              </div>
              <div style={{ minWidth: '130px' }}>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-select"
                  style={{ margin: 0 }}
                >
                  <option value="all">All Types</option>
                  <option value="in">Stock In</option>
                  <option value="out">Stock Out</option>
                  <option value="adjustment">Adjustment</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div style={{ minWidth: '120px' }}>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-select"
                  style={{ margin: 0 }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon"><FontAwesomeIcon icon={faArrowsRotate} /></span>
              Stock Movements ({filteredMovements.length})
            </h3>
          </div>
          <div className="card-content">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="loading-spinner"></div>
                <p>Loading stock movements...</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Stock Change</th>
                    <th>Created By</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovements.map(movement => (
                    <tr key={movement.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                            {movement.product_name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666666' }}>
                            <code>{movement.sku}</code>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#ffffff',
                          backgroundColor: getMovementTypeColor(movement.movement_type)
                        }}>
                          <FontAwesomeIcon icon={getMovementIcon(movement.movement_type)} /> {movement.movement_type.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: '500' }}>
                          {movement.quantity}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div style={{ fontSize: '12px', color: '#666666' }}>
                            {movement.previous_quantity} → {movement.new_quantity}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            fontWeight: '500',
                            color: movement.new_quantity > movement.previous_quantity ? '#28a745' : '#dc3545'
                          }}>
                            {movement.new_quantity > movement.previous_quantity ? '+' : ''}{movement.new_quantity - movement.previous_quantity}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <FontAwesomeIcon icon={faUser} color="#666" />
                          {movement.created_by}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <FontAwesomeIcon icon={faCalendarAlt} color="#666" />
                          <div style={{ fontSize: '12px' }}>
                            {new Date(movement.created_at).toLocaleDateString()}
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
                            backgroundColor: getStatusColor(movement.status)
                          }}
                        >
                          {movement.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="action-btn secondary"
                            style={{ minWidth: 'auto', padding: '6px 12px' }}
                            onClick={() => viewMovementDetails(movement)}
                          >
                            <FontAwesomeIcon icon={faEye} /> View
                          </button>
                          {movement.status === 'pending' && (
                            <>
                              <button 
                                className="action-btn primary"
                                style={{ minWidth: 'auto', padding: '6px 12px' }}
                                onClick={() => handleApproveMovement(movement.id)}
                              >
                                <FontAwesomeIcon icon={faCheck} /> Approve
                              </button>
                              <button 
                                className="action-btn secondary"
                                style={{ minWidth: 'auto', padding: '6px 12px', backgroundColor: '#dc3545' }}
                                onClick={() => handleRejectMovement(movement.id)}
                              >
                                <FontAwesomeIcon icon={faTimes} /> Reject
                              </button>
                            </>
                          )}
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

export default StockMovements;
