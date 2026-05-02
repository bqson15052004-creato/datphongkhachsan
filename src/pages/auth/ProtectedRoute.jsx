import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { useCookies } from 'react-cookie';

const ProtectedRoute = () => {
  const { message } = AntApp.useApp();
  const navigate = useNavigate();
  
  // 1. Lấy dữ liệu user từ sessionStorage
  const userData = sessionStorage.getItem('user');
  const [cookies,_] = useCookies(["user"]);
 
  // 2. Hiệu ứng thông báo khi bị từ chối truy cập
  useEffect(() => {
    if (!cookies.user) {
      message.warning({
        content: "Tài khoản của bạn không có quyền truy cập vào khu vực này!",
        key: 'auth_denied', // Dùng key để tránh spam nhiều message giống nhau
        duration: 3
      });
      navigate("/login");
    }
  }, [cookies, message,navigate]);

  // 4. Kiểm tra quyền truy cập
  // if (allowedRoles && !allowedRoles.includes(user.role)) {
  //   // Nếu là đối tác nhầm sang admin hoặc ngược lại, đá về dashboard tương ứng của họ
  //   const fallbackUrl = user.role === 'admin' ? '/admin/dashboard' : 
  //                       user.role === 'partner' ? '/partner/dashboard' : '/';
  //   return <Navigate to={fallbackUrl} replace />;
  // }

  // 5. Hợp lệ: Mở cổng cho vào!
  return <Outlet />;
};

export default ProtectedRoute;