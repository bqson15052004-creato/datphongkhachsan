import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layout, Card, Radio, Button, Typography, Row, Col, 
  Divider, Space, Tag, Modal, App as AntApp, DatePicker, Avatar, Alert
} from 'antd';
import { 
  BankOutlined, WalletOutlined, LockOutlined, ArrowLeftOutlined, 
  CalendarOutlined, InfoCircleOutlined, EnvironmentOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import dayjs from 'dayjs';
import Navbar from '../../components/common/Navbar';

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { message: antdMessage } = AntApp.useApp();
  
  const { room, hotel } = location.state || {};
  const [currentUser, setCurrentUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('banking');
  
  // FIX 1: Khởi tạo ngày về đầu ngày để tính diff chính xác ngay từ đầu
  const [dates, setDates] = useState([
    dayjs().startOf('day'), 
    dayjs().add(1, 'day').startOf('day')
  ]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
      antdMessage?.warning('Vui lòng đăng nhập để tiếp tục đặt phòng!');
      navigate('/login');
    } else {
      setCurrentUser(user);
    }

    if (!room) {
      antdMessage?.error("Không tìm thấy thông tin phòng!");
      navigate('/');
    }
  }, [navigate, room]);

  // FIX 2: Cập nhật useMemo để tính số đêm dựa trên mốc 00:00:00
  const billingDetails = useMemo(() => {
    let nights = 0;
    if (dates && dates[0] && dates[1]) {
      const start = dates[0].startOf('day');
      const end = dates[1].startOf('day');
      nights = end.diff(start, 'day');
    }
    
    const actualNights = nights > 0 ? nights : 0;
    const subTotal = (room?.price_per_night || 0) * actualNights;
    const tax = subTotal * 0.05;
    const total = subTotal + tax;
    
    return { nights: actualNights, subTotal, tax, total };
  }, [dates, room]);

  const handleConfirm = async () => {
    if (billingDetails.nights <= 0) {
      return antdMessage?.error("Thời gian lưu trú tối thiểu là 1 đêm!");
    }

    setLoading(true);
    try {
      const bookingData = {
        id_room: room.id_room,
        check_in: dates[0].format('YYYY-MM-DD'),
        check_out: dates[1].format('YYYY-MM-DD'),
        total_price: billingDetails.total,
        payment_method: paymentMethod
      };

      await axiosClient.post('/hotels/bookings/', bookingData);

      Modal.success({
        title: 'Đã gửi yêu cầu đặt phòng!',
        centered: true,
        content: (
          <div style={{ marginTop: 10 }}>
            <p>Chào <b>{currentUser?.fullName}</b>, chúng tôi đã tiếp nhận đơn đặt phòng số <b>{room.room_number}</b>.</p>
            <p>Vui lòng kiểm tra email hoặc mục <b>Quản lý đơn đặt</b> để cập nhật trạng thái mới nhất từ khách sạn.</p>
          </div>
        ),
        onOk: () => navigate('/profile'),
      });
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Phòng đã được đặt trong khoảng thời gian này.';
      antdMessage?.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!room) return null;

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Navbar />
      <Content style={{ maxWidth: 1100, margin: '40px auto', padding: '0 20px', width: '100%' }}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)} 
          style={{ marginBottom: 16, padding: 0, color: '#64748b' }}
        >
          Quay lại thông tin khách sạn
        </Button>

        <Row gutter={[32, 32]}>
          <Col xs={24} lg={15}>
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>
              
              <Card variant={false} style={{ borderRadius: 16 }}>
                <Title level={5}><SafetyCertificateOutlined style={{ color: '#52c41a' }} /> Xác nhận thông tin người đặt</Title>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 16, padding: '12px', background: '#f8fafc', borderRadius: 12 }}>
                  <Avatar size={48} src={currentUser?.avatar} style={{ backgroundColor: '#1890ff' }}>
                    {currentUser?.fullName?.charAt(0)}
                  </Avatar>
                  <div style={{ marginLeft: 16 }}>
                    <Text strong style={{ display: 'block' }}>{currentUser?.fullName}</Text>
                    <Text type="secondary">{currentUser?.email}</Text>
                  </div>
                </div>
              </Card>

              <Card variant={false} style={{ borderRadius: 16 }}>
                <Title level={5}><CalendarOutlined /> Chọn kỳ nghỉ của bạn</Title>
                <div style={{ marginTop: 16 }}>
                  <RangePicker
                    style={{ width: '100%', height: 50, borderRadius: 8 }}
                    value={dates}
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                    onChange={(val) => setDates(val)}
                    format="DD [Tháng] MM, YYYY"
                    allowClear={false}
                  />
                  {billingDetails.nights > 0 && (
                    <Alert 
                      message={`Bạn đã chọn lưu trú trong ${billingDetails.nights} đêm`} 
                      type="info" 
                      showIcon 
                      style={{ marginTop: 16, borderRadius: 8 }} 
                    />
                  )}
                </div>
              </Card>
            </Space>
          </Col>

          <Col xs={24} lg={9}>
            <Card 
              sticky 
              variant={false} 
              style={{ borderRadius: 20, boxShadow: '0 10px 25px rgba(0,0,0,0.05)', position: 'sticky', top: 20 }}
            >
              <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                <img
                  alt="room"
                  src={room.image || room.image_url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'}
                  style={{ width: '100%', height: 180, objectFit: 'cover' }}
                />
              </div>
              
              <Space orientation="vertical" style={{ width: '100%' }}>
                <div>
                  <Tag color="blue">{room.hotel_name}</Tag>
                  <Title level={4} style={{ margin: '8px 0 4px' }}>Phòng {room.room_number || room.id_room}</Title>
                  <Text type="secondary"><EnvironmentOutlined /> {room.room_type_name || room.room_type}</Text>
                </div>
                
                <Divider style={{ margin: '12px 0' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>{parseFloat(room.price_per_night).toLocaleString()}đ x {billingDetails.nights} đêm</Text>
                  <Text strong>{billingDetails.subTotal.toLocaleString()}đ</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Phí & Thuế (5%)</Text>
                  <Text>{billingDetails.tax.toLocaleString()}đ</Text>
                </div>
                
                <Divider style={{ margin: '12px 0' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={4} style={{ margin: 0 }}>Tổng cộng</Title>
                  <Title level={3} style={{ color: '#ff4d4f', margin: 0 }}>{billingDetails.total.toLocaleString()}đ</Title>
                </div>

                <Button
                  type="primary"
                  block
                  size="large"
                  loading={loading}
                  onClick={handleConfirm}
                  style={{ 
                    marginTop: 20, 
                    height: 55, 
                    borderRadius: 12, 
                    fontSize: 18, 
                    fontWeight: 700,
                    boxShadow: '0 4px 14px 0 rgba(24, 144, 255, 0.39)'
                  }}
                >
                  ĐẶT PHÒNG
                </Button>
                
                <Text type="secondary" style={{ textAlign: 'center', display: 'block', fontSize: 12, marginTop: 12 }}>
                  <InfoCircleOutlined /> Nhấn đặt phòng đồng nghĩa với việc bạn đồng ý với Điều khoản của chúng tôi.
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Checkout;