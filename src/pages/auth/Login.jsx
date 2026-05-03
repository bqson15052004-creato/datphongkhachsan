import React, { useState, useContext } from 'react';
import axiosClient from '../../services/axiosClient';
import { Form, Input, Button, Card, Typography, App as AntApp, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import { MOCK_USERS } from '../../constants/mockData.jsx'; 
import { useCookies } from "react-cookie"

import { AuthApiClient } from '../../services/apiClient.jsx';
const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext); 
  const { message: antdMessage } = AntApp.useApp();
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies();

  // Lấy trang trước đó từ location state (ví dụ từ trang Chi tiết khách sạn gửi sang)
  // const from = location.state?.from || null;

  const handleNavigation = (account) => {
    antdMessage.success(`Chào mừng ${account.full_name} quay trở lại!`);
    setCookie("user",account);
    navigate("/")
    // if (from) {
    //   let targetPath = from;

    //   // Nếu role là customer, mình sẽ lái hướng đi vào phân vùng /customer
    //   if (account.role === 'Khách hàng') {
    //     // Trường hợp 1: Nếu link cũ là /hotel/1 -> đổi thành /customer/hotel/1
    //     if (from.startsWith('/hotel')) {
    //       targetPath = `/customer${from}`;
    //     } 
    //     // Trường hợp 2: Nếu link cũ đã có tiền tố /guest/hotel/1 -> đổi thành /customer/hotel/1
    //     else if (from.startsWith('/guest')) {
    //       targetPath = from.replace('/guest', '/customer');
    //     }
    //   }

    //   console.log("Điều hướng về trang đích:", targetPath);
    //   navigate(targetPath, { replace: true });

    // } else {
    //   // Luồng đăng nhập bình thường không qua nút Đặt phòng
    //   const dashboardMap = {
    //     admin: '/admin/dashboard',
    //     partner: '/partner/dashboard',
    //     customer: '/customer/home'
    //   };
    //   navigate(dashboardMap[account.role] || '/');
    // }
  };

  const onFinish = async (values) => {
    setLoading(true);
    const { email, password } = values;
    // 1. GỌI API THẬT
      const response = await AuthApiClient.login({ email, password });
      console.log(response);
      if(response.status >= 400){
        setLoading(false);
        return antdMessage.error(response.message);
      }
      antdMessage.success(`Đăng nhập thành công!`);

      // Delay 100ms để AuthContext kịp lưu vào LocalStorage và Navbar nhận diện được State mới
      setTimeout(() => handleNavigation(response.account), 1000);
      setLoading(false);
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
            name="email"
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