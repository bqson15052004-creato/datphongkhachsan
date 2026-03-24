import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Avatar, Dropdown, App as AntApp, Modal } from 'antd';
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
const { confirm } = Modal;

const PartnerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntApp.useApp();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Đối tác' };

  const handleLogout = () => {
    confirm({
      title: 'Xác nhận đăng xuất',
      icon: <ExclamationCircleFilled />,
      content: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống đối tác?',
      okText: 'Đăng xuất',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        localStorage.removeItem('user');
        message.success('Đã đăng xuất thành công!');
        navigate('/');
      },
    });
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: <ProfileOutlined />,
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
      onClick: handleLogout,
    },
  ];

  // Danh sách Menu
  const menuItems = [
    { key: '/partner/dashboard', icon: <BarChartOutlined />, label: 'Báo cáo doanh thu' },
    { key: '/partner/hotels', icon: <ShopOutlined />, label: 'Quản lý khách sạn' },
    { key: '/partner/rooms', icon: <HomeOutlined />, label: 'Quản lý phòng' },
    { key: '/partner/bookings', icon: <CalendarOutlined />, label: 'Đơn đặt phòng' },
    { key: '/partner/withdraw', icon: <WalletOutlined />, label: 'Quản lý rút tiền' },
    { key: '/partner/messages', icon: <MessageOutlined />, label: 'Nhắn tin' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null}
        collapsible 
        collapsed={collapsed}
        theme="dark"
        style={{ boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)' }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: collapsed ? 16 : 18,
          fontWeight: 'bold',
          color: '#1890ff',
          borderBottom: '1px solid #333'
        }}>
          {collapsed ? 'PH' : 'PARTNER HOTEL'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          padding: 0, 
          background: colorBgContainer, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingRight: 24 
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '0 12px' }}>
              <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
              <span style={{ fontWeight: 500 }}>{user.fullName}</span>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PartnerLayout;