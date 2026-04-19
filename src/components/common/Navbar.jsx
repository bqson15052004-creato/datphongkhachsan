import React, { useContext } from 'react'; // 1. Nhớ thêm useContext ở đây
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
import AuthContext from '../../contexts/AuthContext';

const { Header } = Layout;
const { Title, Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  
  // 2. Lấy user và hàm logout trực tiếp từ Context
  const { user, logout } = useContext(AuthContext);

  // 3. Logic Đăng xuất giờ cực kỳ ngắn gọn
  const handle_logout = () => {
    logout(); // Hàm logout trong Context của ông đã lo hết việc xóa storage và reset state rồi
    message.success('Đã đăng xuất thành công!');
    // Không cần window.location.reload() nữa, vì logout() làm state user thành null => Navbar tự đổi!
  };

  const user_menu_items = [
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
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

      {/* Right Side: Dựa vào biến 'user' từ Context để hiển thị */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          <Space size="middle">
            <Dropdown menu={{ items: user_menu_items }} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer', padding: '0 8px' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
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

// Gom style ra ngoài cho gọn code
const headerStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  background: '#fff', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  position: 'sticky', top: 0, zIndex: 1000, width: '100%'
};

const logoStyle = { cursor: 'pointer', display: 'flex', alignItems: 'center' };

export default Navbar;