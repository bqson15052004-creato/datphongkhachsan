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
  FileTextOutlined,
  PercentageOutlined,
  WarningOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { confirm } = Modal;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntApp.useApp();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 1. Lấy thông tin user từ localStorage (bao gồm isRoot)
  const user = JSON.parse(localStorage.getItem('user')) || { 
    fullName: 'Quản trị viên', 
    role: 'admin', 
    isRoot: false 
  };

  // 2. Logic tự động đếm số lượng "Đang chờ"
  useEffect(() => {
    const updateCount = () => {
      const allHotels = JSON.parse(localStorage.getItem('all_hotels')) || [];
      const count = allHotels.filter(h => h.status === 'Đang chờ').length;
      setPendingCount(count);
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, []);

  // 3. MENU NGƯỜI DÙNG
  const userMenuItems = [
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
      onClick: () => {
        confirm({
          title: 'Xác nhận đăng xuất',
          icon: <ExclamationCircleFilled />,
          content: 'Bạn có chắc chắn muốn thoát khỏi hệ thống quản trị?',
          okText: 'Đăng xuất',
          okType: 'danger',
          onOk() {
            localStorage.removeItem('user');
            message.success('Đã đăng xuất thành công!');
            navigate('/');
          },
        });
      },
    },
  ];

  // 4. DANH SÁCH MENU TỔNG (Có đánh dấu isRootOnly cho Admin Cấp 1)
  const menuConfig = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { 
      key: '/admin/revenues', 
      icon: <BarChartOutlined />, 
      label: 'Báo cáo doanh thu', 
      isRootOnly: true // Chỉ Admin Cấp 1 thấy
    },
    { 
      key: '/admin/partners', 
      icon: <SolutionOutlined />, 
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Phê duyệt đối tác</span>
          {pendingCount > 0 && (
            <Badge 
              count={pendingCount} 
              size="small" 
              style={{ backgroundColor: '#f5222d' }} 
            />
          )}
        </div>
      ) 
    },
    { 
      key: '/admin/users', 
      icon: <UserOutlined />, 
      label: 'Quản lý người dùng', 
      isRootOnly: true // Chỉ Admin Cấp 1 thấy
    },
    { key: '/admin/categories', icon: <AppstoreOutlined />, label: 'Quản lý danh mục' },
    { key: '/admin/reports', icon: <FileTextOutlined />, label: 'Quản lý báo cáo' },
    { 
      key: '/admin/discounts', 
      icon: <PercentageOutlined />, 
      label: 'Quản lý chiết khấu', 
      isRootOnly: true // Chỉ Admin Cấp 1 thấy
    },
    { key: '/admin/complaints', icon: <WarningOutlined />, label: 'Quản lý khiếu nại' },
  ];

  // Lọc menu dựa trên quyền
  const sideMenuItems = menuConfig.filter(item => !item.isRootOnly || user.isRoot);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        width={250}
        style={{ boxShadow: '2px 0 8px 0 rgba(0,0,0,0.15)' }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#002140',
          lineHeight: '1.2'
        }}>
          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: collapsed ? 14 : 18 }}>
            {collapsed ? 'AD' : 'HOTEL ADMIN'}
          </div>
          {!collapsed && (
            <div style={{ color: user.isRoot ? '#ffbb96' : '#91d5ff', fontSize: 10 }}>
              {user.isRoot ? 'HỆ THỐNG TỐI CAO' : 'QUẢN TRỊ VIÊN'}
            </div>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={sideMenuItems}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          padding: '0 24px 0 0', 
          background: colorBgContainer, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '0 16px' }}>
              <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                <Text strong style={{ display: 'block' }}>{user.fullName}</Text>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  {user.isRoot ? 'Admin Cấp 1' : 'Admin Cấp 2'}
                </Text>
              </div>
              <Avatar 
                style={{ backgroundColor: user.isRoot ? '#f5222d' : '#1890ff' }} 
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
          minHeight: 280 
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;