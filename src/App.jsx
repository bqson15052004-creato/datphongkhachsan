import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

// 1. NHÓM XÁC THỰC & HỆ THỐNG
import ProtectedRoute from './pages/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import RoleSelection from './pages/auth/RoleSelection';
import RegisterForm from './pages/auth/RegisterForm';

// 2. NHÓM KHÁCH HÀNG (CUSTOMER)
import Home from './pages/customer/Home';
import HotelList from './pages/customer/HotelList';
import HotelDetail from './pages/customer/HotelDetail';
import Checkout from './pages/customer/Checkout';
import CustomerBookings from './pages/customer/CustomerBookings';
import Profile from './pages/customer/Profile'; // Hồ sơ customer sẵn có

// 3. NHÓM ĐỐI TÁC (PARTNER)
import PartnerLogin from './pages/partner/PartnerLogin';
import PartnerLayout from './components/layouts/PartnerLayout';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import HotelManagement from './pages/partner/HotelManagement';
import PartnerRooms from './pages/partner/PartnerRooms';
import RoomNumbers from './pages/partner/RoomNumbers';
import PartnerBookings from './pages/partner/PartnerBookings';
import PartnerMessages from './pages/partner/PartnerMessages';
import PartnerDiscounts from './pages/partner/PartnerDiscounts';
import PartnerProfile from './pages/partner/PartnerProfile'; // HỒ SƠ PARTNER MỚI

// 4. NHÓM QUẢN TRỊ VIÊN (ADMIN)
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/layouts/AdminLayout';
import AdminPartners from './pages/admin/AdminPartners';
import UserManagement from './pages/admin/UserManagement';
import AdminCategories from './pages/admin/AdminCategories';
import AdminDiscounts from './pages/admin/AdminDiscounts';
import AdminRevenues from './pages/admin/AdminRevenues';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile'; // HỒ SƠ ADMIN MỚI

const RootAdminRoute = () => {
  const user = JSON.parse(sessionStorage.getItem('user')) || {};
  const is_authorized = user.role === 'admin';
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
              <Route path="/partner/login" element={<PartnerLogin />} />

              <Route path="/hotels" element={<HotelList />} />
              <Route path="/hotel/:id" element={<HotelDetail />} />

              {/* PHÂN HỆ KHÁCH HÀNG (CUSTOMER) */}
              <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/bookings" element={<CustomerBookings />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* PHÂN HỆ ĐỐI TÁC (PARTNER) */}
              <Route element={<ProtectedRoute allowedRoles={['partner']} />}>
                <Route path="/partner" element={<PartnerLayout />}>
                  <Route index element={<Navigate to="/partner/dashboard" replace />} />
                  <Route path="dashboard" element={<PartnerDashboard />} />
                  <Route path="profile" element={<PartnerProfile />} />
                  <Route path="rooms" element={<PartnerRooms />} />
                  <Route path="hotels" element={<HotelManagement />} />
                  <Route path="bookings" element={<PartnerBookings />} />
                  <Route path="messages" element={<PartnerMessages />} />
                  <Route path="roomnumbers" element={<RoomNumbers />} />
                  <Route path="discounts" element={<PartnerDiscounts/>} />
                </Route>
              </Route>

              {/* PHÂN HỆ QUẢN TRỊ (ADMIN) */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard/>} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="partners" element={<AdminPartners />} />
                  <Route path="categories" element={<AdminCategories />} />

                  <Route element={<RootAdminRoute />}>
                    <Route path="users" element={<UserManagement />} />
                    <Route path="revenues" element={<AdminRevenues />} />
                    <Route path="discounts" element={<AdminDiscounts />} />
                  </Route>
                </Route>
              </Route>

              {/* HẾT PHẦN ROUTE CHUNG - Đã chuyển hết vào từng phân hệ cụ thể */}

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