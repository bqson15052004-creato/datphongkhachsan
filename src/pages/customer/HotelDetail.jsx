import React, { useState, useEffect } from 'react';
import {
  Layout, Row, Col, Typography, Button, Card, Tag,
  Table, Tabs, Image, Rate, Divider, Space, Avatar, Spin, List, Empty, App as AntApp
} from 'antd';
import {
  EnvironmentOutlined, CheckCircleOutlined, InfoCircleOutlined,
  ArrowLeftOutlined, UserOutlined, HomeOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import Navbar from '../../components/common/Navbar';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// --- STYLE CONSTANTS (Giữ nguyên của Sơn và thêm 1 chút tinh chỉnh) ---
const main_image_style = { width: '100%', height: 450, objectFit: 'cover', borderRadius: '16px 0 0 16px' };
const sub_image_style = { width: '100%', height: 219, objectFit: 'cover', borderRadius: 12, cursor: 'pointer', transition: 'opacity 0.3s' };
const sticky_card_style = { 
  borderRadius: 16, 
  backgroundColor: '#fff', 
  position: 'sticky', 
  top: 100, 
  border: '1px solid #f0f0f0',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)' 
};

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message: antdMessage } = AntApp.useApp();
  
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const roomRes = await axiosClient.get(`/hotels/rooms/${id}/`);
        setRoom(roomRes.data || roomRes);

        const reviewRes = await axiosClient.get(`/hotels/reviews/`, { params: { room_id: id } });
        setReviews(Array.isArray(reviewRes) ? reviewRes : reviewRes.data || []); 
      } catch (error) {
        antdMessage?.error("Không tải được chi tiết phòng.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, antdMessage]);

  const isRoomAvailable = room?.status === 'available' || room?.is_available;

  const columns = [
    {
      title: 'Hạng phòng',
      key: 'room_info',
      render: (record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 16 }}>{record.room_type_name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>Diện tích: 35m² • Hướng biển</Text>
        </Space>
      )
    },
    {
      title: 'Giá phòng',
      dataIndex: 'price_per_night',
      key: 'price_per_night',
      align: 'center',
      render: (price) => (
        <div style={{ textAlign: 'center' }}>
          <Text type="danger" strong style={{ fontSize: 18 }}>{parseFloat(price).toLocaleString()}đ</Text>
          <br /><Text type="secondary" style={{ fontSize: 10 }}>Gồm thuế & phí</Text>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      align: 'center',
      render: () => (
        <Tag color={isRoomAvailable ? 'green' : 'red'}>
          {isRoomAvailable ? 'Còn chỗ' : 'Hết phòng'}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Button
          type="primary"
          block
          size="large"
          disabled={!isRoomAvailable}
          onClick={() => navigate('/checkout', { state: { room: record } })}
          style={{ borderRadius: 8 }}
        >
          {isRoomAvailable ? 'Đặt phòng' : 'Đã hết'}
        </Button>
      )
    },
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" tip="Đang chuẩn bị phòng cho bạn..." /></div>;
  if (!room) return <div style={{ textAlign: 'center', padding: '100px' }}><Empty description="Phòng này không tồn tại hoặc đã bị gỡ." /></div>;

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />

      <Content style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 20px', width: '100%' }}>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ color: '#64748b', marginBottom: 16, padding: 0 }}>
          Quay lại danh sách khách sạn
        </Button>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <Title level={2} style={{ marginBottom: 8 }}>{room.hotel_name || 'Khách sạn đối tác'}</Title>
              <Space split={<Divider type="vertical" />}>
                <Rate disabled defaultValue={5} style={{ fontSize: 14 }} />
                <Text type="secondary"><EnvironmentOutlined /> {room.location_city || 'Khu vực trung tâm'}</Text>
                <Tag color="blue" icon={<HomeOutlined />}>Phòng {room.room_number}</Tag>
              </Space>
            </div>
            <div style={{ textAlign: 'right' }}>
               <Text type="secondary">Giá chỉ từ</Text>
               <Title level={3} style={{ color: '#ff4d4f', margin: 0 }}>{parseFloat(room.price_per_night).toLocaleString()}đ</Title>
            </div>
          </div>
        </div>

        <Row gutter={[12, 12]}>
          <Col span={16}>
            <Image
              src={room.image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'}
              style={main_image_style}
              preview={{ mask: "Xem ảnh phóng to" }}
            />
          </Col>
          <Col span={8}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Image src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400" style={sub_image_style} />
              <div style={{ position: 'relative' }}>
                <Image src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400" style={sub_image_style} />
                <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>
                  +15 ảnh khác
                </div>
              </div>
            </Space>
          </Col>
        </Row>

        <Row gutter={40} style={{ marginTop: 40 }}>
          <Col xs={24} lg={16}>
            <Tabs defaultActiveKey="1" size="large" className="custom-tabs">
              <Tabs.TabPane tab="Mô tả chi tiết" key="1">
                <Title level={4}>Về hạng phòng {room.room_type_name}</Title>
                <Paragraph style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.8 }}>
                  Chào mừng bạn đến với không gian nghỉ dưỡng tại {room.hotel_name}. Phòng {room.room_number} được trang bị nội thất cao cấp, 
                  tầm nhìn thoáng đãng và không gian yên tĩnh tuyệt đối, phù hợp cho cả chuyến công tác lẫn du lịch nghỉ dưỡng.
                </Paragraph>
                <Divider />
                <Title level={4}>Tiện ích cao cấp</Title>
                <Row gutter={[16, 24]}>
                  {['Wifi tốc độ cao', 'Bồn tắm nằm', 'Dịch vụ dọn phòng', 'Máy pha cà phê', 'Két sắt bảo mật', 'Ăn sáng buffet'].map(item => (
                    <Col span={8} key={item}>
                      <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> <Text>{item}</Text></Space>
                    </Col>
                  ))}
                </Row>
              </Tabs.TabPane>

              <Tabs.TabPane tab={`Khách hàng đánh giá (${reviews.length})`} key="2">
                <List
                  itemLayout="horizontal"
                  dataSource={reviews}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.customer_name}`} />}
                        title={<Space><Text strong>{item.customer_name}</Text> <Rate disabled defaultValue={item.rating} style={{ fontSize: 10 }} /></Space>}
                        description={
                          <div>
                            <Paragraph style={{ margin: '4px 0' }}>{item.comment || 'Khách hàng không để lại bình luận.'}</Paragraph>
                            <Text type="secondary" style={{ fontSize: 11 }}>{dayjs(item.created_at).format('DD [tháng] MM, YYYY')}</Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: <Empty description="Hãy là người đầu tiên trải nghiệm và đánh giá phòng này!" /> }}
                />
              </Tabs.TabPane>
            </Tabs>

            <div id="room-selection" style={{ marginTop: 60, padding: '24px', background: '#f8fafc', borderRadius: 16 }}>
              <Title level={4}><SafetyCertificateOutlined /> Lựa chọn của bạn</Title>
              <Table
                columns={columns}
                dataSource={[room]}
                pagination={false}
                bordered={false}
                rowKey="id_room"
                style={{ marginTop: 16 }}
              />
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <Card style={sticky_card_style}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Giá mỗi đêm từ</Text>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                   <Title level={2} style={{ color: '#ff4d4f', margin: 0 }}>{parseFloat(room.price_per_night).toLocaleString()}đ</Title>
                   <Text type="secondary">/ phòng</Text>
                </div>
              </div>
              <Alert 
                message="Đảm bảo giá tốt nhất" 
                type="success" 
                showIcon 
                style={{ marginBottom: 20, borderRadius: 8 }}
              />
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> Xác nhận tức thì</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> Không phí hủy phòng</Text>
                </div>
              </Space>
              <Divider />
              <Button
                type="primary"
                block
                size="large"
                style={{ height: 50, fontSize: 16, fontWeight: 700, borderRadius: 12 }}
                disabled={!isRoomAvailable}
                onClick={() => document.getElementById('room-selection').scrollIntoView({ behavior: 'smooth' })}
              >
                {isRoomAvailable ? 'CHỌN PHÒNG NGAY' : 'HẾT PHÒNG'}
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default HotelDetail;