import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme, Avatar, Dropdown, App as AntApp, Modal, Typography } from 'antd';
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
// import axiosClient from '../../services/axiosClient'; // Mở ra khi kết nối BE thật

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

  // 1. ĐỒNG BỘ DỮ LIỆU: Lấy đúng key 'user' từ Login.jsx
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  // 2. KIỂM TRA QUYỀN TRUY CẬP: Chỉ cho phép role 'partner' vào đây
  useEffect(() => {
    if (!user || user.role !== 'partner') {
      message.error('Bạn không có quyền truy cập vùng đối tác!');
      navigate('/'); // Đá về trang chủ nếu sai quyền
    }
  }, [user, navigate, message]);

  // 3. LOGIC ĐĂNG XUẤT (Giữ chỗ cho BE)
  const handle_logout = () => {
    confirm({
      title: 'Xác nhận đăng xuất',
      icon: <ExclamationCircleFilled />,
      content: 'Bạn có chắc chắn muốn thoát khỏi hệ thống đối tác?',
      okText: 'Đăng xuất',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          /* --- GỌI API LOGOUT BE (NẾU CẦN) --- */
          // await axiosClient.post('/accounts/logout/');
        } catch (e) { console.log(e) }

        // Clear sạch LocalStorage để đảm bảo an toàn
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        
        message.success('Đã đăng xuất thành công!');
        navigate('/');
      },
    });
  };

  // 4. Menu người dùng (Avatar Dropdown)
  const user_menu_items = [
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: <ProfileOutlined />,
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

  // 5. Sidebar Menu (Khớp với ERD khách sạn, phòng, booking)
  const menu_items = [
    { key: '/partner/dashboard', icon: <BarChartOutlined />, label: 'Báo cáo doanh thu' },
    { key: '/partner/hotels', icon: <ShopOutlined />, label: 'Quản lý khách sạn' },
    { key: '/partner/rooms', icon: <HomeOutlined />, label: 'Quản lý phòng' },
    { key: '/partner/bookings', icon: <CalendarOutlined />, label: 'Đơn đặt phòng' },
    { key: '/partner/withdraw', icon: <WalletOutlined />, label: 'Quản lý rút tiền' },
    { key: '/partner/messages', icon: <MessageOutlined />, label: 'Nhắn tin' },
  ];

  // Nếu không phải partner thì không render giao diện để tránh "nháy" UI
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
                src={user.avatar} // Hiện avatar từ Mock Data
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
          minHeight: 280,
          overflow: 'auto'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PartnerLayout;