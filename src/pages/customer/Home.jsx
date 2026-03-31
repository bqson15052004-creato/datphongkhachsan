import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Typography, Space, Row, Col, Card, Rate, DatePicker } from 'antd';
import { 
  SearchOutlined, 
  EnvironmentOutlined, 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import beachh from '../../assets/beachh.jpg'; // Hình ảnh nền cho Hero section

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Dữ liệu mẫu (Sau này ông nên fetch từ data.json)
const featuredHotels = [
  { id: 1, name: 'Vinpearl Luxury Nha Trang', price: '2.500.000', rate: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80', location: 'Nha Trang' },
  { id: 2, name: 'InterContinental Da Nang', price: '4.200.000', rate: 5, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&q=80', location: 'Đà Nẵng' },
  { id: 3, name: 'JW Marriott Phu Quoc', price: '3.800.000', rate: 5, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80', location: 'Phú Quốc' },
  { id: 4, name: 'Pullman Vũng Tàu', price: '1.800.000', rate: 4, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80', location: 'Vũng Tàu' },
];

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [dates, setDates] = useState([]);
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* --- SỬ DỤNG NAVBAR ĐÃ TÁCH --- */}
      <Navbar />

      <Content>
        {/* 1. Hero Section - Tìm Kiếm */}
        <div style={{ 
          background: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${beachh}) no-repeat`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          padding: '80px 10px',
          textAlign: 'center',
          width: '100%',
        }}>
          <Title style={{ color: '#fff', fontSize: '42px', marginBottom: '15px', maxWidth: '800px', margin: '0 auto 15px' }}>
            Tận hưởng kỳ nghỉ tuyệt vời
          </Title>
          <Text style={{ color: '#fff', fontSize: '18px', display: 'block', marginBottom: '30px' }}>
            Với hơn 1.000 khách sạn cao cấp đang chờ đón bạn
          </Text>
          <Card style={{ maxWidth: '1000px', margin: '40px auto 0', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            <Row gutter={[12, 12]} align="middle">
              <Col xs={24} md={10}>
                <Input size="large" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Địa điểm (Nha Trang, Đà Nẵng...)" prefix={<EnvironmentOutlined />} />
              </Col>
              <Col xs={24} md={10}>
                <RangePicker
                  size="large"
                  style={{ width: '100%' }}
                  placeholder={['Nhận phòng', 'Trả phòng']}
                  value={dates}
                  onChange={(val) => setDates(val)}
                />
              </Col>
              <Col xs={24} md={4}>
                <Button
                  size="large"
                  type="primary"
                  block
                  icon={<SearchOutlined />}
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (query) params.set('q', query);
                    if (dates && dates.length === 2) {
                      params.set('from', dates[0].format('YYYY-MM-DD'));
                      params.set('to', dates[1].format('YYYY-MM-DD'));
                    }
                    navigate(`/hotels?${params.toString()}`);
                  }}
                >
                  TÌM KIẾM
                </Button>
              </Col>
            </Row>
          </Card>
        </div>

        {/* 2. Featured Hotels Section */}
        <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <Title level={2}>Khách sạn nổi bật</Title>
            <Button type="link" size="large" onClick={() => navigate('/hotels')}>Xem tất cả</Button>
          </div>

          <Row gutter={[24, 24]}>
            {featuredHotels.map((hotel) => (
              <Col xs={24} sm={12} md={6} key={hotel.id}>
                <Card
                  hoverable
                  onClick={() => navigate(`/hotel/${hotel.id}`)}
                  cover={<img alt={hotel.name} src={hotel.image} style={{ height: 220, objectFit: 'cover' }} />}
                  style={{ borderRadius: '12px', overflow: 'hidden' }}
                >
                  <Text type="secondary"><EnvironmentOutlined /> {hotel.location}</Text>
                  <Title level={5} style={{ margin: '8px 0', minHeight: '44px' }}>{hotel.name}</Title>
                  <Rate disabled defaultValue={hotel.rate} style={{ fontSize: '14px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <div style={{ lineHeight: 1 }}>
                      <Text type="danger" strong style={{ fontSize: '20px' }}>{hotel.price}đ</Text>
                      <br /><Text type="secondary" style={{ fontSize: '12px' }}>/ đêm</Text>
                    </div>
                    <Button type="primary" ghost>Chi tiết</Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
      
      <Layout.Footer style={{ textAlign: 'center' }}>
        HOTEL BOOKING - Đem lại trải nghiệm nghỉ dưỡng tuyệt vời cho bạn! &copy; 2026
      </Layout.Footer>
    </Layout>
  );
};

export default Home;