import React, { useState, useContext } from 'react';
import axiosClient from '../../services/axiosClient';
import { Form, Input, Button, Card, Typography, App as AntApp, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import { MOCK_USERS } from '../../constants/mockData.jsx'; 

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext); 
  const { message: antdMessage } = AntApp.useApp();
  const [loading, setLoading] = useState(false);

  // Lấy trang trước đó từ location state (ví dụ từ trang Chi tiết khách sạn gửi sang)
  const from = location.state?.from || null;

  const handleNavigation = (role) => {
    if (from) {
      let targetPath = from;

      // Nếu role là customer, mình sẽ lái hướng đi vào phân vùng /customer
      if (role === 'customer') {
        // Trường hợp 1: Nếu link cũ là /hotel/1 -> đổi thành /customer/hotel/1
        if (from.startsWith('/hotel')) {
          targetPath = `/customer${from}`;
        } 
        // Trường hợp 2: Nếu link cũ đã có tiền tố /guest/hotel/1 -> đổi thành /customer/hotel/1
        else if (from.startsWith('/guest')) {
          targetPath = from.replace('/guest', '/customer');
        }
      }

      console.log("Điều hướng về trang đích:", targetPath);
      navigate(targetPath, { replace: true });

    } else {
      // Luồng đăng nhập bình thường không qua nút Đặt phòng
      const dashboardMap = {
        admin: '/admin/dashboard',
        partner: '/partner/dashboard',
        customer: '/customer/home'
      };
      navigate(dashboardMap[role] || '/');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    const { account, password } = values;
    try {
      // 1. GỌI API THẬT
      const response = await axiosClient.post('/accounts/login/', {
        user_name: account.trim(),
        password: password
      });

      // Cập nhật Context
      login(response.user, { access: response.access });
      antdMessage.success(`Chào mừng ${response.user?.full_name} quay trở lại!`);
      
      // Delay 100ms để AuthContext kịp lưu vào LocalStorage và Navbar nhận diện được State mới
      setTimeout(() => handleNavigation(response.user?.role), 100);

    } catch (error) {
      console.warn("API Fail -> Switch to Mock Data");

      // 2. FALLBACK SANG MOCK DATA
      const mockUser = MOCK_USERS.find(
        (u) => (u.email === account || u.user_name === account) && u.password === password
      );

      if (mockUser) {
        login(mockUser, { access: `mock_token_${mockUser.role}` });
        antdMessage.success(`Đăng nhập thành công!`);
        
        // Delay tương tự cho Mock Data
        setTimeout(() => handleNavigation(mockUser.role), 100);
      } else {
        const errorMsg = error.response?.data?.detail || 'Tài khoản hoặc mật khẩu không chính xác!';
        antdMessage.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <Card 
        style={cardStyle} 
        styles={{ body: { padding: '32px' } }}
        variant={false}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#1890ff', margin: 0 }}>HOTEL BOOKING</Title>
          <Text type="secondary">Cung cấp dịch vụ đặt phòng tốt nhất</Text>
        </div>

        <Form 
          name="login_form" 
          onFinish={onFinish} 
          size="large" 
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="account"
            label="Tài khoản hoặc Email"
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="Email hoặc Username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="******" />
          </Form.Item>

          <Form.Item style={{ marginTop: 8 }}>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 48, borderRadius: 8, fontWeight: 'bold' }}>
              ĐĂNG NHẬP
            </Button>
          </Form.Item>

          <Divider plain><Text type="secondary" style={{ fontSize: 12 }}>BẠN MỚI BIẾT ĐẾN CHÚNG TÔI?</Text></Divider>
          
          <Button block onClick={() => navigate('/register')} style={{ borderRadius: 8, height: 40 }}>
            Đăng ký tài khoản
          </Button>
        </Form>
      </Card>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { 
  minHeight: '100vh', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  background: '#f0f2f5',
  padding: '20px' 
};

const cardStyle = { 
  maxWidth: 400, 
  width: '100%', 
  borderRadius: 16, 
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
};

export default Login;