import React, { useState, useEffect } from 'react';
import axiosClient from '../../services/axiosClient';
import { Form, Input, Button, Card, Typography, App as AntApp } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, BorderOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { AuthApiClient } from '../../services/apiClient';

const { Title, Text } = Typography;

const RegisterForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const role = searchParams.get('role');

  // --- LOGIC ĐIỀU HƯỚNG QUAN TRỌNG ---
  useEffect(() => {
    if (role === 'partner') {
      // Nếu là partner, đá sang trang đăng ký đối tác ngay lập tức
      navigate('/partner/register');
    }
  }, [role, navigate]);


  const capitalize_words = (str) => {
    if (!str) return '';
    return str.trim().toLowerCase().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const onFinish = async (values) => {
    setLoading(true);
    const normalized_fullname = capitalize_words(values.full_name);

    const payload = {
      full_name: normalized_fullname,
      email: values.email.trim(),
      phone: values.phone.trim(),
      password: values.password,
      confirm_password: values.confirm_password,
    };

    try {
      const response = await AuthApiClient.register(payload);
      console.log(response);
      if(response.status === 201){
        message.success(response.message);
        setLoading(false);
        navigate("/login");
        return;
      }
      if(response.status >= 400){
        message.error(response.message);
        setLoading(false);
        return;
      }
    } catch (error) {
      throw new Error(error);
      // message.error(errorData && typeof errorData === 'object' ? String(Object.values(errorData)[0]) : 'Lỗi kết nối server!');
    } 
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={3} style={{ color: '#1890ff', marginBottom: '4px' }}>Đăng ký Khách hàng</Title>
          <Text type="secondary">Tham gia cùng chúng tôi để đặt phòng nhanh nhất</Text>
        </div>

        <Form form={form} name="register" onFinish={onFinish} layout="vertical" size="large" requiredMark={false}>

          <Form.Item label="Họ và tên" name="full_name" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
            <Input 
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="Nhập họ và tên"
              onBlur={(e) => form.setFieldsValue({ full_name: capitalize_words(e.target.value) })}
            />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
            <Input prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} placeholder="example@gmail.com" />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/, message: 'SĐT không hợp lệ!' }]}>
            <Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} placeholder="09xxxxxxxx" />
          </Form.Item>

          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, min: 6, message: 'Tối thiểu 6 ký tự!' }]}>
            <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} />
          </Form.Item>

          <Form.Item label="Xác nhận mật khẩu" name="confirm_password" dependencies={['password']} rules={[{ required: true, message: 'Vui lòng xác nhận!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) return Promise.resolve(); return Promise.reject(new Error('Mật khẩu không khớp!')); } })]}>
            <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading} style={{ fontWeight: 'bold', height: '45px', borderRadius: '8px', marginTop: '10px' }}>
            ĐĂNG KÝ KHÁCH HÀNG
          </Button>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary">Bạn đã có tài khoản? </Text>
          <Link to="/login" style={{ fontWeight: 'bold', color: '#6cacffff' }}>Đăng nhập ngay</Link>
        </div>
      </Card>
    </div>
  );
};

const containerStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5', padding: '40px 20px' };
const cardStyle = { maxWidth: 450, width: '100%', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', border: 'none' };

export default RegisterForm;