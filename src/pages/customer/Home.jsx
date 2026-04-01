import React, { useState } from 'react';
import { Layout, Input, Button, Typography, Row, Col, Card, Rate, DatePicker, Space } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import beach_bg from '../../assets/beachh.jpg'; 

const { Content, Footer } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Dữ liệu mẫu
const featured_hotels = [
  { id: 1, name: 'Vinpearl Luxury Nha Trang', price: '2.500.000', rate: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80', location: 'Nha Trang' },
  { id: 2, name: 'InterContinental Da Nang', price: '4.200.000', rate: 5, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&q=80', location: 'Đà Nẵng' },
  { id: 3, name: 'JW Marriott Phu Quoc', price: '3.800.000', rate: 5, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80', location: 'Phú Quốc' },
  { id: 4, name: 'Pullman Vũng Tàu', price: '1.800.000', rate: 4, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80', location: 'Vũng Tàu' },
];

const Home = () => {
  const navigate = useNavigate();
  const [search_query, set_search_query] = useState('');
  const [booking_dates, set_booking_dates] = useState([]);

  const handle_search = () => {
    const params = new URLSearchParams();
    if (search_query) params.set('q', search_query);
    if (booking_dates && booking_dates.length === 2) {
      params.set('from', booking_dates[0].format('YYYY-MM-DD'));
      params.set('to', booking_dates[1].format('YYYY-MM-DD'));
    }
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <Layout style={main_layout_style}>
      <Navbar />

      <Content>
        {/* 1. Hero Section */}
        <div style={hero_section_style}>
          <Title style={hero_title_style}>
            Tận hưởng kỳ nghỉ tuyệt vời
          </Title>
          <Text style={hero_subtitle_style}>
            Với hơn 1.000 khách sạn cao cấp đang chờ đón bạn
          </Text>

          <Card style={search_card_style}>
            <Row gutter={[12, 12]} align="middle">
              <Col xs={24} md={10}>
                <Input 
                  size="large" 
                  value={search_query} 
                  onChange={(e) => set_search_query(e.target.value)} 
                  placeholder="Địa điểm (Nha Trang, Đà Nẵng...)" 
                  prefix={<EnvironmentOutlined />} 
                />
              </Col>
              <Col xs={24} md={10}>
                <RangePicker
                  size="large"
                  style={full_width_style}
                  placeholder={['Nhận phòng', 'Trả phòng']}
                  value={booking_dates}
                  onChange={(val) => set_booking_dates(val)}
                />
              </Col>
              <Col xs={24} md={4}>
                <Button
                  size="large"
                  type="primary"
                  block
                  icon={<SearchOutlined />}
                  onClick={handle_search}
                >
                  TÌM KIẾM
                </Button>
              </Col>
            </Row>
          </Card>
        </div>

        {/* 2. Featured Hotels Section */}
        <div style={section_container_style}>
          <div style={section_header_style}>
            <Title level={2} style={no_margin_style}>Khách sạn nổi bật</Title>
            <Button type="link" size="large" onClick={() => navigate('/hotels')}>Xem tất cả</Button>
          </div>

          <Row gutter={[24, 24]}>
            {featured_hotels.map((hotel) => (
              <Col xs={24} sm={12} md={6} key={hotel.id}>
                <Card
                  hoverable
                  onClick={() => navigate(`/hotel/${hotel.id}`)}
                  cover={<img alt={hotel.name} src={hotel.image} style={hotel_img_style} />}
                  style={hotel_card_style}
                >
                  <Text type="secondary"><EnvironmentOutlined /> {hotel.location}</Text>
                  <Title level={5} style={hotel_title_style}>{hotel.name}</Title>
                  <Rate disabled defaultValue={hotel.rate} style={rate_style} />
                  
                  <div style={card_footer_style}>
                    <div style={price_container_style}>
                      <Text type="danger" strong style={price_text_style}>{hotel.price}đ</Text>
                      <br /><Text type="secondary" style={per_night_style}>/ đêm</Text>
                    </div>
                    <Button type="primary" ghost>Chi tiết</Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
      
      <Footer style={footer_style}>
        HOTEL BOOKING - Đem lại trải nghiệm nghỉ dưỡng tuyệt vời cho bạn! &copy; 2026
      </Footer>
    </Layout>
  );
};

// HỆ THỐNG STYLE CONSTANTS
const main_layout_style = { minHeight: '100vh', backgroundColor: '#fff' };
const full_width_style = { width: '100%' };
const no_margin_style = { margin: 0 };

const hero_section_style = { 
  background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${beach_bg}) no-repeat`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '100px 20px',
  textAlign: 'center'
};

const hero_title_style = { color: '#fff', fontSize: '48px', marginBottom: '15px', fontWeight: '800' };
const hero_subtitle_style = { color: '#fff', fontSize: '20px', display: 'block', marginBottom: '40px' };
const search_card_style = { maxWidth: '1000px', margin: '0 auto', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' };

const section_container_style = { maxWidth: '1200px', margin: '80px auto', padding: '0 20px' };
const section_header_style = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };

const hotel_card_style = { borderRadius: '16px', overflow: 'hidden' };
const hotel_img_style = { height: 220, objectFit: 'cover' };
const hotel_title_style = { margin: '8px 0', minHeight: '44px' };
const rate_style = { fontSize: '14px' };

const card_footer_style = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' };
const price_container_style = { lineHeight: 1 };
const price_text_style = { fontSize: '22px' };
const per_night_style = { fontSize: '12px' };
const footer_style = { textAlign: 'center', padding: '40px 0', background: '#f8fafc' };

export default Home;