import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';
import StaffDashboard from './components/staff/StaffDashboard';
// Admin Components
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/react-fontawesome';
import '@fortawesome/free-solid-svg-icons';

import UserManagement from './components/admin/UserManagement';
import CreateUser from './components/admin/CreateUser';
import ProductManagement from './components/admin/ProductManagement';
import CategoryManagement from './components/admin/CategoryManagement';
import Reports from './components/admin/Reports';
import SystemSettings from './components/admin/SystemSettings';

// Manager Components
import InventoryManagement from './components/manager/InventoryManagement';
import PurchaseOrders from './components/manager/PurchaseOrders';
import StaffOversight from './components/manager/StaffOversight';
import ManagerReports from './components/manager/ManagerReports';
import SuppliersManagement from './components/manager/SuppliersManagement';
import StockMovements from './components/manager/StockMovements';

// Staff Components
import InventoryViewer from './components/staff/InventoryViewer';
import TaskManagement from './components/staff/TaskManagement';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect root to dashboard if authenticated, otherwise to login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          
          {/* Role-based protected routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/staff-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Legacy dashboard route - redirects based on role */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/create-user" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateUser />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProductManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/categories" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CategoryManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SystemSettings />
              </ProtectedRoute>
            } 
          />

          {/* Manager Routes */}
          <Route 
            path="/manager/inventory" 
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <InventoryManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manager/purchase-orders" 
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <PurchaseOrders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manager/staff" 
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <StaffOversight />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manager/reports" 
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <ManagerReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manager/suppliers" 
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <SuppliersManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manager/stock-movements" 
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <StockMovements />
              </ProtectedRoute>
            } 
          />

          {/* Staff Routes */}
          <Route 
            path="/staff/inventory" 
            element={
              <ProtectedRoute allowedRoles={['staff', 'manager', 'admin']}>
                <InventoryViewer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/tasks" 
            element={
              <ProtectedRoute allowedRoles={['staff', 'manager', 'admin']}>
                <TaskManagement />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
