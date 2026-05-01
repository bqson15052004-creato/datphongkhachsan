import React from 'react';
import { Form, Input, Button, Card, Typography, App as AntApp } from 'antd';
import { LockOutlined, UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();

  const onFinish = (values) => {
    const { account, password } = values;

    // Logic: Tìm user khớp với email HOẶC user_name và phải có role là admin
    const user = MOCK_USERS.find(
      (u) => 
        (u.email === account || u.user_name === account) && 
        u.password === password && 
        u.role === 'admin'
    );

    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
      message.success('Chào mừng Quản trị viên quay trở lại!');
      navigate('/admin/dashboard');
    } else {
      message.error('Tài khoản hoặc mật khẩu Admin không chính xác!');
    }
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <SafetyCertificateOutlined style={{ fontSize: 40, color: '#ff4d4f' }} />
          <Title level={3} style={{ marginTop: 12 }}>ADMIN LOGIN</Title>
          <Text type="secondary">Hệ thống quản trị</Text>
        </div>

        <Form name="admin_login" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item 
            name="account"
            label="Tài khoản hoặc Email"
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản hoặc email!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Username hoặc email admin" 
            />
          </Form.Item>

          <Form.Item 
            name="password" 
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              danger
              style={{ height: 45, fontWeight: 'bold' }}
            >
              ĐĂNG NHẬP
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" italic>Chỉ dành cho quản trị viên hệ thống</Text>
        </div>
      </Card>
    </div>
  );
};

// Styles
const containerStyle = { 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  minHeight: '100vh', 
  background: '#f0f2f5' 
};

const cardStyle = { 
  width: 400, 
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
  borderRadius: 8,
  borderTop: '5px solid #ff4d4f'
};

export default AdminLogin;