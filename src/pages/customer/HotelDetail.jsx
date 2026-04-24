import React, { useState, useEffect, useRef } from 'react';
import {
  Layout, Row, Col, Typography, Button, Card, Tag, Table, Tabs, Image, Rate, Divider, Space, Spin, Empty, Alert, App as AntApp
} from 'antd';
import {
  EnvironmentOutlined,
  ArrowLeftOutlined, UserOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import Navbar from '../../components/common/Navbar';

// IMPORT MOCK DATA
import { MOCK_ROOMS, MOCK_HOTELS } from '../../constants/mockData.jsx';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. Lấy message và modal ở cấp cao nhất của Component để tránh lỗi Hook
  const { message: antdMessage, modal } = AntApp.useApp(); 
  
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const roomTableRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const hotelRes = await axiosClient.get(`/hotels/${id}/`);
        setHotel(hotelRes);
        setRooms(hotelRes.rooms || []); 
      } catch (error) {
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
      title: 'Số phòng',
      dataIndex: 'room_number',
      key: 'room_number',
      width: 100,
      align: 'center',
      render: (text) => <Tag color="blue" style={{ fontWeight: 'bold' }}>{text}</Tag>
    },
    {
      title: 'Hạng phòng',
      key: 'room_info',
      width: 250, 
      render: (record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 16 }}>{record.room_type}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>ID: #{record.id_room}</Text>
        </Space>
      )
    },
    {
      title: 'Tiện nghi',
      dataIndex: 'amenities',
      key: 'amenities',
      width: 300,
      render: (amenities) => (
        <Space wrap size={[4, 8]}>
          {amenities && amenities.length > 0 ? (
            amenities.map((item, index) => (
              <Tag 
                key={index} 
                bordered={false}
                color="blue" 
                style={{ borderRadius: 4, textTransform: 'capitalize' }}
              >
                {item} 
              </Tag>
            ))
          ) : (
            <Text type="disabled" italic>Tiêu chuẩn</Text>
          )}
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
        <Text type="danger" strong style={{ fontSize: 19, whiteSpace: 'nowrap' }}>
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
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          block
          disabled={record.status === 'booked'}
          onClick={() => {
            const token = localStorage.getItem('token');
            if (token) {
              navigate('/checkout', { state: { room: record, hotel: hotel } });
            } else {
              // 2. Sử dụng modal confirm để hỏi người dùng
              modal.confirm({
                title: 'Thông báo',
                content: 'Bạn cần đăng nhập để thực hiện đặt phòng. Bạn có muốn đăng nhập ngay không?',
                okText: 'Đăng nhập',
                cancelText: 'Quay lại',
                centered: true,
                onOk: () => navigate('/login'),
              });
            }
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
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <Content style={{ maxWidth: 1200, margin: '0 auto', padding: '20px', width: '100%' }}>
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
              <Tag color="green" icon={<SafetyCertificateOutlined />}>Chính chủ</Tag>
            </Space>
          </Col>
          
          <Col span={24}>
            <Image 
              src={hotel.image_url} 
              style={{ width: '100%', height: 500, objectFit: 'cover', borderRadius: 16 }} 
              placeholder={<Spin />}
            />
          </Col>
        </Row>

        {/* INFO & BOOKING CARD SECTION */}
        <Row gutter={[40, 40]} style={{ marginBottom: 40 }}>
          <Col xs={24} lg={16}>
            <Tabs 
              activeKey="1" 
              size="large" 
              onChange={(key) => {
                if (key === 'rooms_section') {
                  roomTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              items={[
                { label: 'Tổng quan', key: '1' },
                { label: 'Tình trạng phòng trống', key: 'rooms_section' }
              ]}
            />
            
            <div style={{ marginTop: 24 }}>
              <Title level={4}>Giới thiệu</Title>
              <Paragraph style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.8 }}>
                {hotel.description || "Chào mừng bạn đến với không gian nghỉ dưỡng tuyệt vời với đầy đủ tiện nghi."}
                <br /><br />
                <EnvironmentOutlined /> <b>Địa chỉ:</b> {hotel.address}
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none', position: 'sticky', top: 20 }}>
              <Text type="secondary">Giá khởi điểm</Text>
              <Title level={3} style={{ color: '#ff4d4f', marginTop: 4, marginBottom: 20 }}>
                {Number(hotel.price_per_night).toLocaleString()}₫ <small style={{fontSize: 14, color: '#999'}}> /đêm</small>
              </Title>
              <Alert 
                message="Đảm bảo giá tốt nhất" 
                type="success" 
                showIcon 
                style={{ marginBottom: 16 }}
              />
              <Button 
                type="primary" 
                block 
                size="large" 
                onClick={() => roomTableRef.current?.scrollIntoView({ behavior: 'smooth' })} 
                style={{ height: 50, fontWeight: 'bold', borderRadius: 8 }}
              >
                XEM DANH SÁCH PHÒNG
              </Button>
            </Card>
          </Col>
        </Row>

        {/* FULL WIDTH TABLE SECTION */}
        <div style={{ marginTop: 20, paddingTop: 40, borderTop: '1px solid #f0f0f0' }} ref={roomTableRef}>
          <Title level={3} style={{ marginBottom: 24 }}>Danh sách phòng còn trống</Title>
          <Table
            columns={columns}
            dataSource={rooms}
            pagination={false}
            rowKey="id_room"
            bordered
            scroll={{ x: 1100 }} 
            style={{ width: '100%' }}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default HotelDetail;