import React, { useState, useEffect } from 'react';
import { 
  Layout, Card, Radio, Button, Typography, Row, Col, 
  Divider, Space, Alert, Avatar, Dropdown, Menu, Tag
} from 'antd';
import { 
  CreditCardOutlined, BankOutlined, WalletOutlined, 
  LockOutlined, ArrowLeftOutlined, UserOutlined, 
  LogoutOutlined, SolutionOutlined, EnvironmentOutlined,
  CalendarOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Checkout = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // 1. Lấy thông tin người dùng thật từ localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    } else {
      // Nếu chưa đăng nhập mà vào trang thanh toán thì mời về trang Login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // 2. Menu với sự kiện onClick chuẩn để không bị trắng màn hình
  const userMenu = (
    <Menu onClick={({ key }) => {
      if (key === 'profile') navigate('/profile');
      if (key === 'logout') handleLogout();
    }}>
      <Menu.Item key="profile" icon={<SolutionOutlined />}>Hồ sơ của tôi</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>Đăng xuất</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header style={{ 
        background: '#fff', display: 'flex', justifyContent: 'space-between', 
        alignItems: 'center', padding: '0 50px', borderBottom: '1px solid #f0f0f0',
        position: 'sticky', top: 0, zIndex: 1000
      }}>
        <div 
          style={{ fontWeight: 'bold', fontSize: '20px', color: '#1890ff', cursor: 'pointer' }} 
          onClick={() => navigate('/')}
        >
          🏠 HOTEL BOOKING
        </div>

        {/* FIX: Hiển thị Avatar người dùng thật bọc trong div để tránh lỗi console */}
        {currentUser && (
          <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Text strong>{currentUser.fullName}</Text>
              <Avatar 
                src={currentUser.avatar} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1890ff' }} 
              />
            </div>
          </Dropdown>
        )}
      </Header>

      <Content style={{ padding: '30px 50px' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)} 
          style={{ marginBottom: 20, paddingLeft: 0 }}
        >
          Quay lại trang chi tiết
        </Button>

        <Row gutter={24}>
          <Col span={14}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card title={<Title level={4} style={{margin:0}}>Phương thức thanh toán trực tuyến</Title>}>
                <Alert 
                  message="Lưu ý: Hệ thống chỉ chấp nhận thanh toán trả trước để đảm bảo giữ phòng." 
                  type="info" 
                  showIcon 
                  style={{ marginBottom: 20 }} 
                />
                <Radio.Group defaultValue="banking" style={{ width: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {/* Cập nhật style cho các Card Radio chuẩn UI */}
                    <Card size="small" hoverable styles={{ body: { padding: '12px 16px' } }}>
                      <Radio value="banking">
                        <Space><BankOutlined style={{color: '#1890ff'}}/> Chuyển khoản ngân hàng (QR Code)</Space>
                      </Radio>
                    </Card>
                    <Card size="small" hoverable styles={{ body: { padding: '12px 16px' } }}>
                      <Radio value="momo">
                        <Space><WalletOutlined style={{color: '#ae2070'}}/> Ví điện tử Momo / ZaloPay</Space>
                      </Radio>
                    </Card>
                    <Card size="small" hoverable styles={{ body: { padding: '12px 16px' } }}>
                      <Radio value="card">
                        <Space><CreditCardOutlined style={{color: '#eb2f96'}}/> Thẻ quốc tế Visa/MasterCard</Space>
                      </Radio>
                    </Card>
                  </Space>
                </Radio.Group>
              </Card>

              <Card title={<Title level={4} style={{margin:0}}>Tóm tắt chi phí</Title>}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Giá phòng (2 đêm):</Text>
                  <Text strong>4.000.000đ</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                  <Text type="secondary">Phí dịch vụ & VAT:</Text>
                  <Text strong>200.000đ</Text>
                </div>
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={3} style={{ margin: 0 }}>Tổng cộng:</Title>
                  <Title level={3} style={{ color: '#ff4d4f', margin: 0 }}>4.200.000đ</Title>
                </div>
                <Button 
                  type="primary" 
                  block 
                  size="large" 
                  icon={<LockOutlined />} 
                  style={{ marginTop: 24, height: 54, fontSize: '18px', fontWeight: 'bold', borderRadius: '8px' }}
                  onClick={() => alert('Thanh toán thành công!')}
                >
                  Xác nhận thanh toán
                </Button>
              </Card>
            </Space>
          </Col>

          <Col span={10}>
            {/* Card thông tin khách sạn bên cánh phải */}
            <Card 
              cover={<img alt="hotel" src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800" style={{height: 220, objectFit:'cover'}} />}
              style={{ position: 'sticky', top: 100, borderRadius: '12px', overflow: 'hidden' }}
            >
              <Tag color="blue" style={{marginBottom: 10}}>Resort 5 Sao</Tag>
              <Title level={4} style={{ marginTop: 0 }}>Vinpearl Luxury Nha Trang</Title>
              <Text type="secondary"><EnvironmentOutlined /> Đảo Hòn Tre, Vĩnh Nguyên, Nha Trang</Text>
              
              <Divider dashed />
              
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div>
                  <Text strong style={{display:'block'}}>Loại phòng:</Text>
                  <Text>Phòng Deluxe Giường Đôi - View Biển</Text>
                </div>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Text type="secondary"><CalendarOutlined /> Nhận phòng:</Text>
                    <div style={{fontWeight:'bold', fontSize: '15px'}}>20/03/2026</div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary"><CalendarOutlined /> Trả phòng:</Text>
                    <div style={{fontWeight:'bold', fontSize: '15px'}}>22/03/2026</div>
                  </Col>
                </Row>

                <div style={{ background: '#f0f5ff', padding: '16px', borderRadius: '8px', border: '1px solid #adc6ff' }}>
                  <Text italic style={{fontSize: '13px', color: '#2b4acb'}}>
                    * Chính sách: Miễn phí hủy phòng trước 24h. Bao gồm bữa sáng buffet hàng ngày cho 02 người lớn.
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Checkout;