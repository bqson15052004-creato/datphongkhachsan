import React from 'react';
import axiosClient from '../../services/axiosClient';
import { Form, Input, Button, Card, Typography, App as AntApp } from 'antd'; 
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, BorderOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const RegisterForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { message } = AntApp.useApp(); 
  const role = searchParams.get('role'); 

  const onFinish = async (values) => {
    // 1. Xác định Role: mặc định là customer, trừ khi link có ?role=partner
    const finalRole = role === 'partner' ? 'partner' : 'customer';

    try {
      // 2. Gửi dữ liệu - Đã cập nhật đường dẫn thành /accounts/register/
      const response = await axiosClient.post('/accounts/register/', {
        username: values.username,
        email: values.email,
        password: values.password,
        phone: values.phone,
        full_name: values.fullName,
        role: finalRole
      });

      if (response) {
        message.success(`Đăng ký thành công với vai trò ${finalRole === 'partner' ? 'Đối tác' : 'Khách hàng'}!`);
        navigate('/login');
      }

    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        if (typeof errorData === 'object') {
          const firstErrorKey = Object.keys(errorData)[0];
          const firstErrorMessage = Object.values(errorData)[0];
          message.error(`${firstErrorKey}: ${firstErrorMessage}`);
        } else {
          message.error('Đăng ký thất bại, vui lòng kiểm tra lại thông tin!');
        }
      } else {
        message.error('Không thể kết nối đến máy chủ!');
      }
    }
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={3} style={{ color: '#1890ff', marginBottom: '8px' }}>Đăng ký tài khoản</Title>
          <Text type="secondary">
            Đăng ký tư cách: <b style={{ color: role === 'partner' ? '#52c41a' : '#1890ff' }}>
              {role === 'partner' ? 'Đối tác' : 'Khách hàng'}
            </b>
          </Text>
        </div>

        <Form name="register" onFinish={onFinish} layout="vertical" size="large">
          
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Vui lòng nhập tài khoản!' },
              { min: 4, message: 'Tài khoản phải có ít nhất 4 ký tự!' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Tài khoản không chứa ký tự đặc biệt!' }
            ]}
          >
            <Input prefix={<BorderOutlined />} placeholder="Tài khoản đăng nhập" />
          </Form.Item>

          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            normalize={(value) => {
              if (!value) return value;
              return value
                .trim()
                .toLowerCase()
                .split(' ')
                .filter(word => word !== '') 
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            }}
          >
            <Input prefix={<UserOutlined />} placeholder="Họ và tên đầy đủ" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' },
              { type: 'email', message: 'Email không đúng định dạng!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Địa chỉ Email" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại liên hệ" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận lại mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ fontWeight: 'bold', height: '45px' }}>
              ĐĂNG KÝ NGAY
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Đã có tài khoản? </Text>
            <Button type="link" onClick={() => navigate('/login')} style={{ padding: 0, fontWeight: 'bold' }}>
              Đăng nhập ngay
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

const containerStyle = { 
  minHeight: '100vh', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  backgroundColor: '#f8fafc',
  padding: '40px 20px'
};

const cardStyle = { 
  maxWidth: 450, 
  width: '100%', 
  borderRadius: '16px', 
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  border: 'none'
};

export default RegisterForm;