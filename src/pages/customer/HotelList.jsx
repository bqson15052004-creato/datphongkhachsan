import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Row, Col, Card, Rate, Typography, Tag, Empty, Button, Space, Spin, App as AntApp, Badge } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, RocketOutlined, RightOutlined, CoffeeOutlined, WifiOutlined } from '@ant-design/icons';
import axiosClient from '../../services/axiosClient';
import Navbar from '../../components/common/Navbar';

const { Content } = Layout;
const { Title, Text } = Typography;

// DỮ LIỆU MẪU (MOCK DATA) - Tự động hiển thị khi Backend chưa chạy
const MOCK_ROOMS = [
  {
    id_room: 1,
    hotel_name: "Khách Sạn Grand Plaza",
    room_number: "P.501",
    room_type_name: "Phòng Suite Hướng Biển",
    price_per_night: 2500000,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500",
    is_available: true,
    location_city: "Đà Nẵng",
    rating: 5
  },
  {
    id_room: 2,
    hotel_name: "Silk Path Boutique",
    room_number: "P.302",
    room_type_name: "Phòng Deluxe Đôi",
    price_per_night: 1200000,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500",
    is_available: true,
    location_city: "Hà Nội",
    rating: 4.5
  },
  {
    id_room: 3,
    hotel_name: "Hải Sản Hotel & Spa",
    room_number: "P.105",
    room_type_name: "Phòng Tiêu Chuẩn",
    price_per_night: 850000,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500",
    is_available: true,
    location_city: "Nha Trang",
    rating: 4
  }
];

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
      try {
        const response = await axiosClient.get('/hotels/rooms/', {
          params: { 
            location: searchLocation, 
            check_in: checkIn, 
            check_out: checkOut 
          }
        });
        // Nếu API trả về thành công
        const data = Array.isArray(response) ? response : response.data || [];
        setRooms(data.length > 0 ? data : MOCK_ROOMS); // Nếu API trống thì dùng Mock cho đẹp giao diện
      } catch (error) {
        console.warn("Backend chưa kết nối. Đang hiển thị dữ liệu mẫu.");
        setRooms(MOCK_ROOMS); // Gán dữ liệu mẫu khi lỗi BE
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [searchLocation, checkIn, checkOut]);

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <Content style={{ maxWidth: 1100, margin: '30px auto', padding: '0 20px', width: '100%' }}>
        
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
              <Button type="primary" size="large" shape="round" onClick={() => navigate('/')}>Quay về trang chủ</Button>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[0, 24]}>
            {rooms.map(room => (
              <Col span={24} key={room.id_room}>
                <Card
                  hoverable
                  className="hotel-list-card"
                  onClick={() => navigate(`/hotel/${room.id_room}`)}
                  style={{ borderRadius: 20, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  bodyStyle={{ padding: 0 }}
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

                        <div style={{ marginTop: 16, padding: '16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                          <Text strong style={{ fontSize: 15, color: '#334155' }}>{room.room_type_name} (Mã: {room.room_number})</Text>
                          <br />
                          <Space style={{ marginTop: 8, color: '#64748b' }} size="large">
                             <span><WifiOutlined /> Wifi Miễn Phí</span>
                             <span><CoffeeOutlined /> Bữa sáng nhẹ</span>
                          </Space>
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
                          iconPosition="right"
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
      </Content>

      {/* CSS HOVER HIỆU ỨNG */}
      <style>{`
        .hotel-list-card:hover .room-img {
          transform: scale(1.1);
        }
        .hotel-list-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hotel-list-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important;
          border-color: #3b82f6 !important;
        }
      `}</style>
    </Layout>
  );
};

export default HotelList;