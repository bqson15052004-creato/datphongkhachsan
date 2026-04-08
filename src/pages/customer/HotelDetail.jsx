import React, { useState, useEffect } from 'react';
import {
  Layout, Row, Col, Typography, Button, Card, Tag, Table, Tabs, Image, Rate, Divider, Space, Avatar, Spin, List, Empty, Alert, App as AntApp
} from 'antd';
import {
  EnvironmentOutlined, CheckCircleOutlined, InfoCircleOutlined,
  ArrowLeftOutlined, UserOutlined, HomeOutlined, SafetyCertificateOutlined, CoffeeOutlined, WifiOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import Navbar from '../../components/common/Navbar';
import dayjs from 'dayjs';

// IMPORT MOCK DATA
import { MOCK_ROOMS, MOCK_HOTELS } from '../../constants/mockData';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const HotelDetail = () => {
  const { id } = useParams(); // Đây là id_hotel
  const navigate = useNavigate();
  const { message: antdMessage } = AntApp.useApp();
  
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. THỬ KẾT NỐI BE (Lấy thông tin khách sạn và phòng của nó)
        const hotelRes = await axiosClient.get(`/hotels/${id}/`);
        setHotel(hotelRes);
        setRooms(hotelRes.rooms || []); 
      } catch (error) {
        console.warn("Backend chưa có, đang dùng Mock Data quan hệ...");

        // 2. DÙNG MOCK DATA THEO CẤU TRÚC MỚI
        const foundHotel = MOCK_HOTELS.find(h => h.id_hotel === Number(id));
        const foundRooms = MOCK_ROOMS.filter(r => r.id_hotel === Number(id));

        if (foundHotel) {
          setHotel(foundHotel);
          setRooms(foundRooms);
        } else {
          antdMessage?.error("Không tìm thấy khách sạn này.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id, antdMessage]);

  const columns = [
    {
      title: 'Hạng phòng',
      key: 'room_info',
      render: (record) => (
        <Space size="middle">
          <Image src={record.image_url} width={120} style={{ borderRadius: 8, objectFit: 'cover' }} />
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 16 }}>{record.room_type}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>Giường: {record.bed_type}</Text>
            <Space wrap size={[4, 4]} style={{ marginTop: 4 }}>
              {record.amenities?.map(a => <Tag key={a} style={{ fontSize: 10 }}>{a}</Tag>)}
            </Space>
          </Space>
        </Space>
      )
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      key: 'capacity',
      align: 'center',
      render: (val) => <Space><UserOutlined /> x{val}</Space>
    },
    {
      title: 'Giá phòng/đêm',
      dataIndex: 'price_per_night',
      key: 'price_per_night',
      align: 'center',
      render: (price) => (
        <Text type="danger" strong style={{ fontSize: 17 }}>
          {parseFloat(price).toLocaleString()}đ
        </Text>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Button
          type="primary"
          block
          disabled={record.status === 'booked'}
          onClick={() => navigate('/checkout', { state: { room: record, hotel: hotel } })}
          style={{ borderRadius: 8, fontWeight: 600 }}
        >
          {record.status === 'booked' ? 'Hết phòng' : 'ĐẶT PHÒNG'}
        </Button>
      )
    },
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" /></div>;
  if (!hotel) return <div style={{ textAlign: 'center', padding: '100px' }}><Empty description="Khách sạn không tồn tại." /></div>;

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />

      <Content style={{ maxWidth: 1200, margin: '0 auto', padding: '20px', width: '100%' }}>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ color: '#64748b', marginBottom: 16, padding: 0 }}>
          Quay lại tìm kiếm
        </Button>

        {/* HEADER INFO */}
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          <Col span={24}>
            <Title level={2} style={{ marginBottom: 8 }}>{hotel.hotel_name}</Title>
            <Space split={<Divider type="vertical" />}>
              <Rate disabled defaultValue={hotel.rate_star} style={{ fontSize: 14 }} />
              <Text type="secondary"><EnvironmentOutlined /> {hotel.location_city}</Text>
              <Tag color="green" icon={<SafetyCertificateOutlined />}>Đã xác minh</Tag>
            </Space>
          </Col>
          
          {/* GALLERY GIẢ LẬP */}
          <Col span={16}>
            <Image src={hotel.image_url} style={{ width: '100%', height: 450, objectFit: 'cover', borderRadius: 16 }} />
          </Col>
          <Col span={8}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Image src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400" style={{ width: '100%', height: 219, objectFit: 'cover', borderRadius: 16 }} />
              <Image src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" style={{ width: '100%', height: 219, objectFit: 'cover', borderRadius: 16 }} />
            </Space>
          </Col>
        </Row>

        <Row gutter={40}>
          <Col xs={24} lg={16}>
            <Tabs defaultActiveKey="1" size="large">
              <Tabs.TabPane tab="Tổng quan" key="1">
                <Paragraph style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.8 }}>
                  {hotel.description}
                </Paragraph>
                <Divider />
                <Title level={4}>Tiện ích khách sạn</Title>
                <Row gutter={[16, 16]}>
                  <Col span={8}><Space><WifiOutlined style={{color: '#1890ff'}}/> Wifi miễn phí</Space></Col>
                  <Col span={8}><Space><CoffeeOutlined style={{color: '#1890ff'}}/> Bữa sáng</Space></Col>
                  <Col span={8}><Space><CheckCircleOutlined style={{color: '#1890ff'}}/> Hồ bơi</Space></Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>

            {/* BẢNG CHỌN PHÒNG - PHẦN QUAN TRỌNG NHẤT */}
            <div id="room-selection" style={{ marginTop: 40 }}>
              <Title level={3} style={{ marginBottom: 20 }}>Loại phòng trống tại đây</Title>
              <Table
                columns={columns}
                dataSource={rooms}
                pagination={false}
                rowKey="id_room"
                bordered
                locale={{ emptyText: "Khách sạn này hiện đang hết phòng trống." }}
              />
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 16, position: 'sticky', top: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Text type="secondary">Giá trung bình</Text>
              <Title level={3} style={{ color: '#ff4d4f', marginTop: 4 }}>
                {hotel.price_per_night?.toLocaleString()}đ <small style={{fontSize: 14, color: '#999'}}> /đêm</small>
              </Title>
              <Alert message="Đang có 5 người xem khách sạn này" type="info" showIcon style={{ marginBottom: 16 }} />
              <Button type="primary" block size="large" onClick={() => document.getElementById('room-selection').scrollIntoView({ behavior: 'smooth' })}>
                XEM PHÒNG TRỐNG
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default HotelDetail;