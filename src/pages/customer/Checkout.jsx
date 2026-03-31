import React, { useState, useEffect } from 'react';
import { 
  Layout, Card, Radio, Button, Typography, Row, Col, 
  Divider, Space, Alert, Avatar, Dropdown, Tag, Modal, message, DatePicker 
} from 'antd';
import { 
  BankOutlined, WalletOutlined, LockOutlined, ArrowLeftOutlined, 
  UserOutlined, LogoutOutlined, SolutionOutlined, EnvironmentOutlined,
  CalendarOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import Navbar from '../../components/common/Navbar';

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy room từ state (đã truyền qua từ HotelDetail)
  const { room } = location.state || {};
  
  const [currentUser, setCurrentUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('banking');
  const [dates, setDates] = useState([dayjs(), dayjs().add(1, 'day')]); // Mặc định ở 1 đêm
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      message.warning('Vui lòng đăng nhập để tiếp tục thanh toán!');
      navigate('/login');
    } else {
      setCurrentUser(user);
    }

    if (!room) {
      message.error("Không tìm thấy thông tin phòng!");
      navigate('/');
    }
  }, [navigate, room]);

  // TÍNH TOÁN CHI PHÍ
  const nights = dates ? dates[1].diff(dates[0], 'day') : 0;
  const roomPrice = room?.price || 0;
  const subTotal = roomPrice * nights;
  const tax = subTotal * 0.05;
  const total = subTotal + tax;

  // XỬ LÝ ĐẶT PHÒNG
  const handleConfirm = async () => {
    if (nights <= 0) return message.error("Vui lòng chọn ngày nhận và trả phòng hợp lệ!");

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const bookingData = {
        room: room.id,
        check_in: dates[0].format('YYYY-MM-DD'),
        check_out: dates[1].format('YYYY-MM-DD'),
        total_price: total,
      };

      // Gọi API POST tới Backend Django
      await axios.post('http://127.0.0.1:8000/api/hotels/bookings/', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Modal.success({
        title: 'Đặt phòng thành công!',
        content: (
          <div>
            <p>Chúc mừng <b>{currentUser.fullName}</b>!</p>
            <p>Đơn hàng của bạn đã được xác nhận. Vui lòng kiểm tra lịch sử ở trang cá nhân.</p>
          </div>
        ),
        onOk: () => navigate('/profile'),
      });
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.non_field_errors?.[0] || 'Lịch đặt phòng bị trùng hoặc có lỗi xảy ra.';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!room) return null;

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <Content style={{ maxWidth: 1200, margin: '0 auto', padding: '30px 50px', width: '100%' }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
          Quay lại
        </Button>

        <Row gutter={24}>
          {/* CỘT TRÁI: THANH TOÁN & NGÀY THÁNG */}
          <Col span={14}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              
              {/* Chọn ngày */}
              <Card title={<Space><CalendarOutlined /> <Title level={5} style={{margin:0}}>Thời gian lưu trú</Title></Space>}>
                <Text type="secondary">Chọn ngày nhận và trả phòng:</Text>
                <div style={{ marginTop: 12 }}>
                  <RangePicker 
                    style={{ width: '100%', height: 45 }} 
                    value={dates}
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                    onChange={(val) => setDates(val)}
                    format="DD/MM/YYYY"
                  />
                </div>
              </Card>

              {/* Phương thức thanh toán */}
              <Card title={<Title level={5} style={{margin:0}}>Phương thức thanh toán</Title>}>
                <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} style={{ width: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Card size="small" hoverable style={{ border: paymentMethod === 'banking' ? '1px solid #1890ff' : '1px solid #f0f0f0' }}>
                      <Radio value="banking"><Space><BankOutlined style={{color: '#1890ff'}}/> Chuyển khoản ngân hàng (QR Code)</Space></Radio>
                    </Card>
                    <Card size="small" hoverable style={{ border: paymentMethod === 'momo' ? '1px solid #1890ff' : '1px solid #f0f0f0' }}>
                      <Radio value="momo"><Space><WalletOutlined style={{color: '#ae2070'}}/> Ví điện tử Momo / ZaloPay</Space></Radio>
                    </Card>
                  </Space>
                </Radio.Group>
              </Card>
            </Space>
          </Col>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <Col span={10}>
            <Card style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <img 
                alt="room" 
                src={room.image || 'https://via.placeholder.com/400x220'} 
                style={{width: '100%', height: 180, objectFit:'cover', borderRadius: '8px', marginBottom: 16}} 
              />
              <Tag color="blue">Khách sạn {room.hotel_owner_name}</Tag>
              <Title level={4} style={{ marginTop: 8 }}>Phòng số {room.room_number}</Title>
              <Text type="secondary"><EnvironmentOutlined /> Hạng phòng: {room.room_type_name}</Text>
              
              <Divider dashed />
              
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>{parseFloat(roomPrice).toLocaleString()}đ x {nights} đêm</Text>
                  <Text strong>{subTotal.toLocaleString()}đ</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Phí dịch vụ & Thuế (5%)</Text>
                  <Text>{tax.toLocaleString()}đ</Text>
                </div>
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={4} style={{ margin: 0 }}>Tổng thanh toán</Title>
                  <Title level={3} style={{ color: '#ff4d4f', margin: 0 }}>{total.toLocaleString()}đ</Title>
                </div>
              </Space>

              <Button 
                type="primary" 
                block 
                size="large" 
                icon={<LockOutlined />} 
                loading={loading}
                style={{ marginTop: 24, height: 50, borderRadius: '8px', fontWeight: 'bold' }}
                onClick={handleConfirm}
              >
                Xác nhận đặt phòng
              </Button>
              
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <InfoCircleOutlined /> Thông tin của bạn được bảo mật tuyệt đối
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Checkout;