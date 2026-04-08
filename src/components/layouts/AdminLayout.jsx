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
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import axiosClient from '../../services/axiosClient'; // Mở ra khi kết nối BE thật

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

  // 1. LẤY THÔNG TIN USER (Đồng bộ với key 'user' từ Login.jsx)
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  // 2. KIỂM TRA QUYỀN TRUY CẬP NHANH
  useEffect(() => {
    // Nếu không có user hoặc role không phải admin thì đá ra ngoài trang chủ
    if (!user || user.role !== 'admin') {
      message.error('Bạn không có quyền truy cập vùng này!');
      navigate('/');
    }
  }, [user, navigate, message]);

  // 3. LOGIC ĐẾM SỐ LƯỢNG CHỜ DUYỆT
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        /* KẾT NỐI BE THẬT */
        // const res = await axiosClient.get('/admin/hotels/pending-count/');
        // set_pending_count(res.count);

        /* LOGIC MOCK DATA */
        const all_hotels = JSON.parse(localStorage.getItem('all_hotels')) || [];
        const count = all_hotels.filter(h => h.status === 'pending').length;
        set_pending_count(count);
      } catch (error) {
        console.error("Lỗi cập nhật số lượng chờ duyệt:", error);
      }
    };
    fetchPendingCount();
  }, []);

  // Giả lập level cho Mock User (Nếu user chưa có level thì mặc định là 1 - Sếp)
  const userLevel = user?.level || 1;

  // 4. CẤU HÌNH MENU NỘI BỘ
  const menu_config = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
    {
      key: '/admin/revenues',
      icon: <BarChartOutlined />,
      label: 'Báo cáo doanh thu',
      level_required: 1 // Chỉ level 1 (Sếp) mới thấy
    },
    {
      key: '/admin/partners',
      icon: <SolutionOutlined />,
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Phê duyệt khách sạn đối tác</span>
          {pending_count > 0 && <Badge count={pending_count} size="small" offset={[10, 0]} />}
        </div>
      )
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Quản lý người dùng',
      level_required: 1
    },
    { key: '/admin/categories', icon: <AppstoreOutlined />, label: 'Quản lý loại khách sạn' },
    { key: '/admin/reports', icon: <FileTextOutlined />, label: 'Quản lý báo cáo' },
    {
      key: '/admin/discounts',
      icon: <PercentageOutlined />,
      label: 'Quản lý chiết khấu',
      level_required: 1
    },
  ];

  // Lọc menu theo level (số càng nhỏ quyền càng cao)
  const side_menu_items = menu_config.filter(item => 
    !item.level_required || userLevel <= item.level_required
  );

  const user_menu_items = [
    { key: 'profile', label: 'Hồ sơ cá nhân', icon: <ProfileOutlined />, onClick: () => navigate('/profile') },
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
          async onOk() {
            /* --- GỌI API LOGOUT BE --- */
            // try { await axiosClient.post('/accounts/logout/'); } catch(e) {}

            localStorage.removeItem('user');
            localStorage.removeItem('role');
            localStorage.removeItem('token');
            message.success('Đã đăng xuất!');
            navigate('/');
          },
        });
      },
    },
  ];

  // Chặn render nếu không phải admin để tránh lộ UI trước khi chuyển hướng
  if (!user || user.role !== 'admin') return null;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={250}>
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

      <Layout>
        <Header style={{ padding: '0 24px 0 0', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

        <Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;