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

// 3. NHÓM ĐỐI TÁC
import PartnerLayout from './components/layouts/PartnerLayout';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import HotelManagement from './pages/partner/HotelManagement';
import PartnerRooms from './pages/partner/PartnerRooms';
import PartnerBookings from './pages/partner/PartnerBookings';
import PartnerMessages from './pages/partner/PartnerMessages';
import PartnerWithdrawals from './pages/partner/PartnerWithdrawals';

// 4. NHÓM QUẢN TRỊ VIÊN
import AdminLayout from './components/layouts/AdminLayout';
import AdminPartners from './pages/admin/AdminPartners';
import UserManagement from './pages/admin/UserManagement';
import AdminCategories from './pages/admin/AdminCotegories';
import AdminDiscounts from './pages/admin/AdminDiscounts';
import AdminReports from './pages/admin/AdminReports';
import AdminRevenues from './pages/admin/AdminRevenues';
import AdminComplaints from './pages/admin/AdminComplaints';

// LOGIC BẢO VỆ ROUTE ROOT ADMIN (Chỉ dành cho Admin Cấp 1)
const RootAdminRoute = () => {
  // Lấy từ admin_data để đồng bộ với AdminLayout
  const admin_data = JSON.parse(localStorage.getItem('admin_data')) || {};
  return admin_data.is_root ? <Outlet /> : <Navigate to="/admin/dashboard" replace />;
};

function App() {
  return (
    <ConfigProvider 
      theme={{ 
        token: { 
          colorPrimary: '#1890ff', 
          borderRadius: 8,
          fontFamily: 'Inter, sans-serif' // Thêm font cho hiện đại
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

              {/* --- PHÂN HỆ ĐỐI TÁC (PARTNER) --- */}
              <Route element={<ProtectedRoute allowedRoles={['partner']} />}>
                <Route path="/partner" element={<PartnerLayout />}>
                  <Route index element={<Navigate to="/partner/dashboard" replace />} />
                  <Route path="dashboard" element={<PartnerDashboard />} />
                  <Route path="rooms" element={<PartnerRooms />} />
                  <Route path="hotels" element={<HotelManagement />} />
                  <Route path="bookings" element={<PartnerBookings />} />
                  <Route path="withdraw" element={<PartnerWithdrawals />} />
                  <Route path="messages" element={<PartnerMessages />} />
                </Route>
              </Route>

              {/* --- PHÂN HỆ QUẢN TRỊ (ADMIN) --- */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<div style={{ padding: '24px' }}><h2>Hệ thống quản trị sẵn sàng!</h2></div>} />
                  <Route path="partners" element={<AdminPartners />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="complaints" element={<AdminComplaints />} />

                  {/* CHỈ ADMIN CẤP 1 (ROOT) MỚI VÀO ĐƯỢC CÁC ROUTE NÀY */}
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