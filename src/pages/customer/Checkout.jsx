import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, Button, Typography, Row, Col, 
  Divider, Space, Tag, Modal, App as AntApp, DatePicker, Avatar, Select
} from 'antd';
import { 
  ArrowLeftOutlined, 
  CalendarOutlined, SafetyCertificateOutlined,
  PercentageOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import dayjs from 'dayjs';

// IMPORT MOCK DATA
import { MOCK_DISCOUNTS } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { message: antdMessage } = AntApp.useApp();
  
  const { room, hotel } = location.state || {};
  const [currentUser, setCurrentUser] = useState(null);
  const [dates, setDates] = useState([dayjs().startOf('day'), dayjs().add(1, 'day').startOf('day')]); 
  const [loading, setLoading] = useState(false);

  const [discounts, setDiscounts] = useState([]); 
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
      antdMessage?.warning('Vui lòng đăng nhập để tiếp tục đặt phòng!');
      navigate('/login', { state: { from: location.pathname } });
      return;
    } 
    setCurrentUser(user);

    if (!room) {
      antdMessage?.error("Thông tin phòng không hợp lệ!");
      navigate('/hotels');
      return;
    }

    // Lấy mã giảm giá (Ưu tiên lọc từ MockData vì ông đã cung cấp file)
    const hotelDiscounts = MOCK_DISCOUNTS.filter(d => 
      d.status === 'active' && (
        d.id_hotels === 'all' || 
        (Array.isArray(d.id_hotels) && d.id_hotels.includes(hotel?.id_hotel))
      )
    );
    setDiscounts(hotelDiscounts);
  }, [hotel, navigate, room, antdMessage, location.pathname]);

  const billingDetails = useMemo(() => {
    let nights = 0;
    if (dates && dates[0] && dates[1]) {
      nights = dates[1].startOf('day').diff(dates[0].startOf('day'), 'day');
    }
    const actualNights = nights > 0 ? nights : 0;
    const subTotal = (room?.price_per_night || 0) * actualNights;
    
    let discountAmount = 0;
    if (selectedDiscount) {
      discountAmount = (subTotal * (selectedDiscount.percentage || 0)) / 100;
    }

    const totalBeforeTax = Math.max(0, subTotal - discountAmount);
    const tax = totalBeforeTax * 0.05; 
    const total = totalBeforeTax + tax;
    
    return { nights: actualNights, subTotal, discountAmount, tax, total };
  }, [dates, room, selectedDiscount]);

  // KHÔI PHỤC LOGIC XÁC NHẬN ĐẶT PHÒNG
  const handleConfirm = async () => {
    if (billingDetails.nights <= 0) {
      return antdMessage?.error("Vui lòng chọn thời gian lưu trú hợp lệ!");
    }

    setLoading(true);
    const bookingData = {
      id_booking: Date.now(),
      id_room: room.id_room,
      room_number: room.room_number,
      hotel_name: hotel?.hotel_name,
      id_hotel: hotel?.id_hotel,
      check_in: dates[0].format('YYYY-MM-DD'),
      check_out: dates[1].format('YYYY-MM-DD'),
      total_price: billingDetails.total,
      discount_applied: selectedDiscount?.code || null, // Thêm mã đã dùng
      status: 'Pending',
      booking_date: dayjs().format('YYYY-MM-DD HH:mm'),
      customer_name: currentUser?.fullName,
      room_image: room.image_url,
      hotel_address: hotel?.address,
    };

    try {
      // 1. Thử gọi API thật
      await axiosClient.post('/hotels/bookings/', bookingData);
      Modal.success({ 
        title: 'Thành công!', 
        content: 'Đơn đặt phòng của bạn đã được ghi nhận.',
        onOk: () => navigate('/customer/customerbookings') 
      });
    } catch (error) {
      // 2. FALLBACK LƯU LOCALSTORAGE NẾU BE LỖI
      console.warn("API lỗi - Chế độ Mock: Lưu vào LocalStorage");
      const existingBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      existingBookings.push(bookingData);
      localStorage.setItem('mock_bookings', JSON.stringify(existingBookings));

      await new Promise(resolve => setTimeout(resolve, 800));
      Modal.success({
        title: 'Đặt phòng thành công (Demo)!',
        content: 'Dữ liệu đã được lưu vào bộ nhớ tạm của trình duyệt.',
        onOk: () => navigate('/customer/customerbookings'),
      });
    } finally {
      setLoading(false);
    }
  };

  if (!room || !currentUser) return null;

  return (
    <div style={{ width: '100%', paddingBottom: 40 }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16, color: '#64748b' }}>
        Quay lại
      </Button>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={15}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card variant={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <Title level={4}><SafetyCertificateOutlined style={{ color: '#52c41a' }} /> Thông tin khách hàng</Title>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 16, padding: '20px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <Avatar size={64} src={currentUser?.avatar} style={{ backgroundColor: '#3b82f6' }}>{currentUser?.fullName?.charAt(0)}</Avatar>
                <div style={{ marginLeft: 20 }}>
                  <Text strong style={{ fontSize: 18, display: 'block' }}>{currentUser?.fullName}</Text>
                  <Text type="secondary">{currentUser?.email}</Text>
                </div>
              </div>
            </Card>

            <Card variant={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <Title level={4} style={{ marginBottom: 20 }}><CalendarOutlined /> Thời gian lưu trú</Title>
              <RangePicker
                style={{ width: '100%', height: 55, borderRadius: 12 }}
                value={dates}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                onChange={(val) => setDates(val)}
                format="DD/MM/YYYY"
                allowClear={false}
              />
            </Card>
          </Space>
        </Col>

        <Col xs={24} lg={9}>
          <Card variant={false} style={{ borderRadius: 20, boxShadow: '0 10px 25px rgba(0,0,0,0.05)', position: 'sticky', top: 80 }}>
            <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
              <img alt="room" src={room.image_url} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
            </div>
            
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Tag color="blue">{hotel?.hotel_name}</Tag>
                <Title level={4} style={{ margin: '4px 0 0 0' }}>Phòng {room.room_number}</Title>
                <Text type="secondary">{room.room_type} - {Number(room.price_per_night).toLocaleString()}₫/đêm</Text>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              {/* MÃ GIẢM GIÁ */}
              <div>
                <Text strong><PercentageOutlined /> Mã giảm giá của khách sạn</Text>
                <Select
                  placeholder="Chọn mã giảm giá"
                  style={{ width: '100%', marginTop: 8 }}
                  allowClear
                  onChange={(value) => {
                    const discount = discounts.find(d => d.id_discount === value);
                    setSelectedDiscount(discount);
                  }}
                >
                  {discounts.map(d => (
                    <Select.Option key={d.id_discount} value={d.id_discount}>
                      <span style={{ fontWeight: 'bold', color: '#f5222d' }}>{d.code}</span> - Giảm {d.percentage}%
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <Divider style={{ margin: '12px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Tiền phòng ({billingDetails.nights} đêm)</Text>
                <Text strong>{billingDetails.subTotal.toLocaleString()}₫</Text>
              </div>

              {selectedDiscount && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="danger">Khuyến mãi ({selectedDiscount.code})</Text>
                  <Text type="danger">- {billingDetails.discountAmount.toLocaleString()}₫</Text>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Thuế & Phí (5%)</Text>
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
                type="primary" block size="large" loading={loading}
                onClick={handleConfirm}
                style={{ 
                  marginTop: 16, height: 50, borderRadius: 12, fontSize: 16, 
                  fontWeight: 700, background: '#10b981', border: 'none'
                }}
              >
                XÁC NHẬN ĐẶT PHÒNG
              </Button>
              <Text type="secondary" style={{ textAlign: 'center', display: 'block', fontSize: 12 }}>
                <InfoCircleOutlined /> Đơn hàng sẽ được xác nhận ngay lập tức.
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;