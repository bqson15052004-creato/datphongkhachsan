import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Row, Col, Typography, Button, Card, Tag, Table, Tabs, Image, Rate, Divider, Space, Spin, Empty, Alert, App as AntApp, List, Avatar, Tooltip
} from 'antd';
import {
  EnvironmentOutlined,
  ArrowLeftOutlined, UserOutlined, SafetyCertificateOutlined, MessageOutlined, CalendarOutlined, BankOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// IMPORT CONTEXT & MOCK DATA
import AuthContext from '../../contexts/AuthContext';
import { MOCK_ROOMS, MOCK_HOTELS, MOCK_BOOKINGS } from '../../constants/mockData.jsx';

const { Title, Text, Paragraph } = Typography;

const MOCK_REVIEWS = [
  { id: 1, hotelId: 1, user: "Nguyễn Sơn", avatar: "", rate: 5, date: "20/04/2026", comment: "Khách sạn tuyệt vời, nhân viên hỗ trợ rất nhiệt tình. Phòng sạch và thoáng!" },
  { id: 2, hotelId: 1, user: "Hoàng Anh", avatar: "", rate: 4, date: "15/04/2026", comment: "Vị trí thuận tiện, gần trung tâm. Đồ ăn sáng ngon nhưng cần đa dạng hơn." },
  { id: 3, hotelId: 2, user: "Minh Thu", avatar: "", rate: 5, date: "10/04/2026", comment: "Giá cả hợp lý, chất lượng dịch vụ 5 sao. Sẽ quay lại!" },
];

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext); 
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
        
        // --- LOGIC KIỂM TRA TRẠNG THÁI PHÒNG ---
        let foundRooms = MOCK_ROOMS.filter(r => r.id_hotel === hotelId);
        const localBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
        const allBookings = [...MOCK_BOOKINGS, ...localBookings];

        const updatedRooms = foundRooms.map(room => {
          const isOccupied = allBookings.some(booking => 
            Number(booking.id_room) === Number(room.id_room) && 
            booking.status !== 'Cancelled'
          );
          return { ...room, status: isOccupied ? 'booked' : room.status };
        });

        // --- LOGIC LẤY ĐÁNH GIÁ (Gộp tĩnh + động) ---
        const staticReviews = MOCK_REVIEWS.filter(rev => rev.hotelId === hotelId);
        const localReviews = JSON.parse(localStorage.getItem('mock_reviews') || '[]');
        const filteredLocal = localReviews.filter(rev => Number(rev.hotelId) === hotelId);
        
        // Gộp lại, đưa đánh giá mới nhất từ LocalStorage lên đầu
        const allReviews = [...filteredLocal.reverse(), ...staticReviews];

        if (foundHotel) {
          setHotel(foundHotel);
          setRooms(updatedRooms);
          setReviews(allReviews);
        } else {
          antdMessage?.error("Không tìm thấy khách sạn trong hệ thống.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id, antdMessage]);

  const handleChat = () => {
    if (!user) {
      modal.confirm({
        title: 'Yêu cầu đăng nhập',
        content: 'Bạn cần đăng nhập tài khoản để gửi tin nhắn cho khách sạn!',
        onOk: () => navigate('/login', { state: { from: location.pathname } }),
      });
      return;
    }
    navigate('/customer/messages', { 
      state: { 
        id_hotel: hotel.id_hotel, 
        hotel_name: hotel.hotel_name,
        hotel_avatar: hotel.image_url 
      } 
    });
  };

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
      render: (record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 16 }}>{record.room_type}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>Mã phòng: #{record.id_room}</Text>
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
      render: (_, record) => {
        const isBooked = record.status === 'booked';
        return (
          <Button
            type={isBooked ? "default" : "primary"}
            block
            disabled={isBooked}
            onClick={() => {
              if (user?.role === 'customer') {
                navigate('/customer/checkout', { state: { room: record, hotel: hotel } });
              } else {
                modal.confirm({
                  title: 'Yêu cầu đăng nhập',
                  content: 'Vui lòng đăng nhập quyền Khách hàng để đặt phòng!',
                  onOk: () => navigate('/login', { state: { from: location.pathname } }),
                });
              }
            }}
            style={{ borderRadius: 8, fontWeight: 600, height: 40 }}
          >
            {isBooked ? 'Hết phòng' : 'ĐẶT NGAY'}
          </Button>
        );
      }
    },
  ];

  // Nội dung cho các Tabs
  const tabItems = [
    {
      label: 'Tổng quan',
      key: '1',
      children: (
        <div style={{ marginTop: 20 }}>
          <Title level={4}>Giới thiệu</Title>
          <Paragraph style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.8 }}>
            {hotel?.description || "Không gian nghỉ dưỡng tuyệt vời với đầy đủ tiện nghi."}
          </Paragraph>
        </div>
      )
    },
    {
      label: `Đánh giá (${reviews.length})`,
      key: '3',
      children: (
        <div style={{ marginTop: 20 }}>
          <List
            itemLayout="horizontal"
            dataSource={reviews}
            locale={{ emptyText: <Empty description="Chưa có đánh giá nào." /> }}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} src={item.avatar} />}
                  title={
                    <Space size="middle">
                      <Text strong>{item.user}</Text>
                      <Rate disabled defaultValue={item.rate} style={{ fontSize: 12 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>{item.date}</Text>
                    </Space>
                  }
                  description={<Text style={{ color: '#374151' }}>{item.comment}</Text>}
                />
              </List.Item>
            )}
          />
        </div>
      )
    }
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" tip="Đang tải dữ liệu..." /></div>;
  if (!hotel) return <div style={{ textAlign: 'center', padding: '100px' }}><Empty description="Khách sạn không tồn tại." /></div>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '20px' }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ color: '#64748b', marginBottom: 16, padding: 0 }}>
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
          <Image src={hotel.image_url} style={{ width: '100%', height: 480, objectFit: 'cover', borderRadius: 20 }} />
        </Col>
      </Row>

      {/* INFO & BOOKING CARD */}
      <Row gutter={[40, 40]}>
        <Col xs={24} lg={16}>
          <Tabs defaultActiveKey="1" size="large" items={tabItems} />
        </Col>

        <Col xs={24} lg={8}>
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'sticky', top: 100 }}>
            <Text type="secondary">Giá trung bình</Text>
            <Title level={3} style={{ color: '#ff4d4f', marginTop: 4 }}>
              {Number(hotel.price_per_night).toLocaleString()}₫ <small style={{fontSize: 12, color: '#999'}}>/đêm</small>
            </Title>
            <Space direction="vertical" block size="middle">
              <Button type="primary" block size="large" onClick={scrollToRooms} style={{ height: 50, borderRadius: 12 }}>XEM PHÒNG</Button>
              <Button icon={<MessageOutlined />} block size="large" onClick={handleChat} style={{ height: 50, borderRadius: 12 }}>NHẮN TIN</Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* TABLE */}
      <div style={{ marginTop: 40, paddingTop: 40, borderTop: '1px solid #eee' }} ref={roomTableRef}>
        <Title level={3}>Danh sách hạng phòng</Title>
        <Table columns={columns} dataSource={rooms} pagination={false} rowKey="id_room" scroll={{ x: 800 }} />
      </div>
    </div>
  );
};

export default HotelDetail;