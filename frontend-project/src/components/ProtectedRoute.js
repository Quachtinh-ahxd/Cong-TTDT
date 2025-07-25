import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (!isAuthenticated) {
    // Chuyển hướng đến trang đăng nhập và lưu lại đường dẫn hiện tại
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;

