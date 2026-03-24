import React from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space, Typography, App as AntApp } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  HistoryOutlined, 
  HomeOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Header } = Layout;
const { Title, Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  
  // 1. Lấy thông tin user hiện tại
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    message.success('Đã đăng xuất thành công!');
    navigate('/login');
  };

  // 2. Logic phân luồng Lịch sử đặt phòng (QUAN TRỌNG)
  const handleBookingHistory = () => {
    if (user.role === 'partner') {
      navigate('/partner/bookings'); // Luồng cho đối tác
    } else {
      navigate('/my-bookings'); // Luồng cho khách hàng
    }
  };

  // Menu khi nhấn vào Avatar
  const userMenuItems = [
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'history',
      label: user?.role === 'partner' ? 'Quản lý đơn đặt' : 'Chuyến đi của tôi',
      icon: <HistoryOutlined />,
      onClick: handleBookingHistory,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      background: '#fff',
      padding: '0 50px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%'
    }}>
      {/* Logo */}
      <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
          <HomeOutlined /> HOTEL BOOKING
        </Title>
      </div>

      {/* Right Side: User Info / Login */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          <Space size="middle">
            {user.role === 'partner' && (
              <Button type="primary" ghost onClick={() => navigate('/partner/dashboard')}>
                Kênh Đối Tác
              </Button>
            )}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                <Text strong>{user.fullName || user.username}</Text>
              </Space>
            </Dropdown>
          </Space>
        ) : (
          <Space>
            <Button type="text" onClick={() => navigate('/login')}>Đăng nhập</Button>
            <Button type="primary" onClick={() => navigate('/register')}>Đăng ký</Button>
          </Space>
        )}
      </div>
    </Header>
  );
};

export default Navbar;