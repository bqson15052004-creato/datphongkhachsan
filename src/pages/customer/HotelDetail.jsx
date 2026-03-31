import React, { useState, useEffect } from 'react';
import { 
  Layout, Row, Col, Typography, Button, Card, Tag, 
  Table, Tabs, Image, Rate, Divider, Space, Avatar, Dropdown, Spin, List 
} from 'antd';
import { 
  EnvironmentOutlined, CheckCircleOutlined, InfoCircleOutlined,
  ArrowLeftOutlined, UserOutlined, LogoutOutlined, SolutionOutlined, HomeOutlined 
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/common/Navbar';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const HotelDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Lấy thông tin user
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setCurrentUser(user);

    const fetchData = async () => {
      setLoading(true);
      try {
        // 2. Gọi API lấy chi tiết phòng
        const roomRes = await axios.get(`http://127.0.0.1:8000/api/hotels/rooms/${id}/`);
        setRoom(roomRes.data);

        // 3. Gọi API lấy danh sách đánh giá của phòng này
        const reviewRes = await axios.get(`http://127.0.0.1:8000/api/hotels/reviews/`, {
          params: { room_id: id }
        });
        setReviews(reviewRes.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Cấu hình bảng hiển thị thông tin đặt phòng (Show chính cái phòng đang xem)
  const columns = [
    { 
      title: 'Hạng phòng', 
      dataIndex: 'room_type_name', 
      key: 'room_type_name', 
      render: (text) => <Text strong>{text}</Text> 
    },
    { 
      title: 'Số phòng', 
      dataIndex: 'room_number', 
      key: 'room_number',
      render: (num) => <Tag color="blue">{num}</Tag>
    },
    { 
      title: 'Giá/Đêm', 
      dataIndex: 'price', 
      key: 'price', 
      render: (price) => <Text type="danger" strong>{parseFloat(price).toLocaleString()}đ</Text> 
    },
    { 
      title: 'Thao tác', 
      key: 'action', 
      render: (_, record) => (
        <Button 
          type="primary" 
          disabled={!record.is_available}
          onClick={() => navigate('/checkout', { state: { room: record } })} 
        >
          Đặt ngay
        </Button>
      ) 
    },
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" tip="Đang tải dữ liệu..." /></div>;
  if (!room) return <div style={{ textAlign: 'center', padding: '100px' }}><Text>Không tìm thấy thông tin.</Text></div>;

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />

      <Content style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 50px', background: '#fff', width: '100%' }}>
        <div style={{ marginBottom: 10 }}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ paddingLeft: 0 }}>
            Quay lại trang danh sách
          </Button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <Title level={2} style={{ marginBottom: 4 }}>Khách sạn {room.hotel_owner_name}</Title>
          <Space size="large">
            <Rate disabled defaultValue={5} />
            <Text type="secondary"><EnvironmentOutlined /> Thuộc hệ thống đối tác của nền tảng</Text>
            <Tag color="purple"><HomeOutlined /> Phòng {room.room_number}</Tag>
          </Space>
        </div>

        {/* Khối hình ảnh */}
        <Row gutter={[12, 12]}>
          <Col span={16}>
            <Image 
              src={room.image || 'https://via.placeholder.com/800x450'} 
              style={{ width: '100%', height: 450, objectFit: 'cover', borderRadius: 12 }} 
            />
          </Col>
          <Col span={8}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Image src="https://via.placeholder.com/400x219?text=Phòng+Khách" style={{ width: '100%', height: 219, objectFit: 'cover', borderRadius: 12 }} />
              <Image src="https://via.placeholder.com/400x219?text=Tiện+Nghi" style={{ width: '100%', height: 219, objectFit: 'cover', borderRadius: 12 }} />
            </Space>
          </Col>
        </Row>

        <Row gutter={40} style={{ marginTop: 40 }}>
          <Col span={16}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Tổng quan" key="1">
                <Title level={4}>Thông tin hạng phòng: {room.room_type_name}</Title>
                <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                  Trải nghiệm không gian nghỉ dưỡng tuyệt vời tại phòng {room.room_number}. 
                  Với thiết kế hiện đại, đầy đủ tiện nghi và dịch vụ chuyên nghiệp từ đối tác {room.hotel_owner_name}.
                </Paragraph>
                <Divider />
                <Title level={4}>Tiện nghi đi kèm</Title>
                <Row gutter={[16, 16]}>
                  {['Wifi miễn phí', 'Điều hòa 24/7', 'Bữa sáng tại phòng', 'Tivi 4K', 'Mini Bar'].map(item => (
                    <Col span={8} key={item}>
                      <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> {item}</Text>
                    </Col>
                  ))}
                </Row>
              </Tabs.TabPane>

              <Tabs.TabPane tab={`Đánh giá (${reviews.length})`} key="2">
                <List
                  itemLayout="horizontal"
                  dataSource={reviews}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={<Space><Text strong>{item.customer_name}</Text> <Rate disabled defaultValue={item.rating} style={{ fontSize: 12 }} /></Space>}
                        description={
                          <div>
                            <Text>{item.comment}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 12 }}>{new Date(item.created_at).toLocaleDateString('vi-VN')}</Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: <Empty description="Chưa có đánh giá nào cho phòng này." /> }}
                />
              </Tabs.TabPane>
            </Tabs>

            <div id="room-selection" style={{ marginTop: 40 }}>
              <Title level={4}>Xác nhận thông tin phòng</Title>
              <Table 
                columns={columns} 
                dataSource={[room]} // Truyền chính object room hiện tại vào mảng
                pagination={false} 
                bordered 
                rowKey="id" 
              />
            </div>
          </Col>

          {/* Cột Sticky bên phải */}
          <Col span={8}>
            <Card bordered style={{ borderRadius: 16, backgroundColor: '#f9f9f9', position: 'sticky', top: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <Title level={4} style={{ color: '#ff4d4f', marginBottom: 0 }}>
                {parseFloat(room.price).toLocaleString()} ₫
              </Title>
              <Text type="secondary">/ đêm / phòng</Text>
              <Divider />
              <Title level={5}><InfoCircleOutlined /> Tại sao nên đặt ở đây?</Title>
              <ul style={{ paddingLeft: 20, color: '#4b5563' }}>
                <li>Giá tốt nhất cho hạng {room.room_type_name}</li>
                <li>Hỗ trợ đổi ngày đặt linh hoạt</li>
                <li>Xác nhận phòng ngay lập tức</li>
              </ul>
              <Button 
                type="primary" 
                block 
                size="large" 
                shape="round"
                disabled={!room.is_available}
                onClick={() => document.getElementById('room-selection').scrollIntoView({ behavior: 'smooth' })}
              >
                {room.is_available ? 'Kiểm tra & Đặt ngay' : 'Hết phòng'}
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default HotelDetail;