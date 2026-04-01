import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme, Avatar, Dropdown, App as AntApp, Modal, Typography, Badge, Space } from 'antd';
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
import axiosClient from '../../services/axiosClient';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { confirm } = Modal;

const AdminLayout = () => {
  const [is_collapsed, set_is_collapsed] = useState(false);
  const [pending_count, set_pending_count] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntApp.useApp();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 1. Lấy thông tin admin_data từ localStorage
  const admin_data = JSON.parse(localStorage.getItem('admin_data')) || { 
    full_name: 'Quản trị viên', 
    role: 'admin', 
    is_root: false 
  };

  // 2. Logic cập nhật số lượng đối tác đang chờ phê duyệt từ API
  const fetch_pending_count = async () => {
    try {
      const response = await axios_client.get('/admin/partners/pending-count');
      set_pending_count(response.data.count);
    } catch (error) {
      console.error("Không thể lấy số lượng chờ duyệt");
    }
  };

  useEffect(() => {
    fetch_pending_count();
    // Thiết lập interval để cập nhật badge sau mỗi 5 phút nếu cần
    const interval = setInterval(fetch_pending_count, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. MENU NGƯỜI DÙNG
  const user_menu_items = [
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: <ProfileOutlined />,
      onClick: () => navigate('/admin/profile'),
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
            localStorage.removeItem('admin_data');
            localStorage.removeItem('access_token');
            message.success('Đã đăng xuất thành công!');
            navigate('/login');
          },
        });
      },
    },
  ];

  // 4. CẤU HÌNH MENU (Lọc dựa trên quyền is_root)
  const menu_config = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { 
      key: '/admin/revenues', 
      icon: <BarChartOutlined />, 
      label: 'Báo cáo doanh thu', 
      is_root_only: true 
    },
    { 
      key: '/admin/partners', 
      icon: <SolutionOutlined />, 
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Phê duyệt đối tác</span>
          {pending_count > 0 && (
            <Badge count={pending_count} size="small" style={{ backgroundColor: '#f5222d' }} />
          )}
        </div>
      ) 
    },
    { 
      key: '/admin/users', 
      icon: <UserOutlined />, 
      label: 'Quản lý người dùng', 
      is_root_only: true 
    },
    { key: '/admin/categories', icon: <AppstoreOutlined />, label: 'Quản lý danh mục' },
    { key: '/admin/reports', icon: <FileTextOutlined />, label: 'Quản lý báo cáo' },
    { 
      key: '/admin/discounts', 
      icon: <PercentageOutlined />, 
      label: 'Quản lý chiết khấu', 
      is_root_only: true 
    },
    { key: '/admin/complaints', icon: <WarningOutlined />, label: 'Quản lý khiếu nại' },
  ];

  const side_menu_items = menu_config.filter(item => !item.is_root_only || admin_data.is_root);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={is_collapsed}
        theme="dark"
        width={260}
        style={{ boxShadow: '2px 0 8px 0 rgba(0,0,0,0.15)' }}
      >
        <div style={logo_container_style}>
          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: is_collapsed ? 14 : 18 }}>
            {is_collapsed ? 'AD' : 'HOTEL ADMIN'}
          </div>
          {!is_collapsed && (
            <div style={{ color: admin_data.is_root ? '#ffbb96' : '#91d5ff', fontSize: 10, marginTop: 4 }}>
              {admin_data.is_root ? 'HỆ THỐNG TỐI CAO' : 'QUẢN TRỊ VIÊN'}
            </div>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={side_menu_items}
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
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <Button
            type="text"
            icon={is_collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => set_is_collapsed(!is_collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <Dropdown menu={{ items: user_menu_items }} placement="bottomRight" arrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '0 16px' }}>
              <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                <Text strong style={{ display: 'block' }}>{admin_data.full_name}</Text>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  {admin_data.is_root ? 'Admin Cấp 1' : 'Admin Cấp 2'}
                </Text>
              </div>
              <Avatar 
                src={admin_data.avatar_url}
                style={{ backgroundColor: admin_data.is_root ? '#f5222d' : '#1890ff' }} 
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
          overflow: 'initial'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

// HỆ THỐNG STYLE CONSTANTS
const logo_container_style = { 
  height: 64, 
  display: 'flex', 
  flexDirection: 'column',
  alignItems: 'center', 
  justifyContent: 'center',
  background: '#002140',
  lineHeight: '1.2'
};

export default AdminLayout;