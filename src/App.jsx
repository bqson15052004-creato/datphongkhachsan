import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

// 1. NHÓM XÁC THỰC & HỆ THỐNG
import ProtectedRoute from './pages/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import AdminLogin from './pages/admin/AdminLogin';
import RoleSelection from './pages/auth/RoleSelection';
import RegisterForm from './pages/auth/RegisterForm';
import Profile from './pages/customer/Profile';

// 2. NHÓM KHÁCH HÀNG
import Home from './pages/customer/Home';
import HotelList from './pages/customer/HotelList';
import HotelDetail from './pages/customer/HotelDetail';
import Checkout from './pages/customer/Checkout';
import CustomerBookings from './pages/customer/CustomerBookings';

// 3. NHÓM ĐỐI TÁC (PARTNER)
import PartnerLayout from './components/layouts/PartnerLayout';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import HotelManagement from './pages/partner/HotelManagement';
import PartnerRooms from './pages/partner/PartnerRooms';
import RoomNumbers from './pages/partner/RoomNumbers';
import PartnerBookings from './pages/partner/PartnerBookings';
import PartnerMessages from './pages/partner/PartnerMessages';

// 4. NHÓM QUẢN TRỊ VIÊN (ADMIN)
import AdminLayout from './components/layouts/AdminLayout';
import AdminPartners from './pages/admin/AdminPartners';
import UserManagement from './pages/admin/UserManagement';
import AdminCategories from './pages/admin/AdminCategories';
import AdminDiscounts from './pages/admin/AdminDiscounts';
import AdminReports from './pages/admin/AdminReports';
import AdminRevenues from './pages/admin/AdminRevenues';

const RootAdminRoute = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  
  // Kiểm tra: Phải là admin VÀ phải là Level 1
  const is_authorized = user.role === 'admin';// && user.level === 1;
  
  return is_authorized ? <Outlet /> : <Navigate to="/admin/dashboard" replace />;
};

function App() {
  return (
    <ConfigProvider 
      theme={{ 
        token: { 
          colorPrimary: '#1890ff', 
          borderRadius: 8,
          fontFamily: 'Inter, sans-serif'
        } 
      }}
    >
      <AntApp>
        <AuthProvider>
          <div style={{ minHeight: '100vh', width: '100%', background: '#f5f7fa' }}>
            <BrowserRouter>
            <Routes>
              {/* --- ROUTE CÔNG KHAI (PUBLIC) --- */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RoleSelection />} />
              <Route path="/register/form" element={<RegisterForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/hotels" element={<HotelList />} />
              <Route path="/hotel/:id" element={<HotelDetail />} />

              {/* --- PHÂN HỆ KHÁCH HÀNG (CUSTOMER) --- */}
              <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-bookings" element={<CustomerBookings />} />
              </Route>

              {/* --- PHÂN HỆ ĐỐI TÁC (PARTNER) --- 
                  Khớp với thực thể partner trong ERD (business_name, id_tax...)
              */}
              <Route element={<ProtectedRoute allowedRoles={['partner']} />}>
                <Route path="/partner" element={<PartnerLayout />}>
                  <Route index element={<Navigate to="/partner/dashboard" replace />} />
                  <Route path="dashboard" element={<PartnerDashboard />} />
                  <Route path="rooms" element={<PartnerRooms />} />
                  <Route path="hotels" element={<HotelManagement />} />
                  <Route path="bookings" element={<PartnerBookings />} />
                  <Route path="messages" element={<PartnerMessages />} />
                  <Route path="roomnumbers" element={<RoomNumbers />} />
                </Route>
              </Route>

              {/* --- PHÂN HỆ QUẢN TRỊ (ADMIN) --- 
                  ProtectedRoute sẽ check current_user.role === 'admin'
              */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<div style={{ padding: '24px' }}><h2>Hệ thống quản trị sẵn sàng!</h2></div>} />
                  
                  {/* Các trang Admin Cấp 2 cũng thấy được */}
                  <Route path="partners" element={<AdminPartners />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="reports" element={<AdminReports />} />

                  {/* CHỈ ADMIN CẤP 1 (ROOT LEVEL 1) MỚI VÀO ĐƯỢC CÁC ROUTE NÀY */}
                  <Route element={<RootAdminRoute />}>
                    <Route path="users" element={<UserManagement />} />
                    <Route path="revenues" element={<AdminRevenues />} />
                    <Route path="discounts" element={<AdminDiscounts />} />
                  </Route>
                </Route>
              </Route>

              {/* --- ROUTE DÙNG CHUNG (CẦN LOGIN) --- */}
              <Route element={<ProtectedRoute allowedRoles={['customer', 'admin', 'partner']} />}>
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* 404 - QUAY VỀ TRANG CHỦ */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </BrowserRouter>
          </div>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;