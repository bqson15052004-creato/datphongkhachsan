import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Typography, Row, Col, Card, Rate, DatePicker, Skeleton, Empty } from 'antd';
import { SearchOutlined, EnvironmentOutlined, FireOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
// import axiosClient from '../../services/axiosClient'; // Tạm thời chưa dùng đến
import Navbar from '../../components/common/Navbar';
import beachh from '../../assets/beachh.jpg';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// DỮ LIỆU MẪU ĐỂ HIỂN THỊ GIAO DIỆN (KHI CHƯA CÓ BACKEND)
const MOCK_FEATURED = [
  { id_hotel: 1, hotel_name: 'Vinpearl Luxury Nha Trang', price_per_night: 2500000, rate_star: 5, image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500', location_city: 'Nha Trang' },
  { id_hotel: 2, hotel_name: 'InterContinental Da Nang', price_per_night: 4200000, rate_star: 5, image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500', location_city: 'Đà Nẵng' },
  { id_hotel: 3, hotel_name: 'Sofitel Legend Metropole', price_per_night: 5500000, rate_star: 5, image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500', location_city: 'Hà Nội' },
  { id_hotel: 4, hotel_name: 'JW Marriott Phu Quoc', price_per_night: 6800000, rate_star: 5, image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500', location_city: 'Phú Quốc' },
];

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [dates, setDates] = useState([]);
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        /* --- COMMENT PHẦN BACKEND LẠI ---
        const response = await axiosClient.get('/hotels/featured/');
        setFeaturedHotels(response.data || response);
        ---------------------------------- */
        
        // GIẢ LẬP ĐỘ TRỄ MẠNG ĐỂ XEM HIỆU ỨNG SKELETON
        setTimeout(() => {
          setFeaturedHotels(MOCK_FEATURED);
          setLoading(false);
        }, 800);

      } catch (error) {
        setFeaturedHotels(MOCK_FEATURED);
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('location', query);
    if (dates && dates.length === 2) {
      params.set('check_in', dates[0].format('YYYY-MM-DD'));
      params.set('check_out', dates[1].format('YYYY-MM-DD'));
    }
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Navbar />

      <Content>
        {/* Hero Section */}
        <div style={{
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url(${beachh}) no-repeat center/cover`,
          color: '#fff',
          padding: '120px 20px',
          textAlign: 'center',
        }}>
          <Title style={{ color: '#fff', fontSize: '48px', fontWeight: 800, marginBottom: '15px' }}>
            Khám phá thiên đường nghỉ dưỡng
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '20px', display: 'block', marginBottom: '50px' }}>
            Hơn 5000+ khách sạn đang chờ đón bạn với mức giá tốt nhất
          </Text>

          {/* Thanh Search - Thay đổi bordered thành variant cho chuẩn AntD 5 */}
          <Card variant="none" style={{ maxWidth: '1000px', margin: '0 auto', borderRadius: '16px', boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={10}>
                <Input 
                  size="large" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder="Bạn muốn đi đâu? (Đà Nẵng, Phú Quốc...)" 
                  prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />} 
                  style={{ borderRadius: '8px' }}
                />
              </Col>
              <Col xs={24} md={10}>
                <RangePicker
                  size="large"
                  style={{ width: '100%', borderRadius: '8px' }}
                  placeholder={['Ngày nhận phòng', 'Ngày trả phòng']}
                  value={dates}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  onChange={(val) => setDates(val)}
                />
              </Col>
              <Col xs={24} md={4}>
                <Button
                  size="large"
                  type="primary"
                  block
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  style={{ borderRadius: '8px', height: '45px', fontWeight: 'bold' }}
                >
                  TÌM KIẾM
                </Button>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Section khách sạn tiêu biểu */}
        <div style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <Title level={2} style={{ marginBottom: 0 }}>
                <FireOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                Khách sạn nổi bật
              </Title>
              <Text type="secondary">Những địa điểm được khách hàng yêu thích nhất trong tuần qua</Text>
            </div>
            <Button type="link" size="large" onClick={() => navigate('/hotels')} style={{ fontWeight: 600 }}>
              Xem tất cả ưu đãi
            </Button>
          </div>

          <Row gutter={[24, 24]}>
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <Col xs={24} sm={12} md={6} key={i}>
                  <Card variant="none" cover={<Skeleton.Image style={{ width: '100%', height: 220 }} active />}>
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </Card>
                </Col>
              ))
            ) : featuredHotels.length > 0 ? (
              featuredHotels.map((hotel) => (
                <Col xs={24} sm={12} md={6} key={hotel.id_hotel}>
                  <Card
                    hoverable
                    onClick={() => navigate(`/hotel/${hotel.id_hotel}`)}
                    cover={
                      <div style={{ overflow: 'hidden', height: 220 }}>
                        <img 
                          alt={hotel.hotel_name} 
                          src={hotel.image_url} 
                          className="hotel-card-image"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} 
                        />
                      </div>
                    }
                    style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0f0f0' }}
                  >
                    <Text type="secondary" style={{ fontSize: 12 }}><EnvironmentOutlined /> {hotel.location_city}</Text>
                    <Title level={5} style={{ margin: '8px 0', height: '44px', overflow: 'hidden', lineHeight: '1.4' }}>{hotel.hotel_name}</Title>
                    <Rate disabled defaultValue={hotel.rate_star} style={{ fontSize: '13px' }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px' }}>
                      <div>
                        <Text type="danger" style={{ fontSize: '20px', fontWeight: 700 }}>
                          {hotel.price_per_night.toLocaleString()}₫
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px', marginLeft: 4 }}>/ đêm</Text>
                      </div>
                      <Button type="primary" shape="round" size="small">Đặt ngay</Button>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24}><Empty description="Chưa có khách sạn nào được cập nhật." /></Col>
            )}
          </Row>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', padding: '60px 0', background: '#1a1a1a', color: 'rgba(255,255,255,0.6)' }}>
        <Title level={4} style={{ color: '#fff', marginBottom: 20 }}>HOTEL BOOKING SYSTEM</Title>
        <Text style={{ color: 'rgba(255,255,255,0.4)' }}>
          © 2026 - Phát triển bởi Sơn & Team. All Rights Reserved.
        </Text>
      </Footer>

      <style>{`
        .ant-card:hover .hotel-card-image {
          transform: scale(1.1);
        }
      `}</style>
    </Layout>
  );
};

export default Home;