import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Typography, Row, Col, Card, Rate, DatePicker, Skeleton, Empty, Space, Divider } from 'antd';
import { SearchOutlined, EnvironmentOutlined, FireOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import beachh from '../../assets/beachh.jpg';

const { Content, Footer } = Layout;
const { Title, Text, Link } = Typography;

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
          padding: '10px 20px',
          textAlign: 'center',
        }}>
          <Title style={{ color: '#fff', fontSize: '48px', fontWeight: 700, marginBottom: '0px' }}>
            Tận hưởng kỳ nghỉ tuyệt vời
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '20px', display: 'block', marginBottom: '0px' }}>
            Với hàng nghìn khách sạn đang chờ đón bạn
          </Text>

          {/* Thanh Search */}
          <Card variant={false} style={{ maxWidth: '1000px', margin: '0 auto', borderRadius: '16px', boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={20}>
                <Input 
                  size="large" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder="Bạn muốn đi đâu? (Đà Nẵng, Phú Quốc...)" 
                  prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />} 
                  style={{ borderRadius: '8px' }}
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
              <Text type="secondary">Những địa điểm được khách hàng yêu thích nhất</Text>
            </div>
            
            <Button 
              type="link" 
              size="large" 
              onClick={() => navigate('/hotels')} 
              style={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}
            >
              Xem tất cả khách sạn <RightOutlined style={{ fontSize: 12, marginLeft: 4 }} />
            </Button>
          </div>

          <Row gutter={[24, 24]}>
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <Col xs={24} sm={12} md={6} key={i}>
                  <Card variant={false} cover={<Skeleton.Image style={{ width: '100%', height: 220 }} active />}>
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
                      
                      <Button 
                        type="primary" 
                        shape="round" 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/hotel/${hotel.id_hotel}`);
                        }}
                      >
                        Xem chi tiết
                      </Button>
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

      {/* FOOTER MỚI ĐA DẠNG NHƯ BOOKING.COM */}
      <Footer style={{ background: '#f5f5f5', padding: '60px 0 20px', borderTop: '1px solid #e8e8e8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          
          <Row gutter={[32, 32]}>
            {/* Cột 1: Hỗ trợ */}
            <Col xs={24} sm={12} md={5}>
              <Title level={5} style={{ fontSize: '15px', marginBottom: '16px' }}>Hỗ trợ</Title>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Quản lý các chuyến đi của bạn</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Liên hệ Dịch vụ Khách hàng</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Trung tâm thông tin bảo mật</Link>
              </Space>
            </Col>
            
            {/* Cột 2: Khám phá */}
            <Col xs={24} sm={12} md={5}>
              <Title level={5} style={{ fontSize: '15px', marginBottom: '16px' }}>Khám phá thêm</Title>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Chương trình khách hàng thân thiết</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Ưu đãi theo mùa và dịp lễ</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Bài viết về du lịch</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Dành cho Doanh Nghiệp</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Tìm chuyến bay</Link>
              </Space>
            </Col>

            {/* Cột 3: Điều khoản */}
            <Col xs={24} sm={12} md={5}>
              <Title level={5} style={{ fontSize: '15px', marginBottom: '16px' }}>Điều khoản và cài đặt</Title>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Chính sách Bảo mật</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Điều khoản dịch vụ</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Tranh chấp đối tác</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Chính sách chống Nô lệ Hiện đại</Link>
              </Space>
            </Col>

            {/* Cột 4: Đối tác */}
            <Col xs={24} sm={12} md={5}>
              <Title level={5} style={{ fontSize: '15px', marginBottom: '16px' }}>Dành cho đối tác</Title>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Đăng nhập vào trang Extranet</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Trợ giúp đối tác</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Đăng chỗ nghỉ của Quý vị</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Trở thành đối tác phân phối</Link>
              </Space>
            </Col>

            {/* Cột 5: Về chúng tôi */}
            <Col xs={24} sm={12} md={4}>
              <Title level={5} style={{ fontSize: '15px', marginBottom: '16px' }}>Về chúng tôi</Title>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Về hệ thống</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Cách chúng tôi hoạt động</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Du lịch bền vững</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Truyền thông</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '14px' }}>Liên hệ công ty</Link>
              </Space>
            </Col>
          </Row>

          <Divider style={{ borderColor: '#d9d9d9', margin: '40px 0 20px' }} />

          {/* Bản quyền và các Logo dịch vụ */}
          <div style={{ textAlign: 'center' }}>
            <Text style={{ color: '#595959', fontSize: '12px', display: 'block', marginBottom: '20px' }}>
              Hệ thống đặt phòng trực tuyến là một phần của dự án thực hành. <br/>
              Bản quyền © 2026 - Phát triển bởi Nhóm 2 người.
            </Text>
            
            <Space size="large" align="center" wrap style={{ opacity: 0.8, justifyContent: 'center' }}>
               <Title level={4} style={{ margin: 0, color: '#003580', fontWeight: 800 }}>Booking.com</Title>
               <Title level={4} style={{ margin: 0, color: '#006CE4', fontWeight: 800, fontStyle: 'italic' }}>priceline</Title>
               <Title level={4} style={{ margin: 0, color: '#FF690F', fontWeight: 800 }}>KAYAK</Title>
               <Title level={4} style={{ margin: 0, color: '#000', fontWeight: 800 }}>agoda</Title>
               <Title level={4} style={{ margin: 0, color: '#DA3743', fontWeight: 800 }}>OpenTable</Title>
            </Space>
          </div>

        </div>
      </Footer>

      <style>{`
        .ant-card:hover .hotel-card-image {
          transform: scale(1.1);
        }
        .ant-card {
          transition: all 0.3s ease;
        }
        .ant-card:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }
        .ant-typography a:hover {
          text-decoration: underline;
        }
      `}</style>
    </Layout>
  );
};

export default Home;