import React, { useState, useEffect } from 'react';
import { 
  Layout, Menu, Card, Avatar, Button, Typography, Tag, 
  Modal, Form, Input, Upload, Row, Col, Table, Space, Rate, Empty, message
} from 'antd';
import { 
  UserOutlined, LockOutlined, HistoryOutlined, 
  EditOutlined, ArrowLeftOutlined, UploadOutlined,
  MessageOutlined, StarOutlined, DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [formReview] = Form.useForm();
  
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [bookings, setBookings] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // 1. Lấy danh sách đơn đặt phòng từ API
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/api/hotels/bookings/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Lỗi lấy lịch sử đặt phòng:", error);
      message.error("Không thể tải lịch sử đặt phòng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 2. Logic Hủy phòng
  const handleCancelBooking = (bookingId) => {
    Modal.confirm({
      title: 'Xác nhận hủy phòng?',
      content: 'Lưu ý: Bạn chỉ có thể hủy phòng khi trạng thái là "Chờ xác nhận".',
      okText: 'Xác nhận hủy',
      okType: 'danger',
      async onOk() {
        try {
          const token = localStorage.getItem('access_token');
          await axios.delete(`http://127.0.0.1:8000/api/hotels/bookings/${bookingId}/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          message.success('Đã hủy phòng thành công!');
          fetchBookings();
        } catch (error) {
          message.error("Không thể hủy phòng vào lúc này.");
        }
      },
    });
  };

  // 3. Logic Gửi đánh giá (POST lên /api/hotels/reviews/)
  const handleReviewSubmit = async (values) => {
    try {
      const token = localStorage.getItem('access_token');
      const reviewData = {
        room: selectedBooking.room, // ID phòng lấy từ đơn đặt
        rating: values.rating,
        comment: values.comment
      };

      await axios.post('http://127.0.0.1:8000/api/hotels/reviews/', reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      message.success('Cảm ơn bạn đã đánh giá dịch vụ!');
      setIsReviewModalOpen(false);
      formReview.resetFields();
    } catch (error) {
      message.error("Gửi đánh giá thất bại.");
    }
  };

  const columns = [
    { title: 'Mã đơn', dataIndex: 'id', key: 'id', width: 80 },
    { 
      title: 'Khách sạn / Phòng', 
      key: 'hotel',
      render: (record) => (
        <div>
          <Text strong>KS {record.hotel_owner_name}</Text><br/>
          <Text type="secondary" style={{fontSize: 12}}>Phòng: {record.room_number}</Text>
        </div>
      )
    },
    { 
      title: 'Thời gian', 
      key: 'time',
      render: (record) => (
        <Text style={{fontSize: 13}}>{record.check_in} → {record.check_out}</Text>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        let color = status === 'Confirmed' ? 'green' : status === 'Cancelled' ? 'red' : 'orange';
        let text = status === 'Confirmed' ? 'Đã xác nhận' : status === 'Cancelled' ? 'Đã hủy' : 'Chờ xác nhận';
        return <Tag color={color}>{text}</Tag>
      }
    },
    { 
      title: 'Tổng tiền', 
      dataIndex: 'total_price', 
      render: (total) => <Text strong color="red">{parseFloat(total).toLocaleString()}đ</Text> 
    },
    { 
      title: 'Thao tác', 
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'Pending' && (
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleCancelBooking(record.id)}>Hủy</Button>
          )}
          {record.status === 'Confirmed' && (
            <Button size="small" type="primary" ghost icon={<StarOutlined />} onClick={() => { setSelectedBooking(record); setIsReviewModalOpen(true); }}>Đánh giá</Button>
          )}
        </Space>
      )
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Row gutter={0} style={{ minHeight: '100vh', width: '100%' }}>
        {/* SIDEBAR */}
        <Col xs={24} md={8} lg={5} style={{ background: '#001529', color: '#fff' }}>
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Avatar size={100} icon={<UserOutlined />} style={{ border: '3px solid rgba(255,255,255,0.2)', backgroundColor: '#1890ff' }} />
            <Title level={4} style={{ color: '#fff', margin: '15px 0' }}>{userData.fullName}</Title>
            <Tag color="gold">THÀNH VIÊN VIP</Tag>
          </div>
          
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[activeTab]}
            onClick={({ key }) => (key === 'back' ? navigate('/') : setActiveTab(key))}
            items={[
              { key: 'info', icon: <UserOutlined />, label: 'Thông tin cá nhân' },
              { key: 'history', icon: <HistoryOutlined />, label: 'Lịch sử đặt phòng' },
              { key: 'back', icon: <ArrowLeftOutlined />, label: 'Về trang chủ' },
            ]}
          />
        </Col>

        {/* MAIN CONTENT */}
        <Col xs={24} md={16} lg={19} style={{ padding: '32px' }}>
          {activeTab === 'info' && (
            <Card title="Hồ sơ cá nhân">
               <Row style={{ padding: '15px 0', borderBottom: '1px solid #f0f0f0' }}>
                <Col span={8}><Text type="secondary">Họ và tên</Text></Col>
                <Col span={16}><Text strong>{userData.fullName}</Text></Col>
              </Row>
              <Row style={{ padding: '15px 0', borderBottom: '1px solid #f0f0f0' }}>
                <Col span={8}><Text type="secondary">Email</Text></Col>
                <Col span={16}><Text>{userData.email}</Text></Col>
              </Row>
            </Card>
          )}

          {activeTab === 'history' && (
            <Card title="Lịch sử chuyến đi">
              <Table 
                columns={columns} 
                dataSource={bookings} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 6 }}
                locale={{ emptyText: <Empty description="Bạn chưa có chuyến đi nào" /> }}
              />
            </Card>
          )}
        </Col>
      </Row>

      {/* MODAL ĐÁNH GIÁ */}
      <Modal
        title="Đánh giá kỳ nghỉ"
        open={isReviewModalOpen}
        onCancel={() => setIsReviewModalOpen(false)}
        footer={null}
      >
        <Form form={formReview} layout="vertical" onFinish={handleReviewSubmit}>
          <Form.Item name="rating" label="Bạn cảm thấy thế nào?" rules={[{ required: true }]}>
            <Rate />
          </Form.Item>
          <Form.Item name="comment" label="Chia sẻ trải nghiệm của bạn" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
            <TextArea rows={4} placeholder="Phòng sạch sẽ, view đẹp..." />
          </Form.Item>
          <Button type="primary" block htmlType="submit">Gửi đánh giá</Button>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Profile;