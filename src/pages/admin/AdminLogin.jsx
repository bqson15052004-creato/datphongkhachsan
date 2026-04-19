import React from 'react';
import { Form, Input, Button, Card, Typography, App as AntApp } from 'antd';
import { LockOutlined, UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../../constants/mockData';

const { Title, Text } = Typography;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();

  const onFinish = (values) => {
    // Tìm user trong Mock Data có role là admin
    const user = MOCK_USERS.find(
      (u) => u.email === values.email && u.password === values.password && u.role === 'admin'
    );

    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
      message.success('Chào mừng Quản trị viên quay trở lại!');
      navigate('/admin/dashboard');
    } else {
      message.error('Tài khoản Admin không chính xác hoặc bạn không có quyền truy cập!');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: 8 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <SafetyCertificateOutlined style={{ fontSize: 40, color: '#ff4d4f' }} />
          <Title level={3} style={{ marginTop: 12 }}>ADMIN PORTAL</Title>
          <Text type="secondary">Vui lòng đăng nhập để quản lý hệ thống</Text>
        </div>

        <Form name="admin_login" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Email quản trị" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block danger style={{ height: 45, fontWeight: 'bold' }}>
              ĐĂNG NHẬP ADMIN
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;