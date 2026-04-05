import React, { useState } from 'react';
import axiosClient from '../../services/axiosClient';
import { Form, Input, Button, Card, Typography, App as AntApp, Divider, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

const MOCK_USERS = [
  {
    id: 1,
    full_name: "Admin",
    email: "admin@gmail.com",
    password: "123",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
  },
  {
    id: 2,
    full_name: "Chủ Khách Sạn 1",
    email: "partner@gmail.com",
    password: "123",
    role: "partner",
    hotel_name: "Sơn Villa & Resort",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Partner"
  },
  {
    id: 3,
    full_name: "Khách Hàng 1",
    email: "user@gmail.com",
    password: "123",
    role: "customer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Customer"
  }
];

const Login = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const { user_name, password } = values;

    try {
      // 1. THỬ ĐĂNG NHẬP THẬT (Khi có Backend)
      const response = await axiosClient.post('/accounts/login/', {
        user_name: user_name.trim(),
        password: password
      });

      const { access, user } = response;
      localStorage.setItem('access_token', access);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user?.role || 'customer');

      message.success(`Chào mừng ${user?.full_name} quay trở lại!`);
      handleNavigation(user?.role);

    } catch (error) {
      console.warn("Đang kiểm tra Mock Data do lỗi kết nối hoặc sai tài khoản...");

      // 2. KẾ HOẠCH DỰ PHÒNG: Kiểm tra Mock Users
      const mockUser = MOCK_USERS.find(
        (u) => u.email === user_name && u.password === password
      );

      if (mockUser) {
        localStorage.setItem('access_token', `mock_token_${mockUser.role}`);
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('role', mockUser.role);

        message.success(`[Mock] Đăng nhập thành công với quyền ${mockUser.role}`);
        
        setTimeout(() => {
          handleNavigation(mockUser.role);
        }, 1000);
      } else {
        const errorMsg = error.response?.data?.detail || 'Tài khoản hoặc mật khẩu không chính xác!';
        message.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm điều hướng dùng chung
  const handleNavigation = (role) => {
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'partner') navigate('/partner/dashboard');
    else navigate('/');
  };

  return (
    <div style={containerStyle}>
      <Card 
        style={cardStyle} 
        variant="none"
        hoverable={false}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#1890ff', margin: '8px 0 0 0' }}>HOTEL BOOKING</Title>
          <Text type="secondary">Hệ thống đặt phòng khách sạn thông minh</Text>
        </div>

        <Form
          name="login_form"
          onFinish={onFinish}
          size="large"
          layout="vertical"
          requiredMark={false}
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="user_name"
            label={<Text strong>Tài khoản</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="admin@gmail.com / partner@gmail.com" 
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text strong>Mật khẩu</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="123" 
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <Link href="/forgot-password" style={{ fontSize: '14px' }}>Quên mật khẩu?</Link>
          </div>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              style={{ 
                fontWeight: 'bold', 
                height: '48px', 
                borderRadius: '8px',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
              }}
            >
              ĐĂNG NHẬP
            </Button>
          </Form.Item>

          <Divider plain>
            <Text type="secondary" style={{ fontSize: '13px' }}>Bạn chưa có tài khoản?</Text>
          </Divider>

          <div style={{ textAlign: 'center' }}>
            <Button
              type="default"
              block
              onClick={() => navigate('/register')}
              style={{ 
                height: '40px', 
                borderRadius: '8px',
                color: '#595959'
              }}
            >
              Đăng ký ngay
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

// Styles
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: '20px'
};

const cardStyle = {
  maxWidth: 420,
  width: '100%',
  borderRadius: '20px',
  boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
  padding: '12px'
};

export default Login;