import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Avatar, Dropdown, App as AntApp, Modal, Typography } from 'antd';
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
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntApp.useApp();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Lấy thông tin Admin từ localStorage
  const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Quản trị viên' };

  // Cấu hình Menu cho Dropdown Avatar
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
      onClick: () => {
        confirm({
          title: 'Xác nhận đăng xuất',
          icon: <ExclamationCircleFilled />, // Đã sửa lỗi không hiển thị icon
          content: 'Bạn có chắc chắn muốn thoát khỏi hệ thống quản trị?',
          okText: 'Đăng xuất',
          okType: 'danger',
          cancelText: 'Hủy',
          onOk() {
            localStorage.removeItem('user');
            message.success('Đã đăng xuất thành công!');
            navigate('/admin/login');
          },
        });
      },
    },
  ];

  // Danh sách Menu khớp 100% với Use Case của ông
  const sideMenuItems = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: '/admin/revenues', icon: <BarChartOutlined />, label: 'Báo cáo doanh thu' },
    { key: '/admin/partners', icon: <SolutionOutlined />, label: 'Phê duyệt đối tác' },
    { key: '/admin/users', icon: <UserOutlined />, label: 'Quản lý người dùng' },
    { key: '/admin/categories', icon: <AppstoreOutlined />, label: 'Quản lý danh mục' },
    { key: '/admin/reports', icon: <FileTextOutlined />, label: 'Quản lý báo cáo' },
    { key: '/admin/discounts', icon: <PercentageOutlined />, label: 'Quản lý chiết khấu' },
    { key: '/admin/complaints', icon: <WarningOutlined />, label: 'Quản lý khiếu nại' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark" // Giữ tông màu tối đồng bộ
        width={250}
        style={{ boxShadow: '2px 0 8px 0 rgba(0,0,0,0.15)' }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: collapsed ? 14 : 18,
          fontWeight: 'bold',
          color: '#fff',
          background: '#002140' 
        }}>
          {collapsed ? 'AD' : 'HOTEL ADMIN'}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '0 12px' }}>
              <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
              <Text strong>{user.fullName}</Text>
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