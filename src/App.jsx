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

// 2. NHÓM LAYOUT
import CustomerLayout from './components/layouts/CustomerLayout';
import PartnerLayout from './components/layouts/PartnerLayout';
import AdminLayout from './components/layouts/AdminLayout';

// 3. NHÓM GUEST (Khách vãng lai - Chưa đăng nhập)
import GuestHome from './pages/guest/Home';
import GuestHotelList from './pages/guest/HotelList';
import GuestHotelDetail from './pages/guest/HotelDetail';

// 4. NHÓM CUSTOMER (Khách hàng - Đã đăng nhập)
import CustomerHome from './pages/customer/Home';
import CustomerHotelList from './pages/customer/HotelList';
import CustomerHotelDetail from './pages/customer/HotelDetail';
import Checkout from './pages/customer/Checkout';
import CustomerBookings from './pages/customer/CustomerBookings';
import CustomerMessages from './pages/customer/Messages';
import Profile from './pages/customer/Profile';

// 5. NHÓM ĐỐI TÁC (PARTNER)
import PartnerRegister from './pages/partner/ParterRegister';
import PartnerLogin from './pages/partner/PartnerLogin';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import HotelManagement from './pages/partner/HotelManagement';
import PartnerRooms from './pages/partner/PartnerRooms';
import RoomNumbers from './pages/partner/RoomNumbers';
import PartnerBookings from './pages/partner/PartnerBookings';
import PartnerMessages from './pages/partner/PartnerMessages';
import PartnerDiscounts from './pages/partner/PartnerDiscounts';
import PartnerProfile from './pages/partner/PartnerProfile';

// 6. NHÓM QUẢN TRỊ VIÊN (ADMIN)
import AdminLogin from './pages/admin/AdminLogin';
import AdminPartners from './pages/admin/AdminPartners';
import UserManagement from './pages/admin/UserManagement';
import AdminCategories from './pages/admin/AdminCategories';
import AdminAmenity from './pages/admin/AdminAmenity';
import AdminDiscounts from './pages/admin/AdminDiscounts';
import AdminRevenues from './pages/admin/AdminRevenues';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';

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
                {/* GIAO DIỆN CHUNG (GUEST & CUSTOMER) - Dùng chung Navbar có auto nhận diện */}
                <Route element={<CustomerLayout />}>
                  
                  {/* --- NHÁNH GUEST (Public) --- */}
                  <Route path="/" element={<GuestHome />} />
                  <Route path="/hotels" element={<GuestHotelList />} />
                  <Route path="/hotel/:id" element={<GuestHotelDetail />} />

                  {/* --- NHÁNH CUSTOMER (Private - Yêu cầu Login) --- */}
                  <Route path="/customer" element={<ProtectedRoute allowedRoles={['customer']} />}>
                    <Route index element={<Navigate to="/customer/home" replace />} />
                    <Route path="home" element={<CustomerHome />} />
                    
                    {/* Đã đồng bộ tên đường dẫn với nhánh Guest */}
                    <Route path="hotels" element={<CustomerHotelList />} /> 
                    <Route path="hotel/:id" element={<CustomerHotelDetail />} />
                    
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="customerbookings" element={<CustomerBookings />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="messages" element={<CustomerMessages />} />
                  </Route>

                </Route>

                {/* ================= CÁC TRANG LOGIN/REGISTER ================= */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RoleSelection />} />
                <Route path="/register/form" element={<RegisterForm />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/partner/login" element={<PartnerLogin />} />
                <Route path="/partner/register" element={<PartnerRegister />} />

                {/* ================= PHÂN HỆ ĐỐI TÁC (PARTNER) ================= */}
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

                {/* ================= PHÂN HỆ QUẢN TRỊ (ADMIN) ================= */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard/>} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="partners" element={<AdminPartners />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="amenities" element={<AdminAmenity />} />
                    <Route element={<RootAdminRoute />}>
                      <Route path="users" element={<UserManagement />} />
                      <Route path="revenues" element={<AdminRevenues />} />
                      <Route path="discounts" element={<AdminDiscounts />} />
                    </Route>
                  </Route>
                </Route>

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