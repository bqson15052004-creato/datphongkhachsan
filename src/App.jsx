import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import './App.css';

// Import các trang
import RoleSelection from './pages/auth/RoleSelection';
import Home from './pages/customer/Home';
import RegisterForm from './pages/auth/Registerform';
import Login from './pages/auth/Login';
import Profile from './pages/customer/Profile';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/layouts/AdminLayout';
import PartnerLayout from './components/layouts/PartnerLayout';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import ProtectedRoute from './pages/auth/ProtectedRoute';
import UserManagement from './pages/admin/UserManagement';
import AdminPartners from './pages/admin/AdminPartners';
import HotelManagement from './pages/partner/HotelManagement';
import PartnerRooms from './pages/partner/PartnerRooms';
import HotelDetail from './pages/customer/HotelDetail';
import CustomerBookings from './pages/customer/CustomerBookings';
import PartnerBookings from './pages/partner/PartnerBookings';
import AdminCategories from './pages/admin/AdminCotegories';
import AdminDiscounts from './pages/admin/AdminDiscounts';
import AdminReports from './pages/admin/AdminReports';
import AdminRevenues from './pages/admin/AdminRevenues';
import AdminComplaints from './pages/admin/AdminComplaints';
import PartnerWithdrawals from './pages/partner/PartnerWithdrawals';
import PartnerMessages from './pages/partner/PartnerMessages';
import Checkout from './pages/customer/CheckOut';

// 1. Hàm khởi tạo dữ liệu mẫu
const initData = () => {
  const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
  if (existingUsers.length === 0) {
    const seedUsers = [
      {
        username: 'doitac', 
        email: 'doitac@gmail.com', 
        password: '123abc', 
        role: 'partner', 
        fullName: 'Hotel A Owner'
      },
      {
        username: 'khachhang',
        email: 'khachhang@gmail.com', 
        password: '123abc', 
        role: 'customer', 
        fullName: 'Nguyễn Văn A'
      }
    ];
    localStorage.setItem('users', JSON.stringify(seedUsers));
  }
};

initData();

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1890ff', borderRadius: 8 } }}>
      <AntApp>
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <BrowserRouter>
            <Routes>
              {/* --- ROUTE CÔNG KHAI --- */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RoleSelection />} />
              <Route path="/register/form" element={<RegisterForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/hotel/:id" element={<HotelDetail />} />

              {/* --- BẢO VỆ KHÁCH HÀNG (Di chuyển Checkout vào đây) --- */}
              <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-bookings" element={<CustomerBookings />} />
              </Route>

              {/* --- BẢO VỆ ADMIN --- */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" />} />
                  <Route path="dashboard" element={<div style={{ padding: '24px' }}><h2>Chào mừng Admin!</h2></div>} />
                  <Route path="partners" element={<AdminPartners />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="revenues" element={<AdminRevenues />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="discounts" element={<AdminDiscounts />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="complaints" element={<AdminComplaints />} />
                </Route>
              </Route>

              {/* --- BẢO VỆ ĐỐI TÁC --- */}
              <Route element={<ProtectedRoute allowedRoles={['partner']} />}>
                <Route path="/partner" element={<PartnerLayout />}>
                  <Route index element={<Navigate to="/partner/dashboard" />} />
                  <Route path="dashboard" element={<PartnerDashboard />} />
                  <Route path="rooms" element={<PartnerRooms />} />
                  <Route path="hotels" element={<HotelManagement />} />
                  <Route path="bookings" element={<PartnerBookings />} />
                  <Route path="withdraw" element={<PartnerWithdrawals />} />
                  <Route path="messages" element={<PartnerMessages />} />
                </Route>
              </Route>

              {/* --- BẢO VỆ CHUNG (HỒ SƠ) --- */}
              <Route element={<ProtectedRoute allowedRoles={['customer', 'admin', 'partner']} />}>
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* ⚠️ QUAN TRỌNG: Route mặc định PHẢI để cuối cùng */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;