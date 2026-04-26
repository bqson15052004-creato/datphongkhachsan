import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, Button, Typography, Row, Col, 
  Divider, Space, Tag, Modal, App as AntApp, DatePicker, Avatar, Alert
} from 'antd';
import { 
  ArrowLeftOutlined, 
  CalendarOutlined, InfoCircleOutlined, EnvironmentOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { message: antdMessage } = AntApp.useApp();
  
  const { room, hotel } = location.state || {};
  const [currentUser, setCurrentUser] = useState(null);
  
  // Mặc định chọn từ hôm nay đến ngày mai
  const [dates, setDates] = useState([
    dayjs().startOf('day'), 
    dayjs().add(1, 'day').startOf('day')
  ]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Kiểm tra đăng nhập
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
      antdMessage?.warning('Vui lòng đăng nhập để tiếp tục đặt phòng!');
      navigate('/login', { state: { from: location.pathname } });
      return;
    } 
    setCurrentUser(user);

    // 2. Kiểm tra dữ liệu phòng (phải đi từ trang Detail qua)
    if (!room) {
      antdMessage?.error("Thông tin phòng không hợp lệ!");
      navigate('/hotels');
    }
  }, [navigate, room, antdMessage, location.pathname]);

  // Tính toán hóa đơn
  const billingDetails = useMemo(() => {
    let nights = 0;
    if (dates && dates[0] && dates[1]) {
      nights = dates[1].startOf('day').diff(dates[0].startOf('day'), 'day');
    }
    
    const actualNights = nights > 0 ? nights : 0;
    const subTotal = (room?.price_per_night || 0) * actualNights;
    const tax = subTotal * 0.05; // Thuế 5%
    const total = subTotal + tax;
    
    return { nights: actualNights, subTotal, tax, total };
  }, [dates, room]);

  const handleConfirm = async () => {
    if (billingDetails.nights <= 0) {
      return antdMessage?.error("Vui lòng chọn thời gian lưu trú hợp lệ!");
    }

    setLoading(true);
    try {
      const bookingData = {
        id_room: room.id_room,
        check_in: dates[0].format('YYYY-MM-DD'),
        check_out: dates[1].format('YYYY-MM-DD'),
        total_price: billingDetails.total,
        payment_method: 'banking' // Mặc định banking cho demo
      };

      await axiosClient.post('/hotels/bookings/', bookingData);

      Modal.success({
        title: 'Đặt phòng thành công!',
        centered: true,
        content: (
          <div style={{ marginTop: 10 }}>
            <p>Yêu cầu đặt phòng <b>{room.room_number}</b> của bạn đã được gửi đi.</p>
            <p>Vui lòng theo dõi trạng thái tại mục <b>Chuyến đi của tôi</b>.</p>
          </div>
        ),
        onOk: () => navigate('/profile/bookings'), // Chuyển về trang lịch sử
      });
    } catch (error) {
      antdMessage?.error(error.response?.data?.detail || 'Không thể đặt phòng. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  if (!room || !currentUser) return null;

  return (
    <div style={{ width: '100%', paddingBottom: 40 }}>
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: 16, padding: 0, color: '#64748b' }}
      >
        Quay lại
      </Button>

      <Row gutter={[32, 32]}>
        {/* CỘT TRÁI: THÔNG TIN KHÁCH & NGÀY */}
        <Col xs={24} lg={15}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <Title level={4}><SafetyCertificateOutlined style={{ color: '#52c41a' }} /> Thông tin khách hàng</Title>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginTop: 16, 
                padding: '20px', 
                background: '#f8fafc', 
                borderRadius: 12,
                border: '1px solid #e2e8f0'
              }}>
                <Avatar size={64} src={currentUser?.avatar} style={{ backgroundColor: '#3b82f6' }}>
                  {currentUser?.fullName?.charAt(0)}
                </Avatar>
                <div style={{ marginLeft: 20 }}>
                  <Text strong style={{ fontSize: 18, display: 'block' }}>{currentUser?.fullName}</Text>
                  <Text type="secondary" style={{ fontSize: 14 }}>{currentUser?.email}</Text>
                </div>
              </div>
            </Card>

            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <Title level={4} style={{ marginBottom: 20 }}><CalendarOutlined /> Thời gian lưu trú</Title>
              <RangePicker
                style={{ width: '100%', height: 55, borderRadius: 12 }}
                value={dates}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                onChange={(val) => setDates(val)}
                format="DD/MM/YYYY"
                allowClear={false}
              />
              <Alert 
                message={<b>Tóm tắt: {billingDetails.nights} đêm nghỉ tại {hotel?.hotel_name || 'Khách sạn'}</b>}
                type="info" 
                showIcon 
                style={{ marginTop: 20, borderRadius: 12 }} 
              />
            </Card>
          </Space>
        </Col>

        {/* CỘT PHẢI: CHI TIẾT THANH TOÁN (STICKY) */}
        <Col xs={24} lg={9}>
          <Card 
            bordered={false} 
            style={{ 
              borderRadius: 20, 
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
              position: 'sticky', 
              top: 80 
            }}
          >
            <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
              <img
                alt="room"
                src={room.image_url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'}
                style={{ width: '100%', height: 180, objectFit: 'cover' }}
              />
            </div>
            
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Tag color="blue" style={{ marginBottom: 8 }}>{hotel?.hotel_name || 'Khách sạn'}</Tag>
                <Title level={4} style={{ margin: 0 }}>Phòng {room.room_number}</Title>
                <Text type="secondary">{room.room_type}</Text>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>{Number(room.price_per_night).toLocaleString()}₫ x {billingDetails.nights} đêm</Text>
                <Text strong>{billingDetails.subTotal.toLocaleString()}₫</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Phí dịch vụ & Thuế (5%)</Text>
                <Text>{billingDetails.tax.toLocaleString()}₫</Text>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>Tổng cộng</Title>
                <Title level={3} style={{ color: '#e11d48', margin: 0 }}>
                  {billingDetails.total.toLocaleString()}₫
                </Title>
              </div>

              <Button
                type="primary"
                block
                size="large"
                loading={loading}
                onClick={handleConfirm}
                style={{ 
                  marginTop: 24, 
                  height: 55, 
                  borderRadius: 14, 
                  fontSize: 18, 
                  fontWeight: 700,
                  background: '#10b981', // Màu xanh lá cho nút thanh toán
                  border: 'none'
                }}
              >
                XÁC NHẬN ĐẶT PHÒNG
              </Button>
              
              <Text type="secondary" style={{ textAlign: 'center', display: 'block', fontSize: 12, marginTop: 12 }}>
                <InfoCircleOutlined /> Thông tin đặt phòng của bạn sẽ được gửi đến chủ khách sạn để xác nhận.
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;