import React from 'react';
import { Form, Input, Button, Card, Typography, App as AntApp } from 'antd';
import { LockOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { MOCK_USERS } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;

const PartnerLogin = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();

  const onFinish = (values) => {
    const { account, password } = values;

    const user = MOCK_USERS.find(
      (u) => 
        (u.email === account || u.user_name === account) && 
        u.password === password && 
        u.role === 'partner'
    );

    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
      message.success('Đăng nhập Kênh Đối Tác thành công!');
      navigate('/partner/dashboard');
    } else {
      message.error('Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <ShopOutlined style={{ fontSize: 40, color: '#52c41a' }} />
          <Title level={3} style={{ marginTop: 12, color: '#52c41a' }}>PARTNER LOGIN</Title>
          <Text strong>Quản lý cơ sở lưu trú</Text>
        </div>

        <Form name="partner_login" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item 
            name="account" 
            label="Tài khoản hoặc Email" 
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản hoặc email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username hoặc email đối tác" />
          </Form.Item>

          <Form.Item 
            name="password" 
            label="Mật khẩu" 
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="******" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
              ĐĂNG NHẬP
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">Bạn muốn trở thành đối tác? </Text>
          <Link to="/partner/register" style={{ fontWeight: 'bold', color: '#52c41a' }}>Đăng ký ngay</Link>
        </div>
      </Card>
    </div>
  );
};

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f6ffed' };
const cardStyle = { width: 420, borderTop: '4px solid #52c41a', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };

export default PartnerLogin;