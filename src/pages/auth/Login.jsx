import React, { useState, useContext } from 'react';
import axiosClient from '../../services/axiosClient';
import { Form, Input, Button, Card, Typography, App as AntApp, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import AuthContext from '../../contexts/AuthContext';
import { MOCK_USERS } from '../../constants/mockData.jsx'; 

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Khởi tạo location để lấy state từ HotelDetail gửi sang
  const { login } = useContext(AuthContext); 
  const { message } = AntApp.useApp();
  const [loading, setLoading] = useState(false);

  // Cập nhật hàm điều hướng thông minh
  const handleNavigation = (role) => {
    // Lấy đường dẫn cũ từ state (nếu có), ví dụ: "/hotel/1"
    const prevPath = location.state?.from;

    if (prevPath) {
      // Nếu có trang cũ đang xem dở, quay lại đó ngay
      navigate(prevPath, { replace: true });
    } else {
      // Nếu không có (đăng nhập chủ động), thì phân quyền như cũ
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'partner') navigate('/partner/dashboard');
      else navigate('/'); 
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    const { account, password } = values;
    try {
      const response = await axiosClient.post('/accounts/login/', {
        user_name: account.trim(),
        password: password
      });

      login(response.user, { access: response.access });
      message.success(`Chào mừng ${response.user?.full_name} quay trở lại!`);
      handleNavigation(response.user?.role);

    } catch (error) {
      console.warn("Đăng nhập BE thất bại, đang check Mock Data...");

      const mockUser = MOCK_USERS.find(
        (u) => (u.email === account || u.user_name === account) && u.password === password
      );

      if (mockUser) {
        login(mockUser, { access: `mock_token_${mockUser.role}` });
        message.success(`[Mock] Đăng nhập thành công với quyền ${mockUser.role}`);
        handleNavigation(mockUser.role);
      } else {
        const errorMsg = error.response?.data?.detail || 'Tài khoản hoặc mật khẩu không chính xác!';
        message.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle} variant="none">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#1890ff', margin: '8px 0 0 0' }}>HOTEL BOOKING</Title>
          <Text type="secondary">Đăng nhập để đặt phòng ngay</Text>
        </div>

        <Form name="login_form" onFinish={onFinish} size="large" layout="vertical">
          <Form.Item
            name="account"
            label={<Text strong>Tài khoản hoặc Email</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản hoặc email!' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="Username hoặc email của bạn" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text strong>Mật khẩu</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="******" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ height: '48px', fontWeight: 'bold' }}>
              ĐĂNG NHẬP
            </Button>
          </Form.Item>

          <Divider plain><Text type="secondary">Bạn chưa có tài khoản?</Text></Divider>
          <Button block onClick={() => navigate('/register')} style={{ borderRadius: '8px' }}>
            Đăng ký thành viên
          </Button>
        </Form>
      </Card>
    </div>
  );
};

const containerStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '20px' };
const cardStyle = { maxWidth: 420, width: '100%', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', padding: '12px' };

export default Login;