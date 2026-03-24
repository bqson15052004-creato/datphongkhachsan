import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, BorderOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const RegisterForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role'); // Lấy role từ URL (partner hoặc customer)

  const onFinish = (values) => {
    // 1. Lấy danh sách tài khoản hiện có từ localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    // 2. Kiểm tra trùng lặp Email hoặc Username
    const isExist = existingUsers.some(u => u.email === values.email || u.username === values.username);
    if (isExist) {
      message.error('Email hoặc Tài khoản đã được đăng ký!');
      return;
    }

    // 3. Xử lý logic gán Role chuẩn
    let finalRole = 'customer'; // Mặc định là khách hàng
    if (values.email === 'admin@gmail.com') {
      finalRole = 'admin';
    } else if (role === 'partner') {
      finalRole = 'partner';
    }

    // 4. Tạo đối tượng user mới (Bỏ trường confirm để dữ liệu sạch)
    const { confirm, ...userData } = values; 
    const newUser = {
      ...userData,
      role: finalRole,
      createdAt: new Date().toISOString()
    };

    // 5. Lưu vào mảng và đẩy ngược lên LocalStorage
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    console.log('Đã lưu user mới:', newUser);
    message.success(`Đăng ký thành công với vai trò ${finalRole === 'partner' ? 'Đối tác' : 'Khách hàng'}!`);
    
    // 6. Chuyển hướng sang trang đăng nhập
    navigate('/login');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f0f2f5',
      padding: '20px'
    }}>
      <Card style={{ maxWidth: 400, width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={3}>Đăng ký tài khoản</Title>
          <Text type="secondary">
            Đăng ký tư cách: <b>{role === 'partner' ? 'Đối tác' : 'Khách hàng'}</b>
          </Text>
        </div>

        <Form name="register" onFinish={onFinish} layout="vertical" size="large">
          
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Vui lòng nhập tài khoản!' },
              { min: 6, message: 'Tài khoản phải có ít nhất 6 ký tự!' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Tài khoản không chứa ký tự đặc biệt!' }
            ]}
          >
            <Input prefix={<BorderOutlined />} placeholder="Tài khoản" />
          </Form.Item>

          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            normalize={(value) => {
              if (!value) return value;
              return value
                .toLowerCase()
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            }}
          >
            <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' },
              { type: 'email', message: 'Email không đúng định dạng!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải ít nhất 6 ký tự!' },
              { pattern: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/, message: 'Cần ít nhất 1 chữ cái và 1 chữ số!' }
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
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ fontWeight: 'bold' }}>
              ĐĂNG KÝ NGAY
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Đã có tài khoản? </Text>
            <Button type="link" onClick={() => navigate('/login')} style={{ padding: 0 }}>Đăng nhập</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterForm;