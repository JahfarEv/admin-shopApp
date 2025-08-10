// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const location = useLocation();
  const adminToken = localStorage.getItem('adminToken');
  const salesmanToken = localStorage.getItem('salesmanToken');

  const isAuthenticated = adminToken || salesmanToken;

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
