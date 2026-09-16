import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useHRMS } from '../context/HRMSContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, userRole } = useHRMS();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
