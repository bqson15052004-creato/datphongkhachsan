import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Row, Col, Card, Rate, Typography, Tag, Empty, Button, Space, Spin } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, RocketOutlined, HomeOutlined } from '@ant-design/icons';
import axios from 'axios';
import Navbar from '../../components/common/Navbar';

const { Content } = Layout;
const { Title, Text } = Typography;

const HotelList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const q = query.get('q') || '';
  const from = query.get('from');
  const to = query.get('to');

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/hotels/rooms/', {
          params: { search: q, from_date: from, to_date: to }
        });
        setRooms(response.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách phòng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [q, from, to]);

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <Content style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px', width: '100%' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              {q ? `Kết quả cho "${q}"` : 'Khám phá điểm đến lý tưởng'}
            </Title>
            <Text type="secondary">Tìm thấy {rooms.length} phòng trống phù hợp với bạn</Text>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" tip="Đang tìm phòng tốt nhất..." /></div>
        ) : rooms.length === 0 ? (
          <Empty description="Rất tiếc, không tìm thấy phòng nào phù hợp với yêu cầu của bạn." />
        ) : (
          <Row gutter={[24, 24]}>
            {rooms.map(room => (
              <Col xs={24} key={room.id}>
                <Card
                  hoverable
                  style={{ borderRadius: 16, overflow: 'hidden', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                  bodyStyle={{ padding: 0 }}
                  // Bấm vào sẽ chuyển sang trang chi tiết phòng đó
                  onClick={() => navigate(`/hotel/${room.id}`)} 
                >
                  <Row>
                    {/* HÌNH ẢNH BÊN TRÁI */}
                    <Col xs={24} sm={8}>
                      <div style={{ position: 'relative', height: '100%' }}>
                        <img 
                          src={room.image || 'https://via.placeholder.com/400x300?text=Chưa+có+ảnh'} 
                          alt={`Phòng ${room.room_number}`} 
                          style={{ width: '100%', height: '100%', minHeight: '220px', objectFit: 'cover' }} 
                        />
                        {/* Gắn tag ngẫu nhiên hoặc theo giá để giao diện sinh động */}
                        {room.price > 1000000 && (
                          <Tag color="gold" style={{ position: 'absolute', top: 12, left: 12, margin: 0, borderRadius: 4 }}>
                            <RocketOutlined /> Phổ biến nhất
                          </Tag>
                        )}
                      </div>
                    </Col>

                    {/* NỘI DUNG BÊN PHẢI */}
                    <Col xs={24} sm={16} style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            {/* Hiển thị Tên Khách sạn + Số phòng */}
                            <Title level={3} style={{ margin: 0, color: '#1f2937' }}>
                              Khách sạn {room.hotel_owner_name}
                            </Title>
                            <Tag color="cyan" style={{ marginTop: 8 }}><HomeOutlined /> Phòng: {room.room_number}</Tag>
                          </div>
                          
                          <div style={{ textAlign: 'right' }}>
                            <Text strong style={{ fontSize: 22, color: '#ff4d4f' }}>
                              {room.price ? `${parseFloat(room.price).toLocaleString()} ₫` : 'Liên hệ'}
                            </Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 13 }}>/ đêm</Text>
                          </div>
                        </div>

                        <Space direction="vertical" size={6} style={{ marginTop: 16 }}>
                          <Text type="secondary">
                            <EnvironmentOutlined /> Thuộc hệ thống đối tác của nền tảng
                          </Text>
                          {/* Mặc định 5 sao cho đẹp UI, vì Review mình chưa tính trung bình */}
                          <Rate disabled defaultValue={5} style={{ fontSize: 14 }} />
                        </Space>

                        <div style={{ marginTop: 16 }}>
                          {/* Hiển thị loại phòng (VIP, Thường, Đôi,...) */}
                          <Text strong style={{ fontSize: 15 }}>Hạng phòng: {room.room_type_name}</Text>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                        <Space>
                          <Tag icon={<CalendarOutlined />} color="blue">Đặt ngay, thanh toán sau</Tag>
                          {room.is_available && <Tag color="green">Đang trống</Tag>}
                        </Space>
                        <Button type="primary" size="large" shape="round" style={{ paddingInline: 32 }}>
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
    </Layout>
  );
};

export default HotelList;