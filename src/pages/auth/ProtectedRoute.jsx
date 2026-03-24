import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { message } from 'antd';

const ProtectedRoute = ({ allowedRoles }) => {
  // Thêm bọc try-catch hoặc kiểm tra null để tránh crash app
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    // Chỉ hiện message nếu thực sự cố tình truy cập trái phép
    // tránh hiện message trùng lặp khi redirect
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    message.error("Bạn không có quyền truy cập!");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;