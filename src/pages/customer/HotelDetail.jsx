import React, { useState, useEffect } from 'react';
import { 
  Layout, Row, Col, Typography, Button, Card, Tag, 
  Table, Tabs, Image, Rate, Divider, Space, Avatar, Dropdown, Menu 
} from 'antd';
import { 
  EnvironmentOutlined, CheckCircleOutlined, InfoCircleOutlined,
  ArrowLeftOutlined, UserOutlined, LogoutOutlined, SolutionOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const HotelDetail = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // Lấy dữ liệu user thật từ localStorage khi trang load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/login');
  };

  // Menu xử lý sự kiện onClick chuẩn để tránh lỗi trắng màn hình
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

  const hotel = {
    name: 'Vinpearl Luxury Nha Trang', // Fix: Dùng name thay vì fullName
    address: 'Đảo Hòn Tre, Vĩnh Nguyên, Nha Trang, Khánh Hòa',
    rating: 5,
    description: 'Tọa lạc tại vị trí riêng biệt trên đảo Hòn Tre, Vinpearl Luxury Nha Trang mang đến không gian nghỉ dưỡng sang trọng với các biệt thự có hồ bơi riêng và dịch vụ đẳng cấp 5 sao.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
    ],
    amenities: ['Wifi miễn phí', 'Hồ bơi bãi biển', 'Bữa sáng buffet', 'Xe đưa đón sân bay', 'Phòng Gym'],
  };

  const roomTypes = [
    { key: '1', name: 'Phòng Deluxe Giường Đôi', price: 2500000, status: 'Còn phòng', capacity: '2 Người lớn' },
    { key: '2', name: 'Biệt Thự Hướng Biển', price: 4500000, status: 'Chỉ còn 1 phòng', capacity: '2 Người lớn, 1 Trẻ em' },
    { key: '3', name: 'Phòng Suite Tổng Thống', price: 8900000, status: 'Hết phòng', capacity: '4 Người lớn' },
  ];

  const columns = [
    { title: 'Loại phòng', dataIndex: 'name', key: 'name', render: (text) => <Text strong>{text}</Text> },
    { title: 'Sức chứa', dataIndex: 'capacity', key: 'capacity' },
    { 
      title: 'Giá/Đêm', 
      dataIndex: 'price', 
      key: 'price', 
      render: (price) => <Text type="danger" strong>{price.toLocaleString()}đ</Text> 
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Hết phòng' ? 'default' : 'green'}>{status}</Tag>
      )
    },
    { 
      title: 'Thao tác', 
      key: 'action', 
      render: (_, record) => (
        <Button 
          type="primary" 
          disabled={record.status === 'Hết phòng'}
          onClick={() => navigate('/checkout')} 
        >
          Đặt ngay
        </Button>
      ) 
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header style={{ 
        background: '#fff', display: 'flex', justifyContent: 'space-between', 
        alignItems: 'center', padding: '0 50px', borderBottom: '1px solid #f0f0f0',
        position: 'sticky', top: 0, zIndex: 1000, width: '100%'
      }}>
        <div 
          style={{ fontWeight: 'bold', fontSize: '20px', color: '#1890ff', cursor: 'pointer' }} 
          onClick={() => navigate('/')}
        >
          🏠 HOTEL BOOKING
        </div>

        {currentUser ? (
          <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
            {/* FIX: Bọc vào div để tránh lỗi React.Children.only */}
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Text strong>{currentUser.fullName}</Text>
              <Avatar 
                src={currentUser.avatar} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1890ff' }} 
              />
            </div>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => navigate('/login')}>Đăng nhập</Button>
        )}
      </Header>

      <Content style={{ padding: '20px 50px', background: '#fff' }}>
        <div style={{ marginBottom: 10 }}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ paddingLeft: 0 }}>
            Quay lại trang danh sách
          </Button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <Title level={2} style={{ marginBottom: 4 }}>{hotel.name}</Title>
          <Space>
            <Rate disabled defaultValue={hotel.rating} />
            <Text type="secondary"><EnvironmentOutlined /> {hotel.address}</Text>
          </Space>
        </div>

        <Row gutter={[12, 12]}>
          <Col span={16}>
            <Image src={hotel.images[0]} style={{ width: '100%', height: 450, objectFit: 'cover', borderRadius: 8 }} />
          </Col>
          <Col span={8}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Image src={hotel.images[1]} style={{ width: '100%', height: 219, objectFit: 'cover', borderRadius: 8 }} />
              <Image src={hotel.images[2]} style={{ width: '100%', height: 219, objectFit: 'cover', borderRadius: 8 }} />
            </Space>
          </Col>
        </Row>

        <Row gutter={40} style={{ marginTop: 40 }}>
          <Col span={16}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Tổng quan" key="1">
                <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>{hotel.description}</Paragraph>
                <Divider />
                <Title level={4}>Tiện nghi khách sạn</Title>
                <Row gutter={[16, 16]}>
                  {hotel.amenities.map(item => (
                    <Col span={8} key={item}>
                      <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> {item}</Text>
                    </Col>
                  ))}
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Đánh giá từ khách hàng" key="2">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Text type="secondary">Chưa có đánh giá nào cho khách sạn này.</Text>
                </div>
              </Tabs.TabPane>
            </Tabs>

            <div style={{ marginTop: 40 }}>
              <Title level={4}>Chọn phòng trống</Title>
              <Table columns={columns} dataSource={roomTypes} pagination={false} bordered />
            </div>
          </Col>

          <Col span={8}>
            <Card bordered style={{ borderRadius: 12, backgroundColor: '#f9f9f9', position: 'sticky', top: 100 }}>
              <Title level={5}><InfoCircleOutlined /> Tại sao nên đặt ở đây?</Title>
              <ul style={{ paddingLeft: 20 }}>
                <li><Text>Giá tốt nhất thị trường</Text></li>
                <li><Text>Xác nhận ngay lập tức</Text></li>
                <li><Text>Hỗ trợ khách hàng 24/7</Text></li>
              </ul>
              <Divider />
              <Button type="primary" block size="large" onClick={() => document.querySelector('.ant-table').scrollIntoView({ behavior: 'smooth' })}>
                Xem phòng trống
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default HotelDetail;