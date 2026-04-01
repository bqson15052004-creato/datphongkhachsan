import React, { useContext } from 'react';
import { Layout, Button, Dropdown, Avatar, Space, Typography, App as AntApp } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  HomeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const { Header } = Layout;
const { Title, Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const auth = useContext(AuthContext);
  // prefer context user; fallback to legacy localStorage 'user'
  const user_data = auth?.user || JSON.parse(localStorage.getItem('user') || 'null');

  const handle_logout = () => {
    if (auth && auth.logout) {
      auth.logout();
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      message.success('Đã đăng xuất thành công!');
      navigate('/');
    }
  };

  // 2. Logic phân luồng
  const handle_dashboard_redirect = () => {
    if (user_data?.role === 'partner') {
      navigate('/partner/dashboard');
    } else {
      navigate('/profile');
    }
  };

  // Menu khi nhấn vào Avatar
  const user_menu_items = [
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
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
    <Header style={navbar_style}>
      {/* Logo */}
      <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
          <HomeOutlined /> HOTEL BOOKING
        </Title>
      </div>

      {/* Right Side: User Info / Login */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user_data ? (
          <Space size="middle">
            {/* Nút dành riêng cho đối tác */}
            {user_data?.role === 'partner' && (
              <Button 
                type="primary" 
                ghost 
                onClick={() => navigate('/partner/dashboard')}
                shape="round"
              >
                Kênh Đối Tác
              </Button>
            )}
            
            <Dropdown menu={{ items: user_menu_items }} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  style={{ backgroundColor: '#1890ff' }} 
                  src={user_data?.avatar_url}
                  icon={<UserOutlined />} 
                />
                <Text strong>{user_data?.fullName || user_data?.full_name || user_data?.username}</Text>
              </Space>
            </Dropdown>
          </Space>
        ) : (
          <Space>
            <Button type="text" onClick={() => navigate('/login')}>Đăng nhập</Button>
            <Button type="primary" onClick={() => navigate('/register')} shape="round">Đăng ký</Button>
          </Space>
        )}
      </div>
    </Header>
  );
};

// Hệ thống Style Constants
const navbar_style = { 
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
};

export default Navbar;