import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const AdminLogin = () => {
  const navigate = useNavigate();

  const admin_credentials = {
    email: 'admin@gmail.com',
    username: 'admin@gmail.com',
    password: 'admin123',
    full_name: 'Quản trị viên',
    role: 'admin',
  };

  const on_finish = (values) => {
    const { email, password } = values;

    if (email === admin_credentials.email && password === admin_credentials.password) {
      message.success(`Chào mừng ${admin_credentials.full_name} đã quay trở lại!`);
      
      localStorage.setItem('user', JSON.stringify(admin_credentials)); 
      localStorage.setItem('admin_token', 'secret-key-123');
      navigate('/'); 
    } else {
      message.error('Thông tin đăng nhập không chính xác! Vui lòng thử lại.');
    }
  };

  return (
    <div style={container_style}>
      <Card style={card_style}>
        <div style={header_style}>
          <Title level={2} style={title_style}>HOTEL BOOKING ADMIN</Title>
          <Typography.Text type="secondary">Đăng nhập bằng tài khoản admin</Typography.Text>
        </div>

        <Form 
          name="admin_auth" 
          onFinish={on_finish} 
          layout="vertical" 
          size="large"
        >
          <Form.Item 
            name="email" 
            label="Email quản trị"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="admin@gmail.com" />
          </Form.Item>

          <Form.Item 
            name="password" 
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="admin123" />
          </Form.Item>

          <Form.Item style={{ marginTop: 10 }}>
            <Button type="primary" htmlType="submit" block style={button_style}>
              VÀO HỆ THỐNG
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

// Hệ thống Style Hằng số
const container_style = { 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '100vh', 
  background: 'linear-gradient(135deg, #1890ff 0%, #001529 100%)' 
};

const card_style = { 
  width: 400, 
  borderRadius: 12, 
  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  padding: '20px'
};

const header_style = { 
  textAlign: 'center', 
  marginBottom: 30 
};

const title_style = { 
  color: '#1890ff', 
  margin: 0 
};

const button_style = { 
  height: 45, 
  fontWeight: 'bold' 
};

export default AdminLogin;