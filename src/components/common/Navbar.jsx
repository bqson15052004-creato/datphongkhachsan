import React from 'react';
import { Layout, Button, Dropdown, Avatar, Space, Typography, App as AntApp, Badge, Tooltip } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  HomeOutlined,
  MessageOutlined,
  AuditOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import { useCookies } from 'react-cookie';
import avartar from "../../../public/avartar.jpg"

const { Header } = Layout;
const { Title, Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  
  // Lấy trực tiếp user từ cookie
  const [cookies, _, removeCookie] = useCookies(["user"]);

  const handle_logout = () => {
    removeCookie("user");
    message.success('Đã đăng xuất thành công!');
    navigate('/'); 
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
      {/* 1. LOGO SECTION */}
      <div 
        className="logo" 
        style={logoStyle} 
        onClick={() => navigate(cookies.user ? '/customer/home' : '/')}
      >
        <HomeOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '8px' }} />
        <Title level={4} style={{ margin: 0, color: '#1890ff', letterSpacing: '0.5px' }}>
          HOTEL BOOKING
        </Title>
      </div>

      {/* 2. RIGHT SECTION: LOGIN STATUS */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {cookies.user ? (
          <Space size="large">
            {/* 1. Tin nhắn */}
            <Tooltip title="Tin nhắn">
              <div 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }} 
                onClick={() => navigate('/customer/messages')}
              >
              <Badge size="small" offset={[2, 0]}>
                <MessageOutlined style={{ fontSize: '20px', color: '#595959' }} />
              </Badge>
              </div>
            </Tooltip>

            {/* 2. Lịch sử đặt phòng */}
            <Tooltip title="Lịch sử đặt phòng">
              <div 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }} 
                onClick={() => navigate('/customer/customerbookings')} 
              >
                <AuditOutlined style={{ fontSize: '20px', color: '#595959' }} />
              </div>
            </Tooltip>

            {/* 3. Hồ sơ cá nhân */}
            <Dropdown menu={{ items: user_menu_items }} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', transition: 'all 0.3s' }} className="user-dropdown-hover">
                <Avatar 
                  style={{ backgroundColor: '#1890ff' }} 
                  src={cookies.user.avartar ? cookies.user.avartar : avartar} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <Text strong style={{ fontSize: '14px' }}>
                    {cookies.user.full_name || cookies.user.user_name || 'Người dùng'}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 600 }}>
                    {cookies.user.role || 'Thành viên'}
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        ) : (
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

      <style>{`
        .user-dropdown-hover:hover {
          background: #f5f5f5;
        }
      `}</style>
    </Header>
  );
};

// --- STYLES ---
const headerStyle = {
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between',
  background: '#fff', 
  padding: '0 2%', 
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  position: 'fixed', 
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