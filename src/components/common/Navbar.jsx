import React, { useContext } from 'react';
import { Layout, Button, Dropdown, Avatar, Space, Typography, App as AntApp, Badge } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  HomeOutlined,
  MessageOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

const { Header } = Layout;
const { Title, Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  
  // Quan trọng: Lấy trực tiếp user từ Context để Navbar tự render lại khi login thành công
  const { user, logout } = useContext(AuthContext);

  const handle_logout = () => {
    logout();
    message.success('Đã đăng xuất thành công!');
    navigate('/'); 
  };

  const user_menu_items = [
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: <UserOutlined />,
      onClick: () => navigate('/customer/profile'), // Nhớ đúng path nhé ông
    },
    {
      key: 'messages',
      label: 'Tin nhắn của tôi',
      icon: <MessageOutlined />,
      onClick: () => navigate('/messages'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handle_logout,
    },
  ];

  return (
    <Header style={headerStyle}>
      {/* 1. LOGO SECTION */}
      <div className="logo" style={logoStyle} onClick={() => navigate('/')}>
        <HomeOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '8px' }} />
        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>HOTEL BOOKING</Title>
      </div>

      {/* 2. RIGHT SECTION: LOGIN STATUS */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          /* --- TRẠNG THÁI: ĐÃ ĐĂNG NHẬP (CUSTOMER/ADMIN/PARTNER) --- */
          <Space size="large">
            {/* Tin nhắn */}
            <div 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} 
              onClick={() => navigate('/messages')}
            >
              <Badge count={3} size="small" offset={[2, 0]}>
                <MessageOutlined style={{ fontSize: '20px', color: '#595959' }} />
              </Badge>
            </div>

            {/* Thông tin User */}
            <Dropdown menu={{ items: user_menu_items }} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer', padding: '0 8px' }}>
                <Avatar 
                  style={{ backgroundColor: '#1890ff' }} 
                  icon={<UserOutlined />} 
                  src={user.avatar} // Hiện avatar từ dữ liệu user
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <Text strong>{user.full_name || user.user_name || 'Người dùng'}</Text>
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                    {user.role || 'Thành viên'}
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        ) : (
          /* --- TRẠNG THÁI: GUEST (CHƯA ĐĂNG NHẬP) --- */
          <Space>
            <Button type="text" onClick={() => navigate('/login')}>
              Đăng nhập
            </Button>
            <Button 
              type="primary" 
              onClick={() => navigate('/register')} 
              style={{ borderRadius: '6px', fontWeight: 600 }}
            >
              Đăng ký
            </Button>
          </Space>
        )}
      </div>
    </Header>
  );
};

// --- STYLES ---
const headerStyle = {
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between',
  background: '#fff', 
  padding: '0 5%', // Tui đổi sang 5% cho nó co giãn theo màn hình
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  position: 'fixed', // Giữ Navbar ở đỉnh khi cuộn
  top: 0, 
  zIndex: 1000, 
  width: '100%',
  height: '64px'
};

const logoStyle = { 
  cursor: 'pointer', 
  display: 'flex', 
  alignItems: 'center' 
};

export default Navbar;