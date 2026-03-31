import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Checkout = () => {
  const { user, logout } = useContext(AuthContext); // Lấy user từ kho chung
  const navigate = useNavigate();

  // Menu dùng hàm logout từ Context
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<SolutionOutlined />}>Hồ sơ của {user?.name}</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger onClick={logout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', padding: '0 50px' }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#1890ff', fontWeight: 'bold' }}>
          🏠 HOTEL BOOKING
        </div>
        
        {/* Nếu có user thì hiện Avatar, không thì hiện nút Đăng nhập */}
        {user ? (
          <Dropdown overlay={userMenu}>
            <Space style={{ cursor: 'pointer' }}>
              <Text strong>{user.name}</Text>
              <Avatar src={user.avatar} icon={<UserOutlined />} />
            </Space>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => navigate('/login')}>Đăng nhập</Button>
        )}
      </Header>
    </Layout>
  );
};