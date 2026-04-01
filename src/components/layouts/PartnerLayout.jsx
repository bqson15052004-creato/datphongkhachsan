import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Avatar, Dropdown, App as AntApp, Modal, Typography, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  HomeOutlined,
  CalendarOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
  ShopOutlined,
  WalletOutlined,
  MessageOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { confirm } = Modal;

const PartnerLayout = () => {
  const [is_collapsed, set_is_collapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntApp.useApp();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 1. Lấy thông tin user_data
  const user_data = JSON.parse(localStorage.getItem('user_data')) || { 
    full_name: 'Đối tác khách sạn',
    avatar_url: null 
  };

  const handle_logout = () => {
    confirm({
      title: 'Xác nhận đăng xuất',
      icon: <ExclamationCircleFilled />,
      content: 'Bạn có chắc chắn muốn rời khỏi hệ thống quản trị đối tác?',
      okText: 'Đăng xuất',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        localStorage.removeItem('user_data');
        localStorage.removeItem('access_token');
        message.success('Đã đăng xuất thành công!');
        navigate('/');
      },
    });
  };

  // 2. Menu người dùng
  const user_menu_items = [
    {
      key: 'profile',
      label: 'Hồ sơ doanh nghiệp',
      icon: <ProfileOutlined />,
      onClick: () => navigate('/partner/profile'),
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

  // 3. Danh sách Menu điều hướng Sider
  const sidebar_menu_items = [
    { key: '/partner/dashboard', icon: <BarChartOutlined />, label: 'Báo cáo doanh thu' },
    { key: '/partner/hotels', icon: <ShopOutlined />, label: 'Quản lý khách sạn' },
    { key: '/partner/rooms', icon: <HomeOutlined />, label: 'Quản lý phòng' },
    { key: '/partner/bookings', icon: <CalendarOutlined />, label: 'Đơn đặt phòng' },
    { key: '/partner/withdraw', icon: <WalletOutlined />, label: 'Quản lý rút tiền' },
    { key: '/partner/messages', icon: <MessageOutlined />, label: 'Tin nhắn khách hàng' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null}
        collapsible 
        collapsed={is_collapsed}
        theme="dark"
        width={250}
        style={{ boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)' }}
      >
        <div style={logo_style}>
          <div style={{ color: '#1890ff', fontSize: is_collapsed ? 16 : 20, fontWeight: 'bold' }}>
            {is_collapsed ? 'PH' : 'PARTNER HUB'}
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={sidebar_menu_items}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          padding: '0 24px 0 0', 
          background: colorBgContainer, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          zIndex: 1
        }}>
          <Button
            type="text"
            icon={is_collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => set_is_collapsed(!is_collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <Dropdown menu={{ items: user_menu_items }} placement="bottomRight" arrow>
            <Space style={{ cursor: 'pointer', padding: '0 12px' }}>
              <Avatar 
                src={user_data.avatar_url} 
                style={{ backgroundColor: '#1890ff' }} 
                icon={<UserOutlined />} 
              />
              <Text strong>{user_data.full_name}</Text>
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: colorBgContainer, 
          borderRadius: borderRadiusLG,
          minHeight: 280,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

// HỆ THỐNG STYLE CONSTANTS
const logo_style = { 
  height: 64, 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  background: '#002140',
  borderBottom: '1px solid #111'
};

export default PartnerLayout;