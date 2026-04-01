import React, { useState, useEffect } from 'react';
import { 
  Layout, Menu, Card, Avatar, Button, Typography, Tag, 
  Modal, Form, Input, Row, Col, Table, Space, Rate, Empty, message, Divider 
} from 'antd';
import { 
  UserOutlined, HistoryOutlined, ArrowLeftOutlined, 
  StarOutlined, DeleteOutlined, MailOutlined, IdcardOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Profile = () => {
  const navigate = useNavigate();
  const [active_tab, set_active_tab] = useState('info');
  const [form_review] = Form.useForm();
  
  const [user_data, set_user_data] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [booking_history, set_booking_history] = useState([]); 
  const [is_loading, set_is_loading] = useState(false);
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [selected_booking, set_selected_booking] = useState(null);

  // 1. Fetch dữ liệu lịch sử đặt phòng
  const fetch_bookings = async () => {
    set_is_loading(true);
    try {
      const response = await axiosClient.get('/hotels/bookings/');
      set_booking_history(response);
    } catch (error) {
      message.error("Không thể tải lịch sử đặt phòng.");
    } finally {
      set_is_loading(false);
    }
  };

  useEffect(() => {
    fetch_bookings();
  }, []);

  // 2. Xử lý Hủy phòng
  const handle_cancel = (booking_id) => {
    Modal.confirm({
      title: 'Xác nhận hủy đặt phòng?',
      content: 'Lưu ý: Hành động này không thể hoàn tác.',
      okText: 'Hủy ngay',
      okType: 'danger',
      cancelText: 'Quay lại',
      async onOk() {
        try {
          await axiosClient.delete(`/hotels/bookings/${booking_id}/`);
          message.success('Đã hủy phòng thành công!');
          fetch_bookings();
        } catch (error) {
          message.error("Lỗi: Không thể hủy phòng (Có thể do quá hạn hoặc trạng thái không hợp lệ).");
        }
      },
    });
  };

  // 3. Xử lý Gửi Review
  const handle_review_submit = async (values) => {
    try {
      const review_payload = {
        room: selected_booking.room,
        rating: values.rating,
        comment: values.comment
      };

      await axiosClient.post('/hotels/reviews/', review_payload);

      message.success('Cảm ơn bạn đã đóng góp ý kiến!');
      set_is_modal_open(false);
      form_review.resetFields();
    } catch (error) {
      message.error("Gửi đánh giá thất bại.");
    }
  };

  // Định nghĩa các cột Table
  const table_columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { 
      title: 'Thông tin phòng', 
      key: 'room_info',
      render: (record) => (
        <div>
          <Text strong>Khách sạn {record.hotel_owner_name}</Text><br/>
          <Tag color="blue" style={{ marginTop: 4 }}>Số phòng: {record.room_number}</Tag>
        </div>
      )
    },
    { 
      title: 'Thời gian lưu trú', 
      key: 'stay_period',
      render: (record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 13 }}>Từ: {record.check_in}</Text>
          <Text style={{ fontSize: 13 }}>Đến: {record.check_out}</Text>
        </Space>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        const config = {
          'Confirmed': { color: 'green', text: 'Đã xác nhận' },
          'Cancelled': { color: 'red', text: 'Đã hủy' },
          'Pending': { color: 'orange', text: 'Chờ xử lý' }
        };
        const current = config[status] || { color: 'default', text: status };
        return <Tag color={current.color}>{current.text.toUpperCase()}</Tag>;
      }
    },
    { 
      title: 'Thanh toán', 
      dataIndex: 'total_price', 
      key: 'total_price',
      render: (total) => <Text strong style={{ color: '#cf1322' }}>{parseFloat(total).toLocaleString()}đ</Text> 
    },
    { 
      title: 'Hành động', 
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'Pending' && (
            <Button size="small" danger ghost icon={<DeleteOutlined />} onClick={() => handle_cancel(record.id)}>Hủy</Button>
          )}
          {record.status === 'Confirmed' && (
            <Button size="small" type="primary" ghost icon={<StarOutlined />} onClick={() => { set_selected_booking(record); set_is_modal_open(true); }}>Đánh giá</Button>
          )}
        </Space>
      )
    },
  ];

  return (
    <Layout style={layout_style}>
      <Row gutter={0} style={full_height_style}>
        {/* SIDEBAR */}
        <Col xs={24} md={8} lg={5} style={sidebar_style}>
          <div style={sidebar_header_style}>
            <Avatar size={100} icon={<UserOutlined />} style={avatar_style} />
            <Title level={4} style={user_name_style}>{user_data.fullName || "Khách hàng"}</Title>
            <Tag color="gold" style={vip_tag_style}>THÀNH VIÊN VIP</Tag>
          </div>
          
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[active_tab]}
            onClick={({ key }) => (key === 'back' ? navigate('/') : set_active_tab(key))}
            style={menu_style}
            items={[
              { key: 'info', icon: <IdcardOutlined />, label: 'Thông tin cá nhân' },
              { key: 'history', icon: <HistoryOutlined />, label: 'Lịch sử đặt phòng' },
              { type: 'divider' },
              { key: 'back', icon: <ArrowLeftOutlined />, label: 'Về trang chủ' },
            ]}
          />
        </Col>

        {/* MAIN CONTENT */}
        <Col xs={24} md={16} lg={19} style={content_area_style}>
          <div style={content_wrapper_style}>
            {active_tab === 'info' && (
              <Card bordered={false} style={profile_card_style} title={<Title level={3} style={no_margin_style}>Thông tin tài khoản</Title>}>
                <Row style={info_row_style}>
                  <Col span={6}><Space><UserOutlined /><Text type="secondary">Họ và tên</Text></Space></Col>
                  <Col span={18}><Text strong fontSize={16}>{user_data.fullName}</Text></Col>
                </Row>
                <Divider style={divider_style} />
                <Row style={info_row_style}>
                  <Col span={6}><Space><MailOutlined /><Text type="secondary">Địa chỉ Email</Text></Space></Col>
                  <Col span={18}><Text>{user_data.email}</Text></Col>
                </Row>
                <div style={note_section_style}>
                  <Text type="secondary">* Để thay đổi thông tin cá nhân, vui lòng liên hệ quản trị viên.</Text>
                </div>
              </Card>
            )}

            {active_tab === 'history' && (
              <Card bordered={false} style={profile_card_style} title={<Title level={3} style={no_margin_style}>Lịch sử chuyến đi</Title>}>
                <Table 
                  columns={table_columns} 
                  dataSource={booking_history} 
                  rowKey="id" 
                  loading={is_loading}
                  pagination={{ pageSize: 7 }}
                  locale={{ emptyText: <Empty description="Bạn chưa có giao dịch nào" /> }}
                />
              </Card>
            )}
          </div>
        </Col>
      </Row>

      {/* MODAL ĐÁNH GIÁ */}
      <Modal
        title="Đánh giá chất lượng phòng"
        open={is_modal_open}
        onCancel={() => set_is_modal_open(false)}
        footer={null}
        centered
      >
        <Form form={form_review} layout="vertical" onFinish={handle_review_submit}>
          <Form.Item name="rating" label="Xếp hạng của bạn" rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}>
            <Rate allowHalf />
          </Form.Item>
          <Form.Item name="comment" label="Nhận xét chi tiết" rules={[{ required: true, message: 'Vui lòng nhập cảm nhận của bạn' }]}>
            <TextArea rows={4} placeholder="Chia sẻ trải nghiệm của bạn về không gian, dịch vụ..." />
          </Form.Item>
          <Button type="primary" block size="large" htmlType="submit" style={submit_btn_style}>
            GỬI ĐÁNH GIÁ
          </Button>
        </Form>
      </Modal>
    </Layout>
  );
};

// Hệ thống Style Constants
const layout_style = { minHeight: '100vh', background: '#f8fafc' };
const full_height_style = { minHeight: '100vh', width: '100%', margin: 0 };
const sidebar_style = { background: '#001529', boxShadow: '4px 0 10px rgba(0,0,0,0.1)' };
const sidebar_header_style = { padding: '50px 20px', textAlign: 'center' };
const avatar_style = { border: '4px solid rgba(255,255,255,0.15)', backgroundColor: '#1890ff', marginBottom: 16 };
const user_name_style = { color: '#fff', margin: '0 0 8px 0' };
const vip_tag_style = { borderRadius: '4px', fontWeight: 'bold' };
const menu_style = { borderRight: 0 };
const content_area_style = { padding: '40px' };
const content_wrapper_style = { maxWidth: '1000px', margin: '0 auto' };
const profile_card_style = { borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' };
const no_margin_style = { margin: 0 };
const info_row_style = { padding: '10px 0' };
const divider_style = { margin: '12px 0' };
const note_section_style = { marginTop: 30, padding: '15px', background: '#f9f9f9', borderRadius: '8px' };
const submit_btn_style = { borderRadius: '8px', height: '45px', fontWeight: 'bold' };

export default Profile;