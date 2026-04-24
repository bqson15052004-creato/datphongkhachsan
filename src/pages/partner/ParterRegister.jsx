import React, { useState } from 'react';
import axiosClient from '../../services/axiosClient';
import { Form, Input, Button, Card, Typography, App as AntApp, Space, Divider } from 'antd';
import { 
  UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, 
  BorderOutlined, BankOutlined, EnvironmentOutlined, IdcardOutlined 
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const PartnerRegister = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const finalRole = 'partner';

  const capitalize_words = (str) => {
    if (!str) return '';
    return str.trim().toLowerCase().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const onFinish = async (values) => {
    setLoading(true);
    
    const normalized_fullname = capitalize_words(values.full_name);

    // Gom thông tin doanh nghiệp vào note nếu BE chưa có field riêng
    // Hoặc ông có thể gửi trực tiếp nếu BE đã cập nhật Model
    const payload = {
      user_name: values.user_name.trim(), 
      password: values.password,
      full_name: normalized_fullname,
      email: values.email.trim(),
      phone: values.phone.trim(),
      role: finalRole,
      // Thông tin doanh nghiệp mở rộng
      business_name: values.business_name,
      business_address: values.business_address,
      tax_code: values.tax_code,
      note: `DN: ${values.business_name} - MST: ${values.tax_code}`
    };

    try {
      const response = await axiosClient.post('/accounts/register/', payload);
      if (response) {
        message.success('Đăng ký Đối tác thành công! Vui lòng chờ kiểm duyệt.');
        navigate('/partner/login');
      }
    } catch (error) {
      const errorData = error.response?.data;
      message.error(errorData && typeof errorData === 'object' ? String(Object.values(errorData)[0]) : 'Lỗi kết nối server BE!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={3} style={{ color: '#52c41a', marginBottom: '4px' }}>ĐĂNG KÝ</Title>
          <Text type="secondary">Dành cho chủ sở hữu khách sạn/dịch vụ lưu trú</Text>
        </div>

        <Form form={form} name="partner_register" onFinish={onFinish} layout="vertical" size="large" requiredMark={false}>
          
          <Divider orientation="left" style={{ marginTop: 0 }}>Thông tin cá nhân</Divider>
          
          <Form.Item label="Tài khoản" name="user_name" rules={[{ required: true, message: 'Nhập tài khoản!' }, { min: 4, message: 'Tối thiểu 4 ký tự!' }]}>
            <Input prefix={<BorderOutlined style={{ color: '#bfbfbf' }} />} placeholder="Tên đăng nhập hệ thống" />
          </Form.Item>

          <Form.Item label="Họ tên người đại diện" name="full_name" rules={[{ required: true, message: 'Nhập họ tên!' }]}>
            <Input 
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="Nhập họ và tên đầy đủ"
              onBlur={(e) => form.setFieldsValue({ full_name: capitalize_words(e.target.value) })}
            />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]} style={{ flex: 1 }}>
            <Input prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} placeholder="email@example.com" />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/, message: 'SĐT không đúng!' }]} style={{ flex: 1 }}>
            <Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} placeholder="09xxxxxxxx" />
          </Form.Item>

          <Divider orientation="left">Thông tin doanh nghiệp</Divider>

          <Form.Item label="Tên doanh nghiệp" name="business_name" rules={[{ required: true, message: 'Vui lòng nhập tên doanh nghiệp!' }]}>
            <Input prefix={<BankOutlined style={{ color: '#bfbfbf' }} />} placeholder="Ví dụ: Khách sạn Mường Thanh" />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="business_address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
            <Input prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />} placeholder="Số nhà, tên đường, tỉnh thành..." />
          </Form.Item>

          <Form.Item label="Mã số thuế" name="tax_code" rules={[{ required: true, message: 'Vui lòng nhập mã số thuế!' }, { pattern: /^[0-9-]{10,13}$/, message: 'MST không hợp lệ (10-13 chữ số)!' }]}>
            <Input prefix={<IdcardOutlined style={{ color: '#bfbfbf' }} />} placeholder="Nhập mã số thuế doanh nghiệp" />
          </Form.Item>

          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, min: 6, message: 'Tối thiểu 6 ký tự!' }]}>
            <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item label="Xác nhận mật khẩu" name="confirm" dependencies={['password']} rules={[{ required: true, message: 'Vui lòng xác nhận!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) return Promise.resolve(); return Promise.reject(new Error('Mật khẩu không khớp!')); } })]}>
            <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item style={{ marginTop: '24px' }}>
            <Button type="primary" htmlType="submit" block loading={loading} style={submitBtnStyle}>
              ĐĂNG KÝ
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Text type="secondary">Đã có tài khoản đối tác?</Text>
            <Link to="/partner/login" style={{ fontWeight: 'bold', color: '#52c41a' }}>Đăng nhập</Link>
          </Space>
        </div>
      </Card>
    </div>
  );
};

const containerStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5', padding: '40px 20px' };
const cardStyle = { maxWidth: 550, width: '100%', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', border: 'none' };
const submitBtnStyle = { fontWeight: 'bold', height: '45px', borderRadius: '8px', backgroundColor: '#52c41a', borderColor: '#52c41a' };

export default PartnerRegister;