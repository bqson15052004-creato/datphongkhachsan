import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Divider } from 'antd';
import { UserOutlined, ShopOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const RoleSelection = () => {
  const navigate = useNavigate();

  // 1. ĐỒNG BỘ ROUTE
  const handleSelect = (role) => {
    navigate(`/register/form?role=${role}`);
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: 900, width: '100%' }}>
        
        {/* 1. Phần Tiêu đề*/}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Title level={1} style={{ color: '#262626', marginBottom: '16px' }}>
            Chào mừng bạn đến với Hotel Booking
          </Title>
          <Text type="secondary" style={{ fontSize: '18px' }}>
            Chọn vai trò phù hợp để bắt đầu hành trình của bạn
          </Text>
        </div>
        
        {/* 2. Phần Vai trò*/}
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} sm={11}>
            <Card 
              hoverable 
              onClick={() => handleSelect('customer')}
              className="role-card customer-card"
              style={cardStyle}
              cover={
                <div style={iconContainerStyle}>
                  <UserOutlined style={{ fontSize: '72px', color: '#1890ff' }} />
                </div>
              }
            >
              <Title level={3}>Tôi là Khách hàng</Title>
              <Text type="secondary" style={{ display: 'block', minHeight: '48px' }}>
                Tìm kiếm phòng, đặt chỗ nhanh chóng và nhận ưu đãi từ hệ thống AI.
              </Text>
              <Divider />
              <Button type="primary" shape="round" icon={<ArrowRightOutlined />} block>
                Bắt đầu ngay
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} sm={11}>
            <Card 
              hoverable 
              onClick={() => handleSelect('partner')}
              className="role-card partner-card"
              style={cardStyle}
              cover={
                <div style={iconContainerStyle}>
                  <ShopOutlined style={{ fontSize: '72px', color: '#52c41a' }} />
                </div>
              }
            >
              <Title level={3}>Tôi là Đối tác</Title>
              <Text type="secondary" style={{ display: 'block', minHeight: '48px' }}>
                Quản lý khách sạn, tối ưu doanh thu và kết nối hàng triệu khách hàng.
              </Text>
              <Divider />
              <Button type="primary" shape="round" icon={<ArrowRightOutlined />} block style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                Đăng ký kinh doanh
              </Button>
            </Card>
          </Col>
        </Row>

        {/* 3. Dòng ĐĂNG NHẬP*/}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <Space size="small">
            <Text style={{ fontSize: '16px', color: '#8c8c8c' }}>Bạn đã có tài khoản?</Text>
            <Button 
              type="link" 
              onClick={() => navigate('/login')} 
              style={{ fontSize: '16px', padding: 0, fontWeight: '700' }}
            >
              Đăng nhập ngay
            </Button>
          </Space>
        </div>
      </div>

      {/* 2. HIỆU ỨNG ACTIVE & HOVER: Thêm CSS nhấc card lên chuyên nghiệp */}
      <style dangerouslySetInnerHTML={{ __html: `
        .role-card {
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1) !important;
          border: 2px solid transparent !important;
        }
        .role-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        .customer-card:hover {
          border-color: #1890ff !important;
        }
        .partner-card:hover {
          border-color: #52c41a !important;
        }
      `}} />
    </div>
  );
};

// 3. TỐI ƯU CODE: Tách Style ra hằng số cho gọn
const containerStyle = {
  minHeight: '100vh', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  backgroundColor: '#f8fafc',
  padding: '40px 20px'
};

const cardStyle = {
  textAlign: 'center', 
  borderRadius: '20px',
  overflow: 'hidden',
  padding: '10px'
};

const iconContainerStyle = {
  paddingTop: '50px',
  paddingBottom: '20px',
  display: 'flex',
  justifyContent: 'center'
};

export default RoleSelection;