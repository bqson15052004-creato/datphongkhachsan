import React, { useState, useEffect } from 'react';
import { Input, Button, Typography, Row, Col, Card, Rate, Skeleton, Space, Tag } from 'antd';
import { 
  SearchOutlined, 
  EnvironmentOutlined, 
  FireOutlined, 
  RightOutlined, 
  CompassOutlined, 
  AppstoreOutlined,
  PercentageOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import beachh from '../../assets/beachh.jpg';

// 1. KẾT NỐI DỮ LIỆU
import { MOCK_HOTELS } from '../../constants/mockData.jsx'; 

const { Title, Text } = Typography;

// Dữ liệu danh mục
const PROPERTY_TYPES = [
  { title: 'Khách sạn', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80' },
  { title: 'Căn hộ', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80' },
  { title: 'Resort', img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=500&q=80' },
  { title: 'Biệt thự', img: 'https://images.unsplash.com/photo-1613490908592-5b90f421fbc6?w=500&q=80' },
];

const DESTINATIONS = [
  { city: 'TP. Hồ Chí Minh', count: '6.298', img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=500&q=80' },
  { city: 'Hà Nội', count: '5.570', img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=500&q=80' },
  { city: 'Đà Nẵng', count: '2.256', img: 'https://images.unsplash.com/photo-1559506401-447a11c81735?w=500&q=80' },
  { city: 'Đà Lạt', count: '1.754', img: 'https://images.unsplash.com/photo-1582570081223-9126d40f2b2b?w=500&q=80' },
  { city: 'Vũng Tàu', count: '1.757', img: 'https://images.unsplash.com/photo-1583483425010-c566431a7710?w=500&q=80' },
  { city: 'Nha Trang', count: '1.057', img: 'https://images.unsplash.com/photo-1580210217983-5858eeef0865?w=500&q=80' },
];

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [discountHotels, setDiscountHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        const processedData = MOCK_HOTELS.map(h => ({
          ...h,
          discount_percent: h.discount_percent || Math.floor(Math.random() * 30) + 10 
        }));

        setFeaturedHotels(processedData.slice(0, 4));
        const sortedByDiscount = [...processedData].sort((a, b) => b.discount_percent - a.discount_percent);
        setDiscountHotels(sortedByDiscount.slice(0, 4));
        setLoading(false);
      }, 600);
    };
    fetchData();
  }, []);

  // --- CẬP NHẬT ĐIỀU HƯỚNG SANG CỤM /CUSTOMER ---
  const handleNavigate = (filters) => {
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.type) params.set('type', filters.type);
    navigate(`/customer/hotels?${params.toString()}`); // Đã thêm /customer
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      
      {/* 1. HERO SECTION */}
      <div style={{
        position: 'relative',
        background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url(${beachh}) no-repeat center/cover`,
        padding: '10px 10px',
        textAlign: 'center',
        color: '#fff',
        borderRadius: '0 0 20px 20px',
        marginBottom: '40px'
      }}>
        <Title style={{ color: '#fff', fontSize: 'clamp(32px, 5vw, 36px)', fontWeight: 700, marginBottom: '0px' }}>
          Tận hưởng kỳ nghỉ tuyệt vời
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', display: 'block', marginBottom: '20px' }}>
          Với hàng nghìn khách sạn chờ đón
        </Text>

        <Card 
          variant={false} 
          styles={{ body: { padding: '12px 20px' } }}
          style={{ 
            maxWidth: '700px', 
            margin: '0 auto', 
            borderRadius: '12px', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)' 
          }}
        >
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} md={19}>
              <Input 
                size="large" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                onPressEnter={() => handleNavigate({ location: query })}
                placeholder="Bạn muốn nghỉ dưỡng ở đâu?" 
                prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />} 
                style={{ borderRadius: '8px', height: '45px' }}
              />
            </Col>
            <Col xs={24} md={5}>
              <Button
                type="primary"
                block
                icon={<SearchOutlined />}
                onClick={() => handleNavigate({ location: query })}
                style={{ borderRadius: '8px', height: '45px', fontWeight: '600' }}
              >
                TÌM KIẾM
              </Button>
            </Col>
          </Row>
        </Card>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* 2. SECTION: TÌM THEO LOẠI CHỖ NGHỈ */}
        <div style={{ marginBottom: '50px' }}>
          <Title level={3} style={{ marginBottom: '24px' }}>
            <AppstoreOutlined style={{ color: '#1890ff', marginRight: 10 }} /> 
            Tìm theo loại chỗ nghỉ
          </Title>
          <Row gutter={[16, 16]}>
            {PROPERTY_TYPES.map((type, index) => (
              <Col xs={12} sm={6} key={index}>
                <div style={{ cursor: 'pointer' }} className="hover-scale-card" onClick={() => handleNavigate({ type: type.title })}>
                  <div style={{ overflow: 'hidden', borderRadius: '12px', marginBottom: '8px', height: '160px' }}>
                    <img src={type.img} alt={type.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="zoom-img"/>
                  </div>
                  <Text strong style={{ fontSize: '16px' }}>{type.title}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* 3. SECTION: KHÁM PHÁ VIỆT NAM */}
        <div style={{ marginBottom: '60px' }}>
          <Title level={3} style={{ margin: '0 0 4px 0' }}>
            <CompassOutlined style={{ color: '#fa8c16', marginRight: 10 }} /> 
            Khám phá Việt Nam
          </Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>Các điểm đến phổ biến có nhiều điều chờ đón bạn</Text>
          <Row gutter={[16, 16]}>
            {DESTINATIONS.map((dest, index) => (
              <Col xs={12} sm={8} md={4} key={index}>
                <div style={{ cursor: 'pointer' }} className="hover-scale-card" onClick={() => handleNavigate({ location: dest.city })}>
                  <div style={{ overflow: 'hidden', borderRadius: '12px', marginBottom: '8px', height: '130px' }}>
                    <img src={dest.img} alt={dest.city} style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="zoom-img"/>
                  </div>
                  <Text strong style={{ display: 'block', fontSize: '15px' }}>{dest.city}</Text>
                  <Text type="secondary" style={{ fontSize: '13px' }}>{dest.count} chỗ nghỉ</Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* 4. SECTION: ƯU ĐÃI LỚN NHẤT */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <PercentageOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
            <Title level={3} style={{ margin: 0 }}>Ưu đãi cực hời</Title>
            <Tag color="red">GIẢM NHIỀU NHẤT</Tag>
          </div>
          <Row gutter={[20, 20]}>
            {loading ? (
              [1, 2, 3, 4].map(i => <Col xs={12} md={6} key={i}><Skeleton active /></Col>)
            ) : (
              discountHotels.map((hotel) => (
                <Col xs={12} md={6} key={hotel.id_hotel}>
                  <Card
                    hoverable
                    styles={{ body: { padding: '12px' } }}
                    // ĐÃ CẬP NHẬT ĐƯỜNG DẪN CHI TIẾT
                    onClick={() => navigate(`/customer/hotel/${hotel.id_hotel}`)}
                    cover={
                      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                        <img src={hotel.image_url} alt={hotel.hotel_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="zoom-img"/>
                        <div style={{ 
                          position: 'absolute', top: 0, right: 0, background: '#ff4d4f', color: '#fff', 
                          padding: '4px 12px', fontWeight: 'bold', borderBottomLeftRadius: '12px' 
                        }}>
                          -{hotel.discount_percent}%
                        </div>
                      </div>
                    }
                    style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #ffccc7' }}
                  >
                    <Text strong ellipsis style={{ display: 'block' }}>{hotel.hotel_name}</Text>
                    <Space align="center" style={{ marginTop: '8px' }}>
                      <Text delete type="secondary" style={{ fontSize: '12px' }}>
                        {(hotel.price_per_night * 1.3).toLocaleString()}₫
                      </Text>
                      <Text type="danger" strong style={{ fontSize: '17px' }}>
                        {hotel.price_per_night?.toLocaleString()}₫
                      </Text>
                    </Space>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>

        {/* 5. SECTION: ĐỀ XUẤT CHO BẠN */}
        <div style={{ paddingBottom: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                <FireOutlined style={{ color: '#ff4d4f', marginRight: 10 }} />
                Đề xuất cho bạn
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>Dựa trên xu hướng du lịch năm 2026</Text>
            </div>
            {/* ĐÃ CẬP NHẬT ĐƯỜNG DẪN XEM TẤT CẢ */}
            <Button type="link" onClick={() => navigate('/customer/hotels')} style={{ fontWeight: 600 }}>
              Xem tất cả <RightOutlined style={{ fontSize: 12 }} />
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
            ) : (
              featuredHotels.map((hotel) => (
                <Col xs={24} sm={12} md={6} key={hotel.id_hotel}>
                  <Card
                    hoverable
                    // ĐÃ CẬP NHẬT ĐƯỜNG DẪN CHI TIẾT
                    onClick={() => navigate(`/customer/hotel/${hotel.id_hotel}`)}
                    cover={
                      <div style={{ overflow: 'hidden', height: 220, position: 'relative' }}>
                        <img 
                          alt={hotel.hotel_name} src={hotel.image_url} 
                          className="zoom-img"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} 
                        />
                        <Tag color="rgba(0,0,0,0.6)" style={{ position: 'absolute', top: 12, left: 12, border: 'none', backdropFilter: 'blur(4px)' }}>
                           <EnvironmentOutlined /> {hotel.location_city}
                        </Tag>
                      </div>
                    }
                    style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #f1f5f9' }}
                    actions={[
                      <Text key="book" style={{ color: '#1890ff', fontWeight: 700 }}>ĐẶT NGAY</Text>
                    ]}
                  >
                    <Title level={5} style={{ margin: '0 0 8px 0', height: '44px', overflow: 'hidden' }}>{hotel.hotel_name}</Title>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <Rate disabled defaultValue={hotel.rate_star} style={{ fontSize: '12px' }} />
                       <Text type="danger" style={{ fontSize: '18px', fontWeight: 700 }}>
                          {hotel.price_per_night?.toLocaleString()}₫
                        </Text>
                    </div>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
      </div>

      <style>{`
        .zoom-img { transition: transform 0.3s; }
        .hover-scale-card:hover .zoom-img { transform: scale(1.1); }
        .hover-scale-card:hover span { color: #1890ff; }
        .ant-card { transition: all 0.3s ease; }
        .ant-card:hover { transform: translateY(-8px); box-shadow: 0 12px 30px rgba(0,0,0,0.1) !important; }
        .ant-card-actions { background: #fafafa; border-top: 1px solid #f0f0f0; }
      `}</style>
    </div>
  );
};

export default Home;