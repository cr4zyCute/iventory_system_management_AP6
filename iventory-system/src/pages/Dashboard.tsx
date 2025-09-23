import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import ManagerDashboard from '../components/manager/ManagerDashboard';
import StaffDashboard from '../components/staff/StaffDashboard';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated (only after loading is complete)
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'staff':
      return <StaffDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default Dashboard;
