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


  const handleNavigation = (account) => {
    antdMessage.success(`Chào mừng ${account.full_name} quay trở lại!`);
    setCookie("user",account);
    navigate("/")
    
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