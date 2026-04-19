import React, { useState, useEffect } from 'react';
import {
  Layout, Row, Col, Typography, Button, Card, Tag, Table, Tabs, Image, Rate, Divider, Space, Spin, Empty, Alert, App as AntApp
} from 'antd';
import {
  EnvironmentOutlined, CheckCircleOutlined,
  ArrowLeftOutlined, UserOutlined, SafetyCertificateOutlined, CoffeeOutlined, WifiOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import Navbar from '../../components/common/Navbar';

// IMPORT MOCK DATA - Đã khớp với file ông gửi
import { MOCK_ROOMS, MOCK_HOTELS } from '../../constants/mockData';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message: antdMessage } = AntApp.useApp();
  
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. THỬ KẾT NỐI API
        const hotelRes = await axiosClient.get(`/hotels/${id}/`);
        setHotel(hotelRes);
        setRooms(hotelRes.rooms || []); 
      } catch (error) {
        // 2. FALLBACK SANG MOCK DATA
        const hotelId = Number(id);
        const foundHotel = MOCK_HOTELS.find(h => h.id_hotel === hotelId);
        const foundRooms = MOCK_ROOMS.filter(r => r.id_hotel === hotelId);

        if (foundHotel) {
          setHotel(foundHotel);
          setRooms(foundRooms);
        } else {
          antdMessage?.error("Không tìm thấy khách sạn trong hệ thống.");
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
      title: 'Số phòng',
      dataIndex: 'id_room',
      key: 'id_room',
      width: 110,
      align: 'center',
      render: (text) => <Text strong style={{ color: '#1890ff' }}>#{text}</Text>
    },
    {
      title: 'Hạng phòng',
      key: 'room_info',
      width: 350,
      render: (record) => (
        <Space size="middle">
          <Image 
            src={record.image_url} 
            width={120} 
            height={80}
            style={{ borderRadius: 8, objectFit: 'cover' }} 
            fallback="https://via.placeholder.com/120x80?text=No+Image"
          />
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 16 }}>{record.room_type}</Text>
            <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>Giường: {record.bed_type}</Text>
            <Space wrap size={[4, 4]} style={{ marginTop: 4 }}>
              {record.amenities?.map(a => <Tag key={a} color="blue" style={{ fontSize: 10 }}>{a}</Tag>)}
            </Space>
          </Space>
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
      width: 1000, 
      align: 'right',
      render: (price) => (
        <Text type="danger" strong style={{ fontSize: 18 }}>
          {Number(price).toLocaleString()}₫
        </Text>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Tag color={record.status === 'booked' ? 'error' : 'success'} style={{ fontWeight: 500 }}>
          {record.status === 'booked' ? 'Hết phòng' : 'Còn phòng'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          block
          disabled={record.status === 'booked'}
          onClick={() => navigate('/checkout', { state: { room: record, hotel: hotel } })}
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
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <Content style={{ maxWidth: 1200, margin: '0 auto', padding: '20px', width: '100%' }}>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ color: '#64748b', marginBottom: 16, padding: 0 }}>
          Quay lại
        </Button>

        {/* HEADER */}
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          <Col span={24}>
            <Title level={2}>{hotel.hotel_name}</Title>
            <Space split={<Divider type="vertical" />}>
              <Rate disabled defaultValue={hotel.rate_star} style={{ fontSize: 14 }} />
              <Text type="secondary"><EnvironmentOutlined /> {hotel.location_city}</Text>
              <Tag color="green" icon={<SafetyCertificateOutlined />}>Chính chủ</Tag>
            </Space>
          </Col>
          
          <Col xs={24} md={16}>
            <Image src={hotel.image_url} style={{ width: '100%', height: 450, objectFit: 'cover', borderRadius: 16 }} />
          </Col>
          <Col xs={24} md={8}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Image src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400" style={{ width: '100%', height: 219, objectFit: 'cover', borderRadius: 16 }} />
              <Image src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" style={{ width: '100%', height: 219, objectFit: 'cover', borderRadius: 16 }} />
            </Space>
          </Col>
        </Row>

        <Row gutter={[40, 40]}>
          <Col xs={24} lg={16}>
            <Tabs defaultActiveKey="1" size="large">
              <Tabs.TabPane tab="Tổng quan" key="1">
                <Title level={4}>Giới thiệu</Title>
                <Paragraph style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.8 }}>
                  {hotel.description}
                  <br />
                  <br />
                  <EnvironmentOutlined /> <b>Địa chỉ:</b> {hotel.address}
                </Paragraph>
                <Divider />
                <Title level={4}>Tiện ích nổi bật</Title>
                <Row gutter={[16, 16]}>
                  <Col span={8}><Space><WifiOutlined style={{color: '#1890ff'}}/> Wifi miễn phí</Space></Col>
                  <Col span={8}><Space><CoffeeOutlined style={{color: '#1890ff'}}/> Bữa sáng</Space></Col>
                  <Col span={8}><Space><CheckCircleOutlined style={{color: '#1890ff'}}/> Hồ bơi</Space></Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>

            <div style={{ marginTop: 40 }}>
              <Title level={3}>Danh sách phòng</Title>
              <Table
                columns={columns}
                dataSource={rooms}
                pagination={false}
                rowKey="id_room"
                bordered
              />
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 16, position: 'sticky', top: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Text type="secondary">Giá từ</Text>
              <Title level={3} style={{ color: '#ff4d4f', marginTop: 4 }}>
                {Number(hotel.price_per_night).toLocaleString()}₫ <small style={{fontSize: 14, color: '#999'}}> /đêm</small>
              </Title>
              <Alert message="Lưu ý" description="Vui lòng kiểm tra trạng thái còn/ hết phòng trước khi đặt phòng." type="info" showIcon />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default HotelDetail;