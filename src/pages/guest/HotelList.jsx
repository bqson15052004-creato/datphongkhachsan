import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Rate, Typography, Tag, Empty, Button, Space, Spin, App as AntApp, Badge } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, RightOutlined, InfoCircleOutlined } from '@ant-design/icons';

// IMPORT MOCK DATA
import { MOCK_ROOMS, MOCK_HOTELS } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;

const HotelList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { message: antdMessage } = AntApp.useApp();
  
  const query = new URLSearchParams(location.search);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchLocation = query.get('location') || '';
  const checkIn = query.get('check_in');
  const checkOut = query.get('check_out');

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      
      // Giả lập logic lấy dữ liệu (sau này thay bằng gọi API thật)
      const loadData = () => {
        let mappedRooms = MOCK_ROOMS.map(room => {
          const hotel = MOCK_HOTELS.find(h => h.id_hotel === room.id_hotel);
          return {
            ...room,
            hotel_name: hotel?.hotel_name || 'Khách sạn Partner',
            location_city: hotel?.location_city || 'Việt Nam',
            rating: hotel?.rate_star || 5,
            room_type_name: room.room_type,
            image: room.image_url
          };
        });

        if (searchLocation) {
          mappedRooms = mappedRooms.filter(r => 
            r.location_city?.toLowerCase().includes(searchLocation.toLowerCase())
          );
        }
        setRooms(mappedRooms);
      };

      try {
        loadData();
      } catch (error) {
        antdMessage.error("Không thể tải danh sách phòng.");
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    
    fetchRooms();
  }, [searchLocation, checkIn, checkOut, antdMessage]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', paddingBottom: 40 }}>
      
      {/* SECTION: TIÊU ĐỀ */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8, color: '#1e293b' }}>
          {searchLocation ? `Phòng trống tại ${searchLocation}` : 'Khám phá điểm đến lý tưởng'}
        </Title>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Space>
            <Badge status="processing" color="#10b981" />
            <Text type="secondary">Tìm thấy {rooms.length} lựa chọn phù hợp</Text>
            {checkIn && <Tag icon={<CalendarOutlined />} color="blue">{checkIn} — {checkOut}</Tag>}
          </Space>
          
          {/* Một cái Banner nhỏ mời gọi Guest đăng nhập */}
          <Tag color="warning" icon={<InfoCircleOutlined />} style={{ padding: '4px 12px', borderRadius: 20 }}>
            Đăng nhập để nhận ưu đãi giảm giá lên đến 20%
          </Tag>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <Spin size="large" tip="Đang tìm kiếm phòng tốt nhất..." />
        </div>
      ) : rooms.length === 0 ? (
        <Card bordered={false} style={{ borderRadius: 16, textAlign: 'center', padding: '60px 0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Empty description="Rất tiếc, chúng tôi không tìm thấy phòng phù hợp tại đây.">
            <Button type="primary" size="large" shape="round" onClick={() => navigate('/')}>Thử tìm địa điểm khác</Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[0, 24]}>
          {rooms.map(room => (
            <Col span={24} key={room.id_room}>
              <Card
                hoverable
                className="hotel-list-card"
                onClick={() => navigate(`/hotel/${room.id_hotel}`)}
                style={{ borderRadius: 20, border: '1px solid #f1f5f9', overflow: 'hidden' }}
                styles={{ body: { padding: 0 } }}
              >
                <Row>
                  {/* Ảnh bên trái */}
                  <Col xs={24} sm={9} md={8}>
                    <div style={{ overflow: 'hidden', height: '100%', minHeight: '220px' }}>
                      <img
                        src={room.image || 'https://via.placeholder.com/400x300'}
                        alt={room.hotel_name}
                        className="room-img"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      />
                    </div>
                  </Col>

                  {/* Nội dung bên phải */}
                  <Col xs={24} sm={15} md={16} style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <Title level={3} style={{ margin: '0 0 8px 0', fontSize: 20 }}>{room.hotel_name}</Title>
                          <Space direction="vertical" size={2}>
                            <Rate disabled defaultValue={room.rating} style={{ fontSize: 12 }} />
                            <Text type="secondary">
                              <EnvironmentOutlined /> {room.location_city}
                            </Text>
                          </Space>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>Chỉ từ</Text>
                          <div style={{ color: '#e11d48', fontSize: 24, fontWeight: 800 }}>
                            {Number(room.price_per_night).toLocaleString()}₫
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                      <Space wrap>
                        <Tag bordered={false} color="cyan">Gần trung tâm</Tag>
                        <Tag bordered={false} color="green">Bữa sáng miễn phí</Tag>
                      </Space>
                      <Button 
                        type="primary" 
                        size="large" 
                        shape="round" 
                        icon={<RightOutlined />} 
                        iconPosition="end"
                        style={{ fontWeight: 600 }}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* STYLE CHO HOVER EFFECT */}
      <style>{`
        .hotel-list-card:hover .room-img { transform: scale(1.08); }
        .hotel-list-card { transition: all 0.3s ease; }
        .hotel-list-card:hover { 
          box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
          border-color: #1890ff !important;
        }
      `}</style>
    </div>
  );
};

export default HotelList;