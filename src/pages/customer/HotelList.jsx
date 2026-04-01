import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Row, Col, Card, Rate, Typography, Tag, Empty, Button, Space, Spin } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, RocketOutlined, HomeOutlined, ThunderboltOutlined } from '@ant-design/icons';
import axiosClient from '../../services/axiosClient';
import Navbar from '../../components/common/Navbar';

const { Content } = Layout;
const { Title, Text } = Typography;

const HotelList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const search_params = new URLSearchParams(location.search);
  
  const [room_list, set_room_list] = useState([]);
  const [is_loading, set_is_loading] = useState(true);

  // Lấy params từ URL (do trang Home truyền sang)
  const q = search_params.get('q') || '';
  const from_date = search_params.get('from');
  const to_date = search_params.get('to');

  useEffect(() => {
    const fetch_rooms = async () => {
      set_is_loading(true);
      try {
        const response = await axiosClient.get('/hotels/rooms/', {
          params: { 
            search: q, 
            from_date: from_date, 
            to_date: to_date 
          }
        });
        set_room_list(response);
      } catch (error) {
        console.error("Lỗi lấy danh sách phòng:", error);
      } finally {
        set_is_loading(false);
      }
    };
    fetch_rooms();
  }, [q, from_date, to_date]);

  return (
    <Layout style={main_layout_style}>
      <Navbar />
      <Content style={content_container_style}>
        
        {/* Header Section */}
        <div style={header_wrapper_style}>
          <div>
            <Title level={2} style={no_margin_style}>
              {q ? `Kết quả cho "${q}"` : 'Khám phá điểm đến lý tưởng'}
            </Title>
            <Text type="secondary">Tìm thấy {room_list.length} phòng trống phù hợp với bạn</Text>
          </div>
        </div>

        {is_loading ? (
          <div style={loading_state_style}>
            <Spin size="large" tip="Đang tìm phòng tốt nhất cho bạn..." />
          </div>
        ) : room_list.length === 0 ? (
          <Card style={empty_card_style}>
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Rất tiếc, không tìm thấy phòng nào phù hợp với yêu cầu của bạn tại thời điểm này." 
            />
          </Card>
        ) : (
          <Row gutter={[0, 24]}>
            {room_list.map(room => (
              <Col span={24} key={room.id}>
                <Card
                  hoverable
                  style={hotel_card_style}
                  bodyStyle={no_padding_style}
                  onClick={() => navigate(`/hotel/${room.id}`)} 
                >
                  <Row>
                    {/* HÌNH ẢNH */}
                    <Col xs={24} sm={8}>
                      <div style={image_wrapper_style}>
                        <img 
                          src={room.image || 'https://via.placeholder.com/400x300?text=Chưa+có+ảnh'} 
                          alt={`Phòng ${room.room_number}`} 
                          style={image_style} 
                        />
                        {room.price > 2000000 && (
                          <Tag color="gold" style={popular_tag_style}>
                            <RocketOutlined /> Phổ biến nhất
                          </Tag>
                        )}
                      </div>
                    </Col>

                    {/* NỘI DUNG */}
                    <Col xs={24} sm={16} style={content_col_style}>
                      <div style={full_width_style}>
                        <div style={flex_between_style}>
                          <div style={{ flex: 1 }}>
                            <Title level={3} style={hotel_name_style}>
                              Khách sạn {room.hotel_owner_name}
                            </Title>
                            <Space wrap>
                              <Tag color="cyan"><HomeOutlined /> Phòng: {room.room_number}</Tag>
                              <Tag color="blue" icon={<ThunderboltOutlined />}>{room.room_type_name}</Tag>
                            </Space>
                          </div>
                          
                          <div style={price_wrapper_style}>
                            <Text type="danger" strong style={price_text_style}>
                              {room.price ? `${parseFloat(room.price).toLocaleString()} ₫` : 'Liên hệ'}
                            </Text>
                            <br />
                            <Text type="secondary" style={per_night_style}>/ đêm</Text>
                          </div>
                        </div>

                        <Space direction="vertical" size={4} style={info_space_style}>
                          <Text type="secondary">
                            <EnvironmentOutlined /> {q || 'Khu vực trung tâm'}
                          </Text>
                          <Space>
                            <Rate disabled defaultValue={5} style={rate_size_style} />
                            <Text type="secondary">(85 đánh giá)</Text>
                          </Space>
                        </Space>
                      </div>

                      <div style={footer_action_style}>
                        <Space>
                          <Tag icon={<CalendarOutlined />} color="green">Xác nhận ngay</Tag>
                          <Text type="success" style={available_text_style}>● Đang trống</Text>
                        </Space>
                        <Button type="primary" size="large" shape="round" style={view_btn_style}>
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

// Hệ thống Style Constants
const main_layout_style = { minHeight: '100vh', background: '#f8fafc' };
const content_container_style = { maxWidth: 1100, margin: '40px auto', padding: '0 20px', width: '100%' };
const header_wrapper_style = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 };
const no_margin_style = { margin: 0 };
const no_padding_style = { padding: 0 };
const full_width_style = { width: '100%' };

const loading_state_style = { textAlign: 'center', padding: '100px', background: '#fff', borderRadius: 16 };
const empty_card_style = { borderRadius: 16, textAlign: 'center', padding: '40px' };

const hotel_card_style = { borderRadius: 16, overflow: 'hidden', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' };
const image_wrapper_style = { position: 'relative', height: '100%', minHeight: '240px' };
const image_style = { width: '100%', height: '100%', objectFit: 'cover' };
const popular_tag_style = { position: 'absolute', top: 12, left: 12, margin: 0, borderRadius: 4, fontWeight: 'bold' };

const content_col_style = { padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
const flex_between_style = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
const hotel_name_style = { margin: '0 0 8px 0', color: '#1f2937' };

const price_wrapper_style = { textAlign: 'right', minWidth: '150px' };
const price_text_style = { fontSize: 24, color: '#ff4d4f' };
const per_night_style = { fontSize: 13 };

const info_space_style = { marginTop: 16 };
const rate_size_style = { fontSize: 14 };

const footer_action_style = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' };
const available_text_style = { fontSize: 13, fontWeight: 500 };
const view_btn_style = { paddingInline: 40, fontWeight: 'bold' };

export default HotelList;