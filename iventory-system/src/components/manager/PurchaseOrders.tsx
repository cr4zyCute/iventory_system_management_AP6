import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import './css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardList, 
  faPlus, 
  faFileExport, 
  faRotateRight, 
  faEye, 
  faCheck, 
  faTimes,
  faCalendarAlt,
  faDollarSign,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';

interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  supplier_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  total_amount: number;
  order_date: string;
  expected_delivery: string;
  created_by: string;
  items: PurchaseOrderItem[];
}

interface PurchaseOrderItem {
  id: number;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
}

const PurchaseOrders: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Modal states
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New order form
  const [newOrder, setNewOrder] = useState({
    supplier_id: 0,
    expected_delivery: '',
    items: [] as { product_name: string; sku: string; quantity: number; unit_price: number }[]
  });

  useEffect(() => {
    loadPurchaseOrders();
    loadSuppliers();
  }, []);

  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      // Mock data
      setOrders([
        {
          id: 1,
          po_number: 'PO-2025-001',
          supplier_id: 1,
          supplier_name: 'Dell Inc.',
          status: 'pending',
          total_amount: 12999.90,
          order_date: '2025-09-20',
          expected_delivery: '2025-09-30',
          created_by: 'John Manager',
          items: [
            {
              id: 1,
              product_name: 'Laptop Dell XPS 13',
              sku: 'DELL-XPS13-001',
              quantity: 10,
              unit_price: 1299.99,
              total_price: 12999.90
            }
          ]
        },
        {
          id: 2,
          po_number: 'PO-2025-002',
          supplier_id: 2,
          supplier_name: 'Logitech',
          status: 'approved',
          total_amount: 1499.50,
          order_date: '2025-09-18',
          expected_delivery: '2025-09-25',
          created_by: 'Jane Staff',
          items: [
            {
              id: 2,
              product_name: 'Wireless Mouse',
              sku: 'MOUSE-WRL-001',
              quantity: 50,
              unit_price: 29.99,
              total_price: 1499.50
            }
          ]
        },
        {
          id: 3,
          po_number: 'PO-2025-003',
          supplier_id: 3,
          supplier_name: 'Herman Miller',
          status: 'completed',
          total_amount: 2999.90,
          order_date: '2025-09-15',
          expected_delivery: '2025-09-22',
          created_by: 'John Manager',
          items: [
            {
              id: 3,
              product_name: 'Office Chair',
              sku: 'CHAIR-OFF-001',
              quantity: 10,
              unit_price: 299.99,
              total_price: 2999.90
            }
          ]
        }
      ]);
    } catch (err) {
      setError('Error loading purchase orders');
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    setSuppliers([
      { id: 1, name: 'Dell Inc.', contact_person: 'Mike Dell', email: 'orders@dell.com', phone: '+1-800-DELL' },
      { id: 2, name: 'Logitech', contact_person: 'Sarah Tech', email: 'orders@logitech.com', phone: '+1-800-LOG' },
      { id: 3, name: 'Herman Miller', contact_person: 'Bob Herman', email: 'orders@hermanmiller.com', phone: '+1-800-HM' }
    ]);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const handleApproveOrder = async (orderId: number) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'approved' as const } : order
      ));
    } catch (error) {
      console.error('Failed to approve order:', error);
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      try {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: 'rejected' as const } : order
        ));
      } catch (error) {
        console.error('Failed to reject order:', error);
      }
    }
  };

  const viewOrderDetails = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const exportOrders = () => {
    const data = JSON.stringify(filteredOrders, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchase_orders_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout title="Purchase Orders">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">Purchase Orders</h1>
          <p className="content-subtitle">Manage and approve purchase orders from suppliers</p>
        </div>

        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => setShowCreateModal(true)}>
            <FontAwesomeIcon icon={faPlus} /> Create Order
          </button>
          <button className="quick-action-btn" onClick={exportOrders}>
            <FontAwesomeIcon icon={faFileExport} /> Export Orders
          </button>
          <button className="quick-action-btn" onClick={loadPurchaseOrders}>
            <FontAwesomeIcon icon={faRotateRight} /> Refresh
          </button>
        </div>

        {error && (
          <div className="alert error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
              <div className="modal-header">
                <h3 className="modal-title">Purchase Order Details - {selectedOrder.po_number}</h3>
                <button 
                  className="modal-close" 
                  onClick={() => setShowOrderModal(false)}
                  type="button"
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <h4>Order Information</h4>
                    <p><strong>PO Number:</strong> {selectedOrder.po_number}</p>
                    <p><strong>Status:</strong> 
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        backgroundColor: getStatusColor(selectedOrder.status),
                        color: '#ffffff',
                        marginLeft: '8px',
                        fontSize: '12px'
                      }}>
                        {selectedOrder.status.toUpperCase()}
                      </span>
                    </p>
                    <p><strong>Order Date:</strong> {new Date(selectedOrder.order_date).toLocaleDateString()}</p>
                    <p><strong>Expected Delivery:</strong> {new Date(selectedOrder.expected_delivery).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4>Supplier Information</h4>
                    <p><strong>Supplier:</strong> {selectedOrder.supplier_name}</p>
                    <p><strong>Created By:</strong> {selectedOrder.created_by}</p>
                    <p><strong>Total Amount:</strong> ${selectedOrder.total_amount.toFixed(2)}</p>
                  </div>
                </div>

                <h4>Order Items</h4>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.product_name}</td>
                        <td><code>{item.sku}</code></td>
                        <td>{item.quantity}</td>
                        <td>${item.unit_price.toFixed(2)}</td>
                        <td>${item.total_price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {selectedOrder.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button 
                      className="action-btn secondary" 
                      onClick={() => {
                        handleRejectOrder(selectedOrder.id);
                        setShowOrderModal(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} /> Reject
                    </button>
                    <button 
                      className="action-btn primary" 
                      onClick={() => {
                        handleApproveOrder(selectedOrder.id);
                        setShowOrderModal(false);
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
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ margin: 0 }}
                />
              </div>
              <div style={{ minWidth: '150px' }}>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-select"
                  style={{ margin: 0 }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon"><FontAwesomeIcon icon={faClipboardList} /></span>
              Purchase Orders ({filteredOrders.length})
            </h3>
          </div>
          <div className="card-content">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="loading-spinner"></div>
                <p>Loading purchase orders...</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Supplier</th>
                    <th>Order Date</th>
                    <th>Expected Delivery</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <div style={{ fontWeight: '500' }}>
                          {order.po_number}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666666' }}>
                          by {order.created_by}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FontAwesomeIcon icon={faBuilding} color="#666" />
                          {order.supplier_name}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FontAwesomeIcon icon={faCalendarAlt} color="#666" />
                          {new Date(order.order_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FontAwesomeIcon icon={faCalendarAlt} color="#666" />
                          {new Date(order.expected_delivery).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                          <FontAwesomeIcon icon={faDollarSign} color="#28a745" />
                          ${order.total_amount.toFixed(2)}
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
                            backgroundColor: getStatusColor(order.status)
                          }}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="action-btn secondary"
                            style={{ minWidth: 'auto', padding: '6px 12px' }}
                            onClick={() => viewOrderDetails(order)}
                          >
                            <FontAwesomeIcon icon={faEye} /> View
                          </button>
                          {order.status === 'pending' && (
                            <>
                              <button 
                                className="action-btn primary"
                                style={{ minWidth: 'auto', padding: '6px 12px' }}
                                onClick={() => handleApproveOrder(order.id)}
                              >
                                <FontAwesomeIcon icon={faCheck} /> Approve
                              </button>
                              <button 
                                className="action-btn secondary"
                                style={{ minWidth: 'auto', padding: '6px 12px', backgroundColor: '#dc3545' }}
                                onClick={() => handleRejectOrder(order.id)}
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

export default PurchaseOrders;
