import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { App as AntApp } from 'antd';

const ProtectedRoute = ({ allowedRoles }) => {
  const { message } = AntApp.useApp();
  const location = useLocation();
  
  // 1. Lấy dữ liệu user từ localStorage
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  // 2. Hiệu ứng thông báo khi bị từ chối truy cập
  useEffect(() => {
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      message.warning({
        content: "Tài khoản của bạn không có quyền truy cập vào khu vực này!",
        key: 'auth_denied', // Dùng key để tránh spam nhiều message giống nhau
        duration: 3
      });
    }
  }, [user, allowedRoles, message]);

  // 3. Nếu chưa đăng nhập: Đá về login và lưu lại vị trí hiện tại (để sau khi login xong quay lại đúng trang này)
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. Kiểm tra quyền truy cập
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Nếu là đối tác nhầm sang admin hoặc ngược lại, đá về dashboard tương ứng của họ
    const fallbackUrl = user.role === 'admin' ? '/admin/dashboard' : 
                        user.role === 'partner' ? '/partner/dashboard' : '/';
    return <Navigate to={fallbackUrl} replace />;
  }

  // 5. Hợp lệ: Mở cổng cho vào!
  return <Outlet />;
};

export default ProtectedRoute;