import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { message } from 'antd';

const ProtectedRoute = ({ allowed_roles }) => {
  const user_data = localStorage.getItem('user');
  const user = user_data ? JSON.parse(user_data) : null;

  if (!user) {
    // Chỉ hiện message nếu thực sự cố tình truy cập trái phép
    return <Navigate to="/login" replace />;
  }

  if (allowed_roles && !allowed_roles.includes(user.role)) {
    message.error("Bạn không có quyền truy cập!");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;