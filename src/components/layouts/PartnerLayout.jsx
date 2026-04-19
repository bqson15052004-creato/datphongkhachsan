import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme, Avatar, Dropdown, App as AntApp, Modal, Typography } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  CalendarOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
  ShopOutlined,
  MessageOutlined,
  ExclamationCircleFilled,
  UnorderedListOutlined,
  TagOutlined // Thêm icon cho mã giảm giá
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { confirm } = Modal;

const PartnerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntApp.useApp();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 1. LẤY THÔNG TIN USER
  const userData = sessionStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  // 2. KIỂM TRA QUYỀN TRUY CẬP
  useEffect(() => {
    if (!user || user.role !== 'partner') {
      message.error('Bạn không có quyền truy cập vùng đối tác!');
      navigate('/'); 
    }
  }, [user, navigate, message]);

  // 3. LOGIC ĐĂNG XUẤT
  const handle_logout = () => {
    confirm({
      title: 'Xác nhận đăng xuất',
      icon: <ExclamationCircleFilled />,
      content: 'Bạn có chắc chắn muốn thoát khỏi hệ thống đối tác?',
      okText: 'Đăng xuất',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        sessionStorage.clear();
        message.success('Đã đăng xuất thành công!');
        window.location.href = '/'; 
      },
    });
  };

  // 4. Menu người dùng
  const user_menu_items = [
    /*{
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: <ProfileOutlined />,
      onClick: () => navigate('/partner/profile'),
    },*/
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handle_logout,
    },
  ];

  // 5. Sidebar Menu - ĐÃ CẬP NHẬT THÊM MỤC GIẢM GIÁ
  const menu_items = [
    { key: '/partner/dashboard', icon: <BarChartOutlined />, label: 'Báo cáo doanh thu' },
    { key: '/partner/profile', icon: <ProfileOutlined />, label: 'Hồ sơ cá nhân' },
    { key: '/partner/hotels', icon: <ShopOutlined />, label: 'Quản lý khách sạn' },
    { key: '/partner/rooms', icon: <HomeOutlined />, label: 'Quản lý loại phòng' },
    { key: '/partner/roomnumbers', icon: <UnorderedListOutlined />, label: 'Quản lý phòng' },
    { key: '/partner/bookings', icon: <CalendarOutlined />, label: 'Đơn đặt phòng' },
    { key: '/partner/discounts', icon: <TagOutlined />, label: 'Mã giảm giá' }, 
    { key: '/partner/messages', icon: <MessageOutlined />, label: 'Nhắn tin' },
  ];

  if (!user || user.role !== 'partner') return null;

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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#001529',
          borderBottom: '1px solid #1d39c4'
        }}>
          <div style={{ color: '#1890ff', fontWeight: 'bold', fontSize: collapsed ? 16 : 18 }}>
            {collapsed ? 'PH' : 'PARTNER HOTEL'}
          </div>
          {!collapsed && (
            <div style={{ color: '#8c8c8c', fontSize: 10, textTransform: 'uppercase' }}>
              Kênh đối tác
            </div>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={menu_items}
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
          
          <Dropdown menu={{ items: user_menu_items }} placement="bottomRight" arrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '0 12px' }}>
              <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                <Text strong style={{ display: 'block' }}>
                  {user.business_name || user.full_name}
                </Text>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  {user.role?.toUpperCase()}
                </Text>
              </div>
              <Avatar 
                style={{ backgroundColor: '#1890ff' }} 
                src={user.avatar} 
                icon={<UserOutlined />} 
              />
            </div>
          </Dropdown>
        </Header>

        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: colorBgContainer, 
          borderRadius: borderRadiusLG,
          minHeight: 'calc(100vh - 112px)',
          overflow: 'auto'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PartnerLayout;