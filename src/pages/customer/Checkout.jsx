import React, { useState, useEffect } from 'react';
import { 
  Layout, Card, Radio, Button, Typography, Row, Col, 
  Divider, Space, Tag, Modal, message, DatePicker 
} from 'antd';
import { 
  BankOutlined, WalletOutlined, LockOutlined, ArrowLeftOutlined, 
  EnvironmentOutlined, CalendarOutlined, InfoCircleOutlined
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
  
  // Lấy dữ liệu từ state
  const { room } = location.state || {};
  
  const [current_user, set_current_user] = useState(null);
  const [payment_method, set_payment_method] = useState('banking');
  const [dates, set_dates] = useState([dayjs(), dayjs().add(1, 'day')]); 
  const [loading, set_loading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      message.warning('Vui lòng đăng nhập để tiếp tục thanh toán!');
      navigate('/login');
    } else {
      set_current_user(user);
    }

    if (!room) {
      message.error("Không tìm thấy thông tin phòng!");
      navigate('/');
    }
  }, [navigate, room]);

  // TÍNH TOÁN CHI PHÍ
  const nights = dates ? dates[1].diff(dates[0], 'day') : 0;
  const room_price = room?.price || 0;
  const sub_total = room_price * nights;
  const tax_fee = sub_total * 0.05;
  const total_amount = sub_total + tax_fee;

  // XỬ LÝ ĐẶT PHÒNG
  const handle_confirm = async () => {
    if (nights <= 0) return message.error("Vui lòng chọn ngày nhận và trả phòng hợp lệ!");

    set_loading(true);
    try {
      const token = localStorage.getItem('access_token');
      const booking_data = {
        room: room.id,
        check_in: dates[0].format('YYYY-MM-DD'),
        check_out: dates[1].format('YYYY-MM-DD'),
        total_price: total_amount,
      };

      await axiosClient.post('/hotels/bookings/', booking_data);

      Modal.success({
        title: 'Đặt phòng thành công!',
        content: (
          <div>
            <p>Chúc mừng <b>{current_user.full_name || current_user.fullName}</b>!</p>
            <p>Đơn hàng của bạn đã được xác nhận. Vui lòng kiểm tra lịch sử ở trang cá nhân.</p>
          </div>
        ),
        onOk: () => navigate('/profile'),
      });
    } catch (error) {
      console.error(error);
      const error_msg = error.response?.data?.non_field_errors?.[0] || 'Lịch đặt phòng bị trùng hoặc có lỗi xảy ra.';
      message.error(error_msg);
    } finally {
      set_loading(false);
    }
  };

  if (!room) return null;

  return (
    <Layout style={layout_style}>
      <Navbar />

      <Content style={content_wrapper_style}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={back_btn_style}>
          Quay lại
        </Button>

        <Row gutter={24}>
          {/* CỘT TRÁI: THÔNG TIN LƯU TRÚ */}
          <Col span={14}>
            <Space direction="vertical" size="large" style={full_width_style}>
              
              <Card title={<Space><CalendarOutlined /> <Title level={5} style={no_margin_style}>Thời gian lưu trú</Title></Space>}>
                <Text type="secondary">Chọn ngày nhận và trả phòng:</Text>
                <div style={picker_container_style}>
                  <RangePicker 
                    style={range_picker_style} 
                    value={dates}
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                    onChange={(val) => set_dates(val)}
                    format="DD/MM/YYYY"
                  />
                </div>
              </Card>

              <Card title={<Title level={5} style={no_margin_style}>Phương thức thanh toán</Title>}>
                <Radio.Group onChange={(e) => set_payment_method(e.target.value)} value={payment_method} style={full_width_style}>
                  <Space direction="vertical" style={full_width_style}>
                    <Card size="small" hoverable style={payment_card_style(payment_method === 'banking')}>
                      <Radio value="banking"><Space><BankOutlined style={{color: '#1890ff'}}/> Chuyển khoản ngân hàng (QR Code)</Space></Radio>
                    </Card>
                    <Card size="small" hoverable style={payment_card_style(payment_method === 'momo')}>
                      <Radio value="momo"><Space><WalletOutlined style={{color: '#ae2070'}}/> Ví điện tử Momo / ZaloPay</Space></Radio>
                    </Card>
                  </Space>
                </Radio.Group>
              </Card>
            </Space>
          </Col>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <Col span={10}>
            <Card style={summary_card_style}>
              <img 
                alt="room" 
                src={room.image || 'https://via.placeholder.com/400x220'} 
                style={room_image_style} 
              />
              <Tag color="blue">Khách sạn {room.hotel_owner_name}</Tag>
              <Title level={4} style={room_title_style}>Phòng số {room.room_number}</Title>
              <Text type="secondary"><EnvironmentOutlined /> Hạng phòng: {room.room_type_name}</Text>
              
              <Divider dashed />
              
              <Space direction="vertical" style={full_width_style}>
                <div style={flex_between_style}>
                  <Text>{parseFloat(room_price).toLocaleString()}đ x {nights} đêm</Text>
                  <Text strong>{sub_total.toLocaleString()}đ</Text>
                </div>
                <div style={flex_between_style}>
                  <Text type="secondary">Phí dịch vụ & Thuế (5%)</Text>
                  <Text>{tax_fee.toLocaleString()}đ</Text>
                </div>
                <Divider />
                <div style={flex_center_between_style}>
                  <Title level={4} style={no_margin_style}>Tổng cộng</Title>
                  <Title level={3} style={total_price_style}>{total_amount.toLocaleString()}đ</Title>
                </div>
              </Space>

              <Button 
                type="primary" 
                block 
                size="large" 
                icon={<LockOutlined />} 
                loading={loading}
                style={confirm_btn_style}
                onClick={handle_confirm}
              >
                Xác nhận đặt phòng
              </Button>
              
              <div style={security_info_style}>
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

// Hệ thống Style Constants
const layout_style = { minHeight: '100vh', background: '#f8fafc' };
const content_wrapper_style = { maxWidth: 1200, margin: '0 auto', padding: '30px 50px', width: '100%' };
const full_width_style = { width: '100%' };
const no_margin_style = { margin: 0 };
const back_btn_style = { marginBottom: 20 };
const picker_container_style = { marginTop: 12 };
const range_picker_style = { width: '100%', height: 45 };
const summary_card_style = { borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' };
const room_image_style = { width: '100%', height: 180, objectFit: 'cover', borderRadius: '8px', marginBottom: 16 };
const room_title_style = { marginTop: 8 };
const flex_between_style = { display: 'flex', justifyContent: 'space-between' };
const flex_center_between_style = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const total_price_style = { color: '#ff4d4f', margin: 0 };
const confirm_btn_style = { marginTop: 24, height: 50, borderRadius: '8px', fontWeight: 'bold' };
const security_info_style = { marginTop: 16, textAlign: 'center' };

const payment_card_style = (is_selected) => ({
  border: is_selected ? '1px solid #1890ff' : '1px solid #f0f0f0',
  transition: 'all 0.3s'
});

export default Checkout;