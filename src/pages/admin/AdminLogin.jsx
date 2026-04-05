import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, App as AntApp } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { message: antd_message } = AntApp.useApp();
  const [is_loading, set_is_loading] = useState(false);

  // 1. Dữ liệu giả lập khớp với bảng 'admin' trong ERD
  // level: 1 (Sếp tổng), is_root: true (Admin hệ thống)
  const ADMIN_CREDENTIALS = {
    id_user: 99,
    email: 'admin@gmail.com',
    password: 'admin123',
    full_name: 'Admin',
    role: 'admin',      // Dùng 'role' để ProtectedRoute dễ check
    is_root: true,      // Quyền vào vùng Admin
    level: 1,           // Cấp bậc cao nhất để thấy hết menu
    is_active: true,
  };

  const on_finish = (values) => {
    set_is_loading(true);
    
    const { admin_email, admin_password } = values;

    // Giả lập gọi API login
    setTimeout(() => {
      if (admin_email === ADMIN_CREDENTIALS.email && admin_password === ADMIN_CREDENTIALS.password) {
        antd_message?.success(`Chào mừng ${ADMIN_CREDENTIALS.full_name} đã quay trở lại!`);
        
        localStorage.setItem('current_user', JSON.stringify(ADMIN_CREDENTIALS));
        localStorage.setItem('admin_access_token', 'token_bi_mat_2026');
        
        // Sau khi lưu xong, chuyển hướng vào Dashboard
        navigate('/admin/dashboard');
      } else {
        antd_message?.error('Tài khoản hoặc mật khẩu admin không đúng!');
      }
      set_is_loading(false);
    }, 800);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #001529 0%, #003a8c 100%)'
    }}>
      <Card 
        bordered={false}
        style={{ width: 400, borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <ShieldOutlined style={{ fontSize: 45, color: '#1890ff', marginBottom: 12 }} />
          <Title level={3} style={{ margin: 0, color: '#001529', letterSpacing: '1px' }}>
            HỆ THỐNG QUẢN TRỊ
          </Title>
          <Text type="secondary">Đăng nhập quyền Admin nội bộ</Text>
        </div>

        <Form
          name="admin_login_form"
          onFinish={on_finish}
          layout="vertical"
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="admin_email" 
            label={<Text strong>Email Quản trị</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không đúng định dạng!' }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="admin@gmail.com" />
          </Form.Item>

          <Form.Item
            name="admin_password"
            label={<Text strong>Mật khẩu</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="••••••••" />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={is_loading}
              style={{ height: 50, borderRadius: 8, fontSize: '16px', fontWeight: 'bold' }}
            >
              VÀO HỆ THỐNG
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            <Button type="link" onClick={() => navigate('/')} size="small">
              Quay lại trang chủ
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;