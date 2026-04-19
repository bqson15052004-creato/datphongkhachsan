import React from 'react';
import { Form, Input, Button, Card, Typography, App as AntApp } from 'antd';
import { LockOutlined, MailOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../../constants/mockData';

const { Title, Text } = Typography;

const PartnerLogin = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();

  const onFinish = (values) => {
    // Tìm user trong Mock Data có role là partner
    const user = MOCK_USERS.find(
      (u) => u.email === values.email && u.password === values.password && u.role === 'partner'
    );

    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
      message.success('Đăng nhập Kênh Đối Tác thành công!');
      navigate('/partner/dashboard');
    } else {
      message.error('Tài khoản Đối Tác không chính xác!');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#e6f7ff' }}>
      <Card style={{ width: 420, borderTop: '4px solid #1890ff', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <ShopOutlined style={{ fontSize: 40, color: '#1890ff' }} />
          <Title level={3} style={{ marginTop: 12, color: '#1890ff' }}>PARTNER HUB</Title>
          <Text strong>Dành cho các cơ sở lưu trú</Text>
        </div>

        <Form name="partner_login" onFinish={onFinish} layout="vertical">
          <Form.Item name="email" label="Email đối tác" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="partner@hotel.com" />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="******" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              ĐĂNG NHẬP KÊNH ĐỐI TÁC
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">Bạn muốn trở thành đối tác? </Text>
          <Button type="link" style={{ padding: 0 }}>Đăng ký ngay</Button>
        </div>
      </Card>
    </div>
  );
};

export default PartnerLogin;