import React from 'react';
import { Card, Row, Col, Typography, Space, Button } from 'antd';
import { UserOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/register/form?role=${role}`);
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
      {/* Container chính bao quanh tất cả nội dung */}
      <div style={{ maxWidth: 800, width: '100%' }}>
        
        {/* 1. Phần Tiêu đề */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={2}>Chào mừng bạn đến với Hotel Booking</Title>
          <Text type="secondary">Vui lòng chọn vai trò của bạn để chúng tôi thiết lập không gian phù hợp</Text>
        </div>
        
        {/* 2. Phần Vai trò */}
        <Row gutter={24} justify="center">
          <Col xs={24} sm={12}>
            <Card 
              hoverable 
              onClick={() => handleSelect('customer')}
              style={{ textAlign: 'center', borderRadius: '12px' }}
              cover={<UserOutlined style={{ fontSize: '64px', marginTop: '40px', color: '#1890ff' }} />}
            >
              <Card.Meta 
                title={<Title level={4}>Tôi là Khách hàng</Title>} 
                description="Tìm kiếm, đặt phòng và trải nghiệm dịch vụ nghỉ dưỡng với hỗ trợ từ AI." 
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12}>
            <Card 
              hoverable 
              onClick={() => handleSelect('partner')}
              style={{ textAlign: 'center', borderRadius: '12px' }}
              cover={<ShopOutlined style={{ fontSize: '64px', marginTop: '40px', color: '#52c41a' }} />}
            >
              <Card.Meta 
                title={<Title level={4}>Tôi là Đối tác</Title>} 
                description="Đăng ký kinh doanh, quản lý phòng và tiếp cận hàng ngàn khách hàng." 
              />
            </Card>
          </Col>
        </Row>

        {/* 3. Dòng ĐĂNG NHẬP */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Bạn đã có tài khoản?{' '}
          </Text>
          <Button 
            type="link" 
            onClick={() => navigate('/login')} 
            style={{ fontSize: '16px', padding: 0, fontWeight: 'bold' }}
          >
            Đăng nhập ngay
          </Button>
        </div>

      </div>
    </div>
  );
};

export default RoleSelection;