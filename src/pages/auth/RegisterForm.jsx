import React, { useState } from 'react';
import axiosClient from '../../services/axiosClient';
import { Form, Input, Button, Card, Typography, App as AntApp, Space } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, BorderOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const RegisterForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const role = searchParams.get('role');
  const finalRole = role === 'partner' ? 'partner' : 'customer';

  // Helper: Tự động viết hoa chữ cái đầu cho chuẩn form họ tên
  const capitalize_words = (str) => {
    if (!str) return '';
    return str
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const onFinish = async (values) => {
    setLoading(true);
    
    // Chuẩn hóa họ tên trước khi gửi lên backend
    const normalized_fullname = capitalize_words(values.full_name);

    const payload = {
      user_name: values.user_name.trim(), 
      password: values.password,
      full_name: normalized_fullname,
      email: values.email.trim(),
      phone: values.phone.trim(),
      role: finalRole,
      note: values.note || ""
    };

    try {
      const response = await axiosClient.post('/accounts/register/', payload);
      if (response) {
        message.success(`Đăng ký thành công với vai trò ${finalRole === 'partner' ? 'Đối tác' : 'Khách hàng'}!`);
        navigate('/login');
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      const errorData = error.response?.data;
      if (errorData && typeof errorData === 'object') {
        const firstErrorMessage = Object.values(errorData)[0];
        message.error(String(firstErrorMessage));
      } else {
        message.error('Lỗi kết nối server BE!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={3} style={{ color: '#1890ff', marginBottom: '4px' }}>Tạo tài khoản mới</Title>
          <Text type="secondary">
            Đăng ký tư cách: <b style={{ color: finalRole === 'partner' ? '#52c41a' : '#1890ff' }}>
              {finalRole === 'partner' ? 'Đối tác kinh doanh' : 'Khách hàng'}
            </b>
          </Text>
        </div>

        <Form 
          form={form}
          name="register" 
          onFinish={onFinish} 
          layout="vertical" 
          size="large"
          requiredMark={false} // Ẩn dấu sao đỏ để UI mượt mà hơn
        >
          {/* 1. Tài khoản */}
          <Form.Item
            label="Tài khoản đăng nhập"
            name="user_name" 
            rules={[
              { required: true, message: 'Vui lòng nhập tài khoản!' },
              { min: 4, message: 'Tài khoản phải có ít nhất 4 ký tự!' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Tài khoản không được chứa khoảng trắng hoặc ký tự đặc biệt!' }
            ]}
          >
            <Input prefix={<BorderOutlined style={{ color: '#bfbfbf' }} />} placeholder="Tên đăng nhập (viết liền, không dấu)" />
          </Form.Item>

          {/* 2. Họ tên */}
          <Form.Item
            label="Họ và tên"
            name="full_name"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="Nhập họ và tên đầy đủ"
              onBlur={(e) => {
                // Khi người dùng gõ xong và click ra ngoài, tự động viết hoa đẹp đẽ
                const val = e.target.value;
                form.setFieldsValue({ full_name: capitalize_words(val) });
              }}
            />
          </Form.Item>

          {/* 3. Email */}
          <Form.Item
            label="Địa chỉ Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' }, 
              { type: 'email', message: 'Email không đúng định dạng!' }
            ]}
          >
            <Input prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} placeholder="hotel@example.com" />
          </Form.Item>

          {/* 4. Số điện thoại */}
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/, message: 'Số điện thoại Việt Nam không hợp lệ!' }
            ]}
          >
            <Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} placeholder="09xxxxxxxx" />
          </Form.Item>

          {/* 5. Mật khẩu */}
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' }, 
              { min: 6, message: 'Mật khẩu ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="Nhập mật khẩu an toàn" />
          </Form.Item>

          {/* 6. Xác nhận mật khẩu */}
          <Form.Item
            label="Xác nhận mật khẩu"
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
            <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="Gõ lại mật khẩu phía trên" />
          </Form.Item>

          {/* 7. Button submit */}
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ fontWeight: 'bold', height: '45px', borderRadius: '8px' }}>
              ĐĂNG KÝ NGAY
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Space>
            <Text type="secondary">Bạn đã có tài khoản?</Text>
            <Link to="/login" style={{ fontWeight: 'bold', color: '#1890ff' }}>Đăng nhập</Link>
          </Space>
        </div>
      </Card>
    </div>
  );
};

const containerStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5', padding: '40px 20px' };
const cardStyle = { maxWidth: 450, width: '100%', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', border: 'none' };

export default RegisterForm;