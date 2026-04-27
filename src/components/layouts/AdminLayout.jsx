import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme, Avatar, Dropdown, App as AntApp, Modal, Typography, Badge } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
  BarChartOutlined,
  SolutionOutlined,
  AppstoreOutlined,
  PercentageOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { confirm } = Modal;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [pending_count, set_pending_count] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntApp.useApp();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userData = sessionStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      message.error('Bạn không có quyền truy cập vùng này!');
      navigate('/');
    }
  }, [user, navigate, message]);

  const fetchPendingCount = () => {
    try {
      const all_hotels = JSON.parse(localStorage.getItem('ALL_HOTELS')) || [];
      const count = all_hotels.filter(h => h.status === 'pending').length;
      set_pending_count(count);
    } catch (error) {
      console.error("Lỗi cập nhật số lượng chờ duyệt:", error);
    }
  };

  useEffect(() => {
    fetchPendingCount();
    window.addEventListener('storage', fetchPendingCount);
    const interval = setInterval(fetchPendingCount, 3000);
    return () => {
      window.removeEventListener('storage', fetchPendingCount);
      clearInterval(interval);
    };
  }, []);

  const userLevel = user?.level || 1;

  const menu_config = [
    { key: '/admin/dashboard',   icon: <DashboardOutlined />,   label: 'Tổng quan' },
    { key: '/admin/profile',     icon: <ProfileOutlined />,     label: 'Hồ sơ cá nhân' },
    { key: '/admin/revenues',    icon: <BarChartOutlined />,    label: 'Báo cáo doanh thu',  level_required: 1 },
    { 
      key: '/admin/partners',   
      icon: (
        <Badge dot={pending_count > 0} offset={[5, 0]}>
          <SolutionOutlined />
        </Badge>
      ),   
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Phê duyệt khách sạn</span>
          {pending_count > 0 && !collapsed && (
            <Badge 
              count={pending_count} 
              size="small" 
              style={{ backgroundColor: '#f5222d', boxShadow: 'none' }} 
            />
          )}
        </div>
      ) 
    },
    { key: '/admin/users',       icon: <UserOutlined />,       label: 'Quản lý người dùng', level_required: 1 },
    { key: '/admin/categories', icon: <AppstoreOutlined />,   label: 'Loại khách sạn' },
    { key: '/admin/amenities',  icon: <CoffeeOutlined />,     label: 'Quản lý tiện nghi' },
  ];

  const side_menu_items = menu_config.filter(item => 
    !item.level_required || userLevel <= item.level_required
  );

  const user_menu_items = [
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        confirm({
          title: 'Xác nhận đăng xuất',
          content: 'Thoát khỏi hệ thống quản trị?',
          onOk() {
            sessionStorage.clear();
            message.success('Đã đăng xuất thành công!');
            window.location.href = '/'; 
          },
        });
      },
    },
  ];

  if (!user || user.role !== 'admin') return null;

  return (
    // 1. Khóa chiều cao toàn trang ở 100vh và ẩn scrollbar tổng
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      
      {/* Sidebar giờ sẽ tự động chiếm 100% chiều cao của cha */}
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={260}>
        <div style={{ height: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#002140' }}>
          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: collapsed ? 14 : 18 }}>
            {collapsed ? 'AD' : 'HOTEL ADMIN'}
          </div>
          {!collapsed && (
            <div style={{ color: userLevel === 1 ? '#ffbb96' : '#91d5ff', fontSize: 10 }}>
              {userLevel === 1 ? 'ADMIN CẤP 1 (SẾP)' : 'ADMIN CẤP 2 (NV)'}
            </div>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={side_menu_items}
        />
      </Sider>

      <Layout style={{ height: '100vh' }}>
        <Header style={{ padding: '0 24px 0 0', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1, boxShadow: '0 2px 8px #f0f1f2' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ width: 64, height: 64 }}
          />
          
          <Dropdown menu={{ items: user_menu_items }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '0 16px' }}>
              <div style={{ textAlign: 'right' }}>
                <Text strong style={{ display: 'block' }}>{user.full_name}</Text>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  Cấp độ: {userLevel}
                </Text>
              </div>
              <Avatar 
                style={{ backgroundColor: userLevel === 1 ? '#f5222d' : '#1890ff' }} 
                src={user.avatar} 
                icon={<UserOutlined />} 
              />
            </div>
          </Dropdown>
        </Header>

        {/* 2. Điều chỉnh nội dung chính */}
        <Content 
          style={{ 
            margin: '24px 16px', 
            padding: 24, 
            background: colorBgContainer, 
            borderRadius: borderRadiusLG,
            overflowY: 'auto',
            flex: 1
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;