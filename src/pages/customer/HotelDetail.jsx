import React, { useState, useEffect } from 'react';
import { 
  Layout, Row, Col, Typography, Button, Card, Tag, 
  Table, Tabs, Image, Rate, Divider, Space, Avatar, Spin, List, Empty 
} from 'antd';
import { 
  EnvironmentOutlined, CheckCircleOutlined, InfoCircleOutlined,
  ArrowLeftOutlined, UserOutlined, HomeOutlined 
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import Navbar from '../../components/common/Navbar';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const HotelDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [current_user, set_current_user] = useState(null);
  const [room, set_room] = useState(null);
  const [reviews, set_reviews] = useState([]);
  const [is_loading, set_is_loading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) set_current_user(user);

    const fetch_data = async () => {
      set_is_loading(true);
      try {
        // 1. Lấy chi tiết phòng
        const room_res = await axiosClient.get(`/hotels/rooms/${id}/`);
        set_room(room_res);

        // 2. Lấy danh sách đánh giá
        const review_res = await axiosClient.get(`/hotels/reviews/`, {
          params: { room_id: id }
        });
        set_reviews(review_res);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        set_is_loading(false);
      }
    };

    fetch_data();
  }, [id]);

  // Cấu hình bảng hiển thị thông tin đặt phòng
  const table_columns = [
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

  if (is_loading) return <div style={loading_container_style}><Spin size="large" tip="Đang tải dữ liệu..." /></div>;
  if (!room) return <div style={loading_container_style}><Empty description="Không tìm thấy thông tin phòng" /></div>;

  return (
    <Layout style={main_layout_style}>
      <Navbar />

      <Content style={content_wrapper_style}>
        <div style={back_container_style}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={back_btn_style}>
            Quay lại trang danh sách
          </Button>
        </div>

        <div style={header_section_style}>
          <Title level={2} style={no_margin_style}>Khách sạn {room.hotel_owner_name}</Title>
          <Space size="large">
            <Rate disabled defaultValue={5} />
            <Text type="secondary"><EnvironmentOutlined /> Thuộc hệ thống đối tác của nền tảng</Text>
            <Tag color="purple"><HomeOutlined /> Phòng {room.room_number}</Tag>
          </Space>
        </div>

        {/* Khối hình ảnh Grid */}
        <Row gutter={[12, 12]}>
          <Col span={16}>
            <Image 
              src={room.image || 'https://via.placeholder.com/800x450'} 
              style={main_image_style} 
            />
          </Col>
          <Col span={8}>
            <Space direction="vertical" size={12} style={full_width_style}>
              <Image src="https://via.placeholder.com/400x219?text=Phòng+Khách" style={sub_image_style} />
              <Image src="https://via.placeholder.com/400x219?text=Tiện+Nghi" style={sub_image_style} />
            </Space>
          </Col>
        </Row>

        <Row gutter={40} style={main_row_style}>
          {/* Cột trái: Nội dung chi tiết */}
          <Col span={16}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Tổng quan" key="1">
                <Title level={4}>Thông tin hạng phòng: {room.room_type_name}</Title>
                <Paragraph style={paragraph_style}>
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
                            <Text type="secondary" style={date_text_style}>
                              {new Date(item.created_at).toLocaleDateString('vi-VN')}
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: <Empty description="Chưa có đánh giá nào cho phòng này." /> }}
                />
              </Tabs.TabPane>
            </Tabs>

            <div id="room-selection" style={selection_section_style}>
              <Title level={4}>Xác nhận thông tin phòng</Title>
              <Table 
                columns={table_columns} 
                dataSource={[room]} 
                pagination={false} 
                bordered 
                rowKey="id" 
              />
            </div>
          </Col>

          {/* Cột phải: Sticky Booking Card */}
          <Col span={8}>
            <Card bordered style={sticky_card_style}>
              <Title level={4} style={price_title_style}>
                {parseFloat(room.price).toLocaleString()} ₫
              </Title>
              <Text type="secondary">/ đêm / phòng</Text>
              <Divider />
              <Title level={5}><InfoCircleOutlined /> Tại sao nên đặt ở đây?</Title>
              <ul style={perk_list_style}>
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
                style={cta_btn_style}
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

// Hệ thống Style Constants
const main_layout_style = { minHeight: '100vh', background: '#fff' };
const content_wrapper_style = { maxWidth: 1200, margin: '0 auto', padding: '20px 50px', width: '100%' };
const full_width_style = { width: '100%' };
const no_margin_style = { marginBottom: 4 };
const loading_container_style = { textAlign: 'center', padding: '100px' };
const back_container_style = { marginBottom: 10 };
const back_btn_style = { paddingLeft: 0 };
const header_section_style = { marginBottom: 20 };
const main_image_style = { width: '100%', height: 450, objectFit: 'cover', borderRadius: 12 };
const sub_image_style = { width: '100%', height: 219, objectFit: 'cover', borderRadius: 12 };
const main_row_style = { marginTop: 40 };
const paragraph_style = { fontSize: 16, lineHeight: 1.8 };
const date_text_style = { fontSize: 12 };
const selection_section_style = { marginTop: 40 };
const price_title_style = { color: '#ff4d4f', marginBottom: 0 };
const perk_list_style = { paddingLeft: 20, color: '#4b5563' };
const cta_btn_style = { height: 50, fontWeight: 'bold' };
const sticky_card_style = { 
  borderRadius: 16, 
  backgroundColor: '#f9f9f9', 
  position: 'sticky', 
  top: 100, 
  boxShadow: '0 4px 12px rgba(0,0,0,0.03)' 
};

export default HotelDetail;