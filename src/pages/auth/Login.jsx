import React from 'react';
import axiosClient from '../../services/axiosClient';
import { Form, Input, Button, Card, Typography, App as AntApp, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const authContext = useContext(AuthContext);

  const on_finish = async (values) => {
    try {
      // 1. Gọi API đăng nhập qua axiosClient
      const response = await axiosClient.post('/accounts/login/', {
        username: values.username,
        password: values.password
      });
      // 2. Lấy dữ liệu
      const { access, refresh, user } = response;

      // 3. Lưu vào context + localStorage via AuthContext
      if (user) {
        authContext.login(user, { access, refresh });
      } else {
        // fallback: still store tokens if server returned them
        if (access) localStorage.setItem('access_token', access);
        if (refresh) localStorage.setItem('refresh_token', refresh);
      }

      // 4. Thông báo đăng nhập thành công
      message.success(`Chào mừng ${user?.full_name || user?.username || 'bạn'} quay trở lại!`);

      // 5. Điều hướng dựa trên vai trò (Role)
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user?.role === 'partner') {
        navigate('/partner/dashboard');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      const error_msg = error.response?.data?.detail || 'Tài khoản hoặc mật khẩu không chính xác!';
      message.error(error_msg);
    }
  };

  return (
    <div style={container_style}>
      <Card style={card_style}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={3} style={{ color: '#1890ff', marginBottom: '8px' }}>HOTEL BOOKING</Title>
          <Text type="secondary">Đăng nhập để quản lý dịch vụ của bạn</Text>
        </div>

        <Form 
          name="login" 
          onFinish={on_finish}
          size="large" 
          layout="vertical"
          requiredMark={false} 
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="Tài khoản / Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item style={{ marginBottom: '12px' }}>
            <Button type="primary" htmlType="submit" block style={{ fontWeight: 'bold', height: '45px' }}>
              ĐĂNG NHẬP
            </Button>
          </Form.Item>

          <Divider plain><Text type="secondary" style={{ fontSize: '12px' }}>Hoặc</Text></Divider>

          <div style={{ textAlign: 'center' }}>
            <Text>Chưa có tài khoản? </Text>
            <Button 
              type="link" 
              onClick={() => navigate('/register')} 
              style={{ padding: 0, fontWeight: 'bold' }}
            >
              Đăng ký ngay
            </Button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Text type="secondary" style={{ fontSize: '12px', cursor: 'pointer' }}>
              Quên mật khẩu?
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

// Sửa tên các biến Style bọc ngoài
const container_style = { 
  minHeight: '100vh', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  backgroundColor: '#f8fafc' 
};

const card_style = { 
  maxWidth: 400, 
  width: '100%', 
  borderRadius: '16px', 
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  padding: '10px'
};

export default Login;