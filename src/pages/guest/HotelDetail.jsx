import React, { useState, useEffect, useRef } from 'react';
import {
  Row, Col, Typography, Button, Card, Tag, Table, Tabs, Image, Rate, Divider, Space, Spin, Empty, Alert, App as AntApp, List, Avatar
} from 'antd';
import {
  EnvironmentOutlined,
  ArrowLeftOutlined, UserOutlined, MessageOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// IMPORT MOCK DATA
import { MOCK_ROOMS, MOCK_HOTELS } from '../../constants/mockData.jsx';

const { Title, Text, Paragraph } = Typography;

// Dữ liệu mẫu đánh giá
const MOCK_REVIEWS = [
  { id: 1, hotelId: 1, user: "Khách hàng ẩn danh", rate: 5, date: "22/04/2026", comment: "Phòng cực kỳ sạch sẽ và yên tĩnh. Nhân viên hỗ trợ check-in rất nhanh!" },
  { id: 2, hotelId: 1, user: "Minh Anh", rate: 4, date: "18/04/2026", comment: "View biển đẹp tuyệt vời, tuy nhiên buffet sáng nên có nhiều món Việt hơn." },
  { id: 3, hotelId: 2, user: "Tuấn Trần", rate: 5, date: "10/04/2026", comment: "Vị trí ngay trung tâm, rất tiện đi lại. Giá cả hợp lý." },
];

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { message: antdMessage, modal } = AntApp.useApp(); 
  
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const roomTableRef = useRef(null);

  const scrollToRooms = () => {
    roomTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const hotelId = Number(id);
        const foundHotel = MOCK_HOTELS.find(h => h.id_hotel === hotelId);
        const foundRooms = MOCK_ROOMS.filter(r => r.id_hotel === hotelId);
        const foundReviews = MOCK_REVIEWS.filter(rev => rev.hotelId === hotelId);

        if (foundHotel) {
          setHotel(foundHotel);
          setRooms(foundRooms);
          setReviews(foundReviews);
        } else {
          antdMessage?.error("Không tìm thấy khách sạn trong hệ thống.");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id, antdMessage]);

  // Cấu hình nội dung các Tabs
  const tabItems = [
    {
      label: 'Tổng quan',
      key: '1',
      children: (
        <div style={{ marginTop: 20 }}>
          <Title level={4}>Về khách sạn này</Title>
          <Paragraph style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.8 }}>
            {hotel?.description || "Không gian nghỉ dưỡng lý tưởng với đầy đủ tiện nghi hiện đại."}
            <br /><br />
            <EnvironmentOutlined /> <b>Địa chỉ:</b> {hotel?.address}
          </Paragraph>
        </div>
      )
    },
    {
      label: `Đánh giá (${reviews.length})`,
      key: '2',
      children: (
        <div style={{ marginTop: 20 }}>
          <List
            itemLayout="horizontal"
            dataSource={reviews}
            locale={{ emptyText: <Empty description="Chưa có đánh giá nào." /> }}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />}
                  title={
                    <Space size="middle">
                      <Text strong>{item.user}</Text>
                      <Rate disabled defaultValue={item.rate} style={{ fontSize: 12 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>{item.date}</Text>
                    </Space>
                  }
                  description={<Text italic style={{ color: '#374151' }}>"{item.comment}"</Text>}
                />
              </List.Item>
            )}
          />
        </div>
      )
    }
  ];

  const columns = [
    {
      title: 'Hình ảnh',
      key: 'room_image',
      width: 140,
      align: 'center',
      render: (record) => (
        <Image 
          src={record.image_url} 
          width={110} 
          height={75}
          style={{ borderRadius: 8, objectFit: 'cover' }} 
          fallback="https://via.placeholder.com/120x80?text=No+Image"
        />
      )
    },
    {
      title: 'Hạng phòng',
      key: 'room_info',
      width: 250, 
      render: (record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 16 }}>{record.room_type}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>Mã: #{record.id_room}</Text>
        </Space>
      )
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      align: 'center',
      render: (val) => <Space><UserOutlined /> x{val}</Space>
    },
    {
      title: 'Giá/đêm',
      dataIndex: 'price_per_night',
      key: 'price_per_night',
      width: 160,
      align: 'right',
      render: (price) => (
        <Text type="danger" strong style={{ fontSize: 19 }}>
          {Number(price).toLocaleString()}₫
        </Text>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          block
          disabled={record.status === 'booked'}
          onClick={() => {
            modal.confirm({
              title: 'Yêu cầu đăng nhập',
              content: 'Ông cần đăng nhập tài khoản để thực hiện đặt phòng này nhé!',
              okText: 'Đăng nhập ngay',
              cancelText: 'Để sau',
              centered: true,
              onOk: () => navigate('/login', { state: { from: location.pathname } }),
            });
          }}
          style={{ borderRadius: 8, fontWeight: 600, height: 40 }}
        >
          {record.status === 'booked' ? 'Hết phòng' : 'ĐẶT NGAY'}
        </Button>
      )
    },
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" /></div>;
  if (!hotel) return <div style={{ textAlign: 'center', padding: '100px' }}><Empty description="Khách sạn không tồn tại." /></div>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '20px' }}>
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)} 
        style={{ color: '#64748b', marginBottom: 16, padding: 0 }}
      >
        Quay lại
      </Button>

      {/* HEADER SECTION */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col span={24}>
          <Title level={2} style={{ marginBottom: 8 }}>{hotel.hotel_name}</Title>
          <Space split={<Divider type="vertical" />}>
            <Rate disabled defaultValue={hotel.rate_star} style={{ fontSize: 14 }} />
            <Text type="secondary"><EnvironmentOutlined /> {hotel.location_city}</Text>
          </Space>
        </Col>
        
        <Col span={24}>
          <Image 
            src={hotel.image_url} 
            style={{ width: '100%', height: 480, objectFit: 'cover', borderRadius: 20 }} 
          />
        </Col>
      </Row>

      {/* INFO & TABS SECTION */}
      <Row gutter={[40, 40]} style={{ marginBottom: 40 }}>
        <Col xs={24} lg={16}>
          <Tabs 
            defaultActiveKey="1" 
            size="large" 
            items={tabItems}
          />
        </Col>

        <Col xs={24} lg={8}>
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'sticky', top: 80 }}>
            <Text type="secondary">Giá phòng chỉ từ</Text>
            <Title level={3} style={{ color: '#ff4d4f', marginTop: 4, marginBottom: 20 }}>
              {Number(hotel.price_per_night).toLocaleString()}₫ <small style={{fontSize: 14, color: '#999'}}> /đêm</small>
            </Title>
            <Alert 
              message="Đăng nhập để nhận giá ưu đãi!" 
              type="info" 
              showIcon 
              style={{ marginBottom: 16 }}
            />
            <Button 
              type="primary" 
              block 
              size="large" 
              onClick={scrollToRooms}
              style={{ height: 50, fontWeight: 'bold', borderRadius: 12 }}
            >
              XEM PHÒNG
            </Button>
          </Card>
        </Col>
      </Row>

      {/* ROOM TABLE */}
      <div 
        style={{ marginTop: 20, paddingTop: 40, borderTop: '1px solid #f0f0f0', scrollMarginTop: '80px' }} 
        ref={roomTableRef}
      >
        <Title level={3} style={{ marginBottom: 24 }}>Danh sách phòng trống</Title>
        <Table
          columns={columns}
          dataSource={rooms}
          pagination={false}
          rowKey="id_room"
          bordered={false}
          scroll={{ x: 900 }} 
        />
      </div>
    </div>
  );
};

export default HotelDetail;