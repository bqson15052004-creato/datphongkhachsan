import React, { useState, useEffect } from 'react';
import {
  Layout, Menu, Card, Avatar, Button, Typography, Tag,
  Modal, Form, Input, Row, Col, Table, Space, Rate, Empty, App as AntApp, Descriptions, Badge
} from 'antd';
import {
  UserOutlined, HistoryOutlined,
  ArrowLeftOutlined, StarOutlined, DeleteOutlined, 
  LogoutOutlined, VerifiedOutlined, CarryOutOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Profile = () => {
  const navigate = useNavigate();
  const { message: antdMessage, modal: antdModal } = AntApp.useApp();
  
  const [activeTab, setActiveTab] = useState('info');
  const [formReview] = Form.useForm();
  
  const [userData] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/hotels/bookings/');
      setBookings(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      antdMessage?.error("Không thể tải lịch sử đặt phòng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    antdMessage.success("Đã đăng xuất thành công");
    navigate('/login');
  };

  const handleCancelBooking = (bookingId) => {
    antdModal?.confirm({
      title: 'Xác nhận hủy đơn đặt phòng?',
      icon: <DeleteOutlined style={{ color: 'red' }} />,
      content: 'Lưu ý: Hành động này không thể hoàn tác. Bạn chỉ có thể hủy đơn ở trạng thái "Chờ xác nhận".',
      okText: 'Xác nhận hủy',
      okType: 'danger',
      cancelText: 'Quay lại',
      async onOk() {
        try {
          await axiosClient.delete(`/hotels/bookings/${bookingId}/`);
          antdMessage?.success('Đã hủy đơn thành công!');
          fetchBookings();
        } catch (error) {
          antdMessage?.error("Hủy đơn thất bại. Vui lòng liên hệ hỗ trợ.");
        }
      },
    });
  };

  const handleReviewSubmit = async (values) => {
    try {
      const reviewData = {
        room_id: selectedBooking.room_id,
        rating: values.rating,
        comment: values.comment
      };
      await axiosClient.post('/hotels/reviews/', reviewData);
      antdMessage?.success('Cảm ơn bạn đã đóng góp ý kiến!');
      setIsReviewModalOpen(false);
      formReview.resetFields();
    } catch (error) {
      antdMessage?.error("Không thể gửi đánh giá lúc này.");
    }
  };

  const columns = [
    { 
      title: 'Mã đơn', 
      dataIndex: 'id', 
      key: 'id', 
      render: (id) => <Text code>#{id}</Text> 
    },
    {
      title: 'Thông tin phòng',
      key: 'hotel',
      render: (record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.hotel_name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>Phòng: {record.room_number} ({record.room_type_name})</Text>
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'Confirmed': { color: 'success', text: 'Đã xác nhận' },
          'Cancelled': { color: 'error', text: 'Đã hủy' },
          'Pending': { color: 'processing', text: 'Đang chờ' }
        };
        const current = statusMap[status] || { color: 'default', text: status };
        return <Badge status={current.color} text={current.text} />;
      }
    },
    {
      title: 'Thanh toán',
      dataIndex: 'total_price',
      align: 'right',
      render: (total) => <Text strong style={{ color: '#ff4d4f' }}>{parseFloat(total).toLocaleString()}₫</Text>
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          {record.status === 'Pending' && (
            <Button size="small" danger ghost icon={<DeleteOutlined />} onClick={() => handleCancelBooking(record.id)}>Hủy đơn</Button>
          )}
          {record.status === 'Confirmed' && (
            <Button size="small" type="primary" ghost icon={<StarOutlined />} onClick={() => { setSelectedBooking(record); setIsReviewModalOpen(true); }}>Đánh giá</Button>
          )}
        </Space>
      )
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f4f7fe' }}>
      <Row gutter={0} style={{ minHeight: '100vh', width: '100%' }}>
        {/* SIDEBAR TỐI ƯU CHO MOBILE */}
        <Col xs={24} lg={5} style={{ background: '#001529', boxShadow: '4px 0 10px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Badge count={<VerifiedOutlined style={{ color: '#52c41a', fontSize: 20 }} />} offset={[-10, 80]}>
              <Avatar size={90} icon={<UserOutlined />} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.full_name}`} style={{ backgroundColor: '#1890ff', border: '2px solid #fff' }} />
            </Badge>
            <Title level={4} style={{ color: '#fff', marginTop: 15, marginBottom: 5 }}>{userData.full_name}</Title>
            <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{userData.email}</Text>
            <div style={{ marginTop: 15 }}><Tag color="gold">THÀNH VIÊN BẠC</Tag></div>
          </div>
          
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[activeTab]}
            style={{ borderRight: 0 }}
            onClick={({ key }) => {
              if (key === 'back') navigate('/');
              else if (key === 'logout') handleLogout();
              else setActiveTab(key);
            }}
            items={[
              { key: 'info', icon: <UserOutlined />, label: 'Hồ sơ cá nhân' },
              { key: 'history', icon: <HistoryOutlined />, label: 'Lịch sử đặt phòng' },
              { type: 'divider' },
              { key: 'back', icon: <ArrowLeftOutlined />, label: 'Về trang chủ' },
              { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
            ]}
          />
        </Col>

        {/* MAIN CONTENT */}
        <Col xs={24} lg={19} style={{ padding: '40px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            {activeTab === 'info' && (
              <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Title level={3} style={{ marginBottom: 30 }}>Thông tin cá nhân</Title>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Họ và tên" labelStyle={{ width: 200 }}>{userData.full_name}</Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ Email">{userData.email}</Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">{userData.phone || 'Chưa cập nhật'}</Descriptions.Item>
                  <Descriptions.Item label="Ngày tham gia">15/03/2026</Descriptions.Item>
                  <Descriptions.Item label="Trạng thái tài khoản">
                    <Tag color="green">Đã xác thực</Tag>
                  </Descriptions.Item>
                </Descriptions>
                <Button type="primary" style={{ marginTop: 24, borderRadius: 8 }}>Cập nhật thông tin</Button>
              </Card>
            )}

            {activeTab === 'history' && (
              <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <Title level={3} style={{ margin: 0 }}>Lịch sử chuyến đi</Title>
                  <Button icon={<CarryOutOutlined />} onClick={fetchBookings}>Làm mới</Button>
                </div>
                <Table
                  columns={columns}
                  dataSource={bookings}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 5 }}
                  locale={{ 
                    emptyText: (
                      <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Bạn chưa có kế hoạch vi vu nào"
                      >
                        <Button type="primary" onClick={() => navigate('/')}>Khám phá ngay</Button>
                      </Empty>
                    ) 
                  }}
                />
              </Card>
            )}
          </div>
        </Col>
      </Row>

      <Modal
        title={
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>
            <Title level={4} style={{ margin: 0 }}>Đánh giá dịch vụ</Title>
            {selectedBooking && <Text type="secondary" style={{ fontSize: 13 }}>{selectedBooking.hotel_name} - Phòng {selectedBooking.room_number}</Text>}
          </div>
        }
        open={isReviewModalOpen}
        onCancel={() => setIsReviewModalOpen(false)}
        footer={null}
        centered
        borderRadius={12}
      >
        <Form form={formReview} layout="vertical" onFinish={handleReviewSubmit} style={{ marginTop: 20 }}>
          <Form.Item name="rating" label="Chất lượng phòng & dịch vụ" rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}>
            <Rate allowHalf style={{ fontSize: 32 }} />
          </Form.Item>
          <Form.Item name="comment" label="Ý kiến đóng góp của bạn" rules={[{ required: true, message: 'Hãy chia sẻ một chút về cảm nhận của bạn' }]}>
            <TextArea rows={5} placeholder="Ví dụ: Phòng sạch sẽ, nhân viên hỗ trợ nhiệt tình, view rất đẹp..." style={{ borderRadius: 8 }} />
          </Form.Item>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <Button block size="large" onClick={() => setIsReviewModalOpen(false)}>Bỏ qua</Button>
            <Button type="primary" block size="large" htmlType="submit">Gửi phản hồi</Button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Profile;