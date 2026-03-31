import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import './App.css';

// 1. NHÓM XÁC THỰC & HỆ THỐNG (AUTH & CORE)
import ProtectedRoute from './pages/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import AdminLogin from './pages/admin/AdminLogin';
import RoleSelection from './pages/auth/RoleSelection';
import RegisterForm from './pages/auth/RegisterForm';
import Profile from './pages/customer/Profile';

// 2. NHÓM KHÁCH HÀNG (CUSTOMER)
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
import PartnerBookings from './pages/partner/PartnerBookings';
import PartnerMessages from './pages/partner/PartnerMessages';
import PartnerWithdrawals from './pages/partner/PartnerWithdrawals';

// 4. NHÓM QUẢN TRỊ VIÊN (ADMIN)
import AdminLayout from './components/layouts/AdminLayout';
import AdminPartners from './pages/admin/AdminPartners';
import UserManagement from './pages/admin/UserManagement';
import AdminCategories from './pages/admin/AdminCotegories';
import AdminDiscounts from './pages/admin/AdminDiscounts';
import AdminReports from './pages/admin/AdminReports';
import AdminRevenues from './pages/admin/AdminRevenues';
import AdminComplaints from './pages/admin/AdminComplaints';

// LOGIC BẢO VỆ ROUTE
const RootAdminRoute = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  return user.is_root ? <Outlet /> : <Navigate to="/admin/dashboard" replace />;
};

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1890ff', borderRadius: 8 } }}>
      <AntApp>
        <div style={{ minHeight: '100vh', width: '100%' }}>
          <BrowserRouter>
            <Routes>
              {/* ROUTE CÔNG KHAI */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RoleSelection />} />
              <Route path="/register/form" element={<RegisterForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/hotel/:id" element={<HotelDetail />} />
              <Route path="/hotels" element={<HotelList />} />

              {/* BẢO VỆ KHÁCH HÀNG */}
              <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-bookings" element={<CustomerBookings />} />
              </Route>

              {/* BẢO VỆ ADMIN */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" />} />
                  <Route path="dashboard" element={<div style={{ padding: '24px' }}><h2>Chào mừng Admin!</h2></div>} />
                  <Route path="partners" element={<AdminPartners />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="complaints" element={<AdminComplaints />} />

                  {/* CHỈ ROOT ADMIN */}
                  <Route element={<RootAdminRoute />}>
                    <Route path="users" element={<UserManagement />} />
                    <Route path="revenues" element={<AdminRevenues />} />
                    <Route path="discounts" element={<AdminDiscounts />} />
                  </Route>
                </Route>
              </Route>

              {/* BẢO VỆ ĐỐI TÁC */}
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

              {/* BẢO VỆ CHUNG */}
              <Route element={<ProtectedRoute allowedRoles={['customer', 'admin', 'partner']} />}>
                <Route path="/profile" element={<Profile />} />
              </Route>

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;