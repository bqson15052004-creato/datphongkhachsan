import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Divider } from 'antd';
import { UserOutlined, ShopOutlined, ArrowRightOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    // Chuyển hướng sang form đăng ký với query param role
    navigate(`/register/form?role=${role}`);
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: 1000, width: '100%', padding: '0 20px' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <Title style={{ color: '#1a3353', marginBottom: '12px', fontSize: '38px' }}>
            Bắt đầu cùng StayHub
          </Title>
          <Text type="secondary" style={{ fontSize: '18px' }}>
            Bạn muốn trải nghiệm dịch vụ hay trở thành đối tác kinh doanh của chúng tôi?
          </Text>
        </div>
        
        <Row gutter={[40, 40]} justify="center">
          {/* VAI TRÒ CUSTOMER */}
          <Col xs={24} md={10}>
            <Card
              hoverable
              onClick={() => handleSelect('customer')}
              className="role-card customer-hover"
              style={cardStyle}
            >
              <div style={iconWrapperStyle('#e6f7ff')}>
                <UserOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
              </div>
              <Title level={3} style={{ marginTop: 24 }}>Tôi là Khách hàng</Title>
              <ul style={featureListStyle}>
                <li><CheckCircleFilled style={{color: '#52c41a'}} /> Tìm phòng giá tốt nhất</li>
                <li><CheckCircleFilled style={{color: '#52c41a'}} /> Đặt phòng trong 30 giây</li>
                <li><CheckCircleFilled style={{color: '#52c41a'}} /> Đánh giá và chia sẻ trải nghiệm</li>
              </ul>
              <Divider />
              <Button 
                type="primary" 
                size="large" 
                shape="round" 
                icon={<ArrowRightOutlined />} 
                block
                style={{ height: '50px', fontWeight: 'bold' }}
              >
                Khám phá ngay
              </Button>
            </Card>
          </Col>
          
          {/* VAI TRÒ PARTNER */}
          <Col xs={24} md={10}>
            <Card
              hoverable
              onClick={() => handleSelect('partner')}
              className="role-card partner-hover"
              style={cardStyle}
            >
              <div style={iconWrapperStyle('#f6ffed')}>
                <ShopOutlined style={{ fontSize: '64px', color: '#52c41a' }} />
              </div>
              <Title level={3} style={{ marginTop: 24 }}>Tôi là Đối tác</Title>
              <ul style={featureListStyle}>
                <li><CheckCircleFilled style={{color: '#52c41a'}} /> Đăng tải phòng miễn phí</li>
                <li><CheckCircleFilled style={{color: '#52c41a'}} /> Quản lý booking thông minh</li>
                <li><CheckCircleFilled style={{color: '#52c41a'}} /> Báo cáo doanh thu chi tiết</li>
              </ul>
              <Divider />
              <Button 
                type="primary" 
                size="large" 
                shape="round" 
                icon={<ArrowRightOutlined />} 
                block 
                style={{ 
                  backgroundColor: '#52c41a', 
                  borderColor: '#52c41a', 
                  height: '50px', 
                  fontWeight: 'bold' 
                }}
              >
                Hợp tác kinh doanh
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Footer Login Link */}
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Card size="small" style={{ display: 'inline-block', borderRadius: '30px', padding: '0 20px', background: '#fff' }}>
            <Space>
              <Text style={{ color: '#8c8c8c' }}>Bạn đã có tài khoản?</Text>
              <Button
                type="link"
                onClick={() => navigate('/login')}
                style={{ fontWeight: 'bold', padding: 0 }}
              >
                Đăng nhập tại đây
              </Button>
            </Space>
          </Card>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .role-card {
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
          border: 2px solid transparent !important;
          border-radius: 24px !important;
          padding: 20px !important;
        }
        .role-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
        .customer-hover:hover {
          border-color: #1890ff !important;
        }
        .partner-hover:hover {
          border-color: #52c41a !important;
        }
        ul { padding: 0; list-style: none; }
      `}} />
    </div>
  );
};

// Styles chuyên biệt
const containerStyle = { 
  minHeight: '100vh', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  background: 'linear-gradient(180deg, #f0f2f5 0%, #ffffff 100%)', 
  padding: '40px 0' 
};

const cardStyle = { 
  textAlign: 'center', 
  height: '100%', 
  display: 'flex', 
  flexDirection: 'column', 
  justifyContent: 'center' 
};

const iconWrapperStyle = (bgColor) => ({
  width: '120px',
  height: '120px',
  backgroundColor: bgColor,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto'
});

const featureListStyle = {
  textAlign: 'left',
  margin: '20px auto',
  display: 'inline-block',
  fontSize: '15px',
  color: '#595959',
  lineHeight: '2.5'
};

export default RoleSelection;