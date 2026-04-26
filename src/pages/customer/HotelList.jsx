import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Rate, Typography, Tag, Empty, Button, Space, Spin, App as AntApp, Badge } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, RocketOutlined, RightOutlined } from '@ant-design/icons';
// import axiosClient from '../../services/axiosClient';
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
      const loadMockData = (reason = "Yêu cầu") => {
        let mappedRooms = MOCK_ROOMS.map(room => {
          const hotel = MOCK_HOTELS.find(h => h.id_hotel === room.id_hotel);
          return {
            ...room,
            hotel_name: hotel?.hotel_name || 'Khách sạn Partner',
            location_city: hotel?.location_city || 'Việt Nam',
            rating: hotel?.rate_star || 5,
            room_type_name: room.room_type,
            room_number: room.id_room,
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
        // Code gọi API thật của ông giữ nguyên ở đây
        loadMockData("Đang trong quá trình phát triển UI");
      } catch (error) {
        loadMockData("Lỗi kết nối Backend");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    
    fetchRooms();
  }, [searchLocation, checkIn, checkOut]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
      
      {/* TIÊU ĐỀ & TRẠNG THÁI */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8, color: '#1e293b' }}>
          {searchLocation ? `Phòng trống tại ${searchLocation}` : 'Khám phá không gian nghỉ dưỡng'}
        </Title>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Badge status="processing" color="#10b981" />
            <Text type="secondary">Tìm thấy {rooms.length} lựa chọn tốt nhất dành cho bạn</Text>
            {checkIn && <Tag icon={<CalendarOutlined />} color="blue">{checkIn} — {checkOut}</Tag>}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <Spin size="large" tip="Đang tìm kiếm phòng trống tốt nhất..." />
        </div>
      ) : rooms.length === 0 ? (
        <Card bordered={false} style={{ borderRadius: 16, textAlign: 'center', padding: '60px 0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Empty 
            description={
              <Text type="secondary" style={{ fontSize: 16 }}>
                Rất tiếc, hiện không có phòng nào tại <strong>{searchLocation}</strong> phù hợp.<br/>
                Vui lòng chọn địa điểm khác hoặc thay đổi thời gian.
              </Text>
            } 
          >
            <Button type="primary" size="large" shape="round" onClick={() => navigate('/customer/home')}>Quay về trang chủ</Button>
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
                style={{ borderRadius: 20, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                styles={{ body: { padding: 0 } }}
              >
                <Row>
                  {/* KHỐI ẢNH */}
                  <Col xs={24} sm={9} md={8} lg={7}>
                    <div style={{ overflow: 'hidden', height: '100%', position: 'relative' }}>
                      <img
                        src={room.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'}
                        alt={room.hotel_name}
                        className="room-img"
                        style={{ width: '100%', height: '100%', minHeight: '260px', objectFit: 'cover', transition: 'transform 0.5s' }}
                      />
                      {room.price_per_night > 2000000 && (
                        <div style={{ position: 'absolute', top: 16, left: 16 }}>
                          <Tag color="gold" style={{ border: 'none', padding: '4px 12px', fontWeight: 600, borderRadius: 8 }}>
                             <RocketOutlined /> PHỔ BIẾN
                          </Tag>
                        </div>
                      )}
                    </div>
                  </Col>

                  {/* KHỐI THÔNG TIN */}
                  <Col xs={24} sm={15} md={16} lg={17} style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <Title level={3} style={{ margin: '0 0 8px 0', fontSize: 22, color: '#0f172a' }}>{room.hotel_name}</Title>
                          <Space wrap style={{ marginBottom: 12 }}>
                            <Rate disabled defaultValue={room.rating || 5} style={{ fontSize: 12 }} />
                            <Text style={{ fontSize: 14, color: '#64748b' }}>
                              <EnvironmentOutlined style={{ marginRight: 4 }} /> {room.location_city || 'Khu vực trung tâm'}
                            </Text>
                          </Space>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Giá mỗi đêm từ</Text>
                          <Text style={{ color: '#e11d48', fontSize: 26, fontWeight: 800 }}>
                            {parseFloat(room.price_per_night).toLocaleString()}₫
                          </Text>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                      <Space size="middle">
                        <Tag color="cyan" style={{ border: 'none', padding: '2px 10px' }}>Hỗ trợ 24/7</Tag>
                        <Tag color="green" style={{ border: 'none', padding: '2px 10px' }}>Xác nhận tức thì</Tag>
                      </Space>
                      <Button 
                        type="primary" 
                        size="large" 
                        shape="round" 
                        icon={<RightOutlined />} 
                        iconPosition="end"
                        style={{ padding: '0 30px', height: 45, fontWeight: 600, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
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

      {/* CSS HOVER HIỆU ỨNG */}
      <style>{`
        .hotel-list-card:hover .room-img { transform: scale(1.1); }
        .hotel-list-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hotel-list-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important;
          border-color: #3b82f6 !important;
        }
      `}</style>
    </div>
  );
};

export default HotelList;