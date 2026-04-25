import React, { useContext } from 'react';
import { Layout, Button, Dropdown, Avatar, Space, Typography, App as AntApp, Badge } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  HomeOutlined,
  MessageOutlined // Thêm icon tin nhắn
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

const { Header } = Layout;
const { Title, Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const { user, logout } = useContext(AuthContext);

  const handle_logout = () => {
    logout();
    message.success('Đã đăng xuất thành công!');
    navigate('/'); // Đưa về trang chủ sau khi logout
  };

  const user_menu_items = [
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    // Thêm mục tin nhắn vào menu xổ xuống cho mobile hoặc tiện lợi
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
      {/* Logo */}
      <div className="logo" style={logoStyle} onClick={() => navigate('/')}>
        <HomeOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '8px' }} />
        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>HOTEL BOOKING</Title>
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          <Space size="large">
            {/* ICON TIN NHẮN CÓ BADGE THÔNG BÁO */}
            <div 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} 
              onClick={() => navigate('/messages')}
            >
              <Badge count={3} size="small" offset={[2, 0]}>
                <MessageOutlined style={{ fontSize: '20px', color: '#595959' }} />
              </Badge>
            </div>

            {/* DROPDOWN USER */}
            <Dropdown menu={{ items: user_menu_items }} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer', padding: '0 8px' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                <div style={{ display: 'none', md: { display: 'flex' }, flexDirection: 'column', lineHeight: '1.2' }}>
                   {/* Dùng div bọc để ẩn text trên màn hình quá nhỏ nếu cần */}
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

const headerStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  background: '#fff', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  position: 'sticky', top: 0, zIndex: 1000, width: '100%'
};

const logoStyle = { cursor: 'pointer', display: 'flex', alignItems: 'center' };

export default Navbar;