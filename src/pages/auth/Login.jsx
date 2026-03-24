import React from 'react';
import { Form, Input, Button, Card, Typography, App as AntApp } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  
  const { message } = AntApp.useApp(); 
  const onFinish = (values) => {
    const DEFAULT_ADMIN = {
      email: 'admin@gmail.com',
      password: 'admin123',
      fullName: 'Quản trị viên Hệ thống',
      role: 'admin'
    };

    // Kiểm tra Admin mặc định
    if (values.username === DEFAULT_ADMIN.email && values.password === DEFAULT_ADMIN.password) {
      localStorage.setItem('user', JSON.stringify(DEFAULT_ADMIN));
      message.success('Chào mừng Admin quay trở lại!');
      navigate('/admin/dashboard');
      return;
    }

    // Lấy danh sách users từ localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Tìm user khớp tài khoản và mật khẩu
    const foundUser = users.find(u => 
      (u.email === values.username || u.username === values.username) && 
      u.password === values.password
    );

    if (foundUser) {
      localStorage.setItem('user', JSON.stringify(foundUser));
      message.success(`Chào mừng ${foundUser.fullName} quay trở lại!`);
      
      // Điều hướng theo Role
      switch (foundUser.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'partner':
          navigate('/partner/dashboard');
          break;
        default:
          navigate('/');
          break;
      }
    } else {
      message.error('Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
      <Card style={{ maxWidth: 400, width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={3} style={{ color: '#1890ff' }}>HOTEL BOOKING</Title>
          <Text type="secondary">Đăng nhập để tiếp tục</Text>
        </div>

        <Form name="login" onFinish={onFinish} size="large" layout="vertical">
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Nhập tài khoản hoặc email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tài khoản / Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ fontWeight: 'bold' }}>
              ĐĂNG NHẬP
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Bạn chưa có tài khoản? </Text>
            <Button type="link" onClick={() => navigate('/register')} style={{ padding: 0, fontWeight: 'bold' }}>Đăng ký ngay</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;