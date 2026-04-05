import React from 'react';
import { Layout, Button, Dropdown, Avatar, Space, Typography, App as AntApp } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  HomeOutlined,
  DashboardOutlined,
  HistoryOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Title, Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  
  // 1. Lấy thông tin user hiện tại từ localStorage
  // Key 'current_user' để đồng bộ với các trang quản trị khác
  const user = JSON.parse(localStorage.getItem('current_user'));

  // 2. Logic: Đăng xuất
  const handle_logout = () => {
    localStorage.removeItem('current_user');
    message.success('Đã đăng xuất thành công!');
    navigate('/');
    window.location.reload(); // Refresh để xóa sạch state cũ
  };

  // 3. Menu thả xuống khi nhấn vào Avatar
  const user_menu_items = [
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'history',
      label: 'Lịch sử đặt phòng',
      icon: <HistoryOutlined />,
      onClick: () => {
        // Phân luồng điều hướng dựa trên thuộc tính 'role' trong CSDL
        if (user?.role === 'partner') {
          navigate('/partner/bookings');
        } else {
          navigate('/my-bookings');
        }
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handle_logout,
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
      <div className="logo" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
        <HomeOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '8px' }} />
        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
          HOTEL BOOKING
        </Title>
      </div>

      {/* Right Side: User Info / Login */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          <Space size="middle">
            {/* Nút dành cho Đối tác - Dựa trên trường 'role' */}
            {user.role === 'partner' && (
              <Button 
                type="primary" 
                ghost 
                icon={<DashboardOutlined />}
                onClick={() => navigate('/partner/dashboard')}
              >
                Kênh Đối Tác
              </Button>
            )}

            {/* Nút dành cho Admin - Dựa trên thực thể 'admin' trong ERD */}
            {user.role === 'admin' && (
              <Button 
                type="primary" 
                danger
                ghost 
                icon={<SettingOutlined />}
                onClick={() => navigate('/admin/dashboard')}
              >
                Quản trị hệ thống
              </Button>
            )}

            <Dropdown menu={{ items: user_menu_items }} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer', padding: '0 8px' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  {/* Khớp với trường 'full_name' hoặc 'user_name' trong CSDL */}
                  <Text strong>{user.full_name || user.user_name}</Text>
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                    {user.role}
                  </Text>
                </div>
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