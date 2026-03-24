import React, { useState, useEffect } from 'react';
import { 
  Layout, Menu, Card, Avatar, Button, Typography, Tag, 
  App as AntApp, Modal, Form, Input, Upload, Row, Col, Table, Space, Rate 
} from 'antd';
import { 
  UserOutlined, LockOutlined, HistoryOutlined, 
  EditOutlined, ArrowLeftOutlined, UploadOutlined, SafetyCertificateOutlined,
  MessageOutlined, StarOutlined, DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Profile = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const [activeTab, setActiveTab] = useState('info');
  const [formPassword] = Form.useForm();
  const [formReview] = Form.useForm();
  
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [bookings, setBookings] = useState([]); 
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem('bookings')) || [
      { id: 'BK001', hotelName: 'Vinpearl Luxury Nha Trang', roomType: 'Deluxe Ocean View', date: '20/03/2026', status: 'Hoàn tất', total: 2500000, userId: userData.id },
      { id: 'BK002', hotelName: 'Pullman Vũng Tàu', roomType: 'Superior King', date: '25/03/2026', status: 'Chờ xác nhận', total: 1800000, userId: userData.id }
    ];
    const userBookings = allBookings.filter(b => b.userId === userData.id || b.username === userData.username);
    setBookings(userBookings);
  }, [userData]);

  const handleCancelBooking = (bookingId) => {
    Modal.confirm({
      title: 'Xác nhận hủy phòng?',
      content: 'Lưu ý: Hành động này không thể hoàn tác. Bạn có chắc chắn muốn hủy đơn đặt phòng này?',
      okText: 'Hủy đơn',
      okType: 'danger',
      cancelText: 'Quay lại',
      onOk() {
        const updatedBookings = bookings.map(b => 
          b.id === bookingId ? { ...b, status: 'Đã hủy' } : b
        );
        setBookings(updatedBookings);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        message.success('Đã hủy phòng thành công!');
      },
    });
  };

  const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  const onFinishReview = (values) => {
    message.success('Cảm ơn bạn đã gửi đánh giá!');
    setIsReviewModalOpen(false);
    formReview.resetFields();
  };

  const onFinishPassword = (values) => {
    if (values.currentPassword !== userData.password) {
      return message.error('Mật khẩu hiện tại không đúng!');
    }
    const updatedUser = { ...userData, password: values.newPassword };
    setUserData(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsPasswordModalOpen(false);
    formPassword.resetFields();
    message.success('Đổi mật khẩu thành công!');
  };

  const handleBack = () => {
    switch (userData.role) {
      case 'admin': navigate('/admin/dashboard'); break;
      case 'partner': navigate('/partner/dashboard'); break;
      default: navigate('/'); break;
    }
  };

  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = { ...userData, avatar: reader.result };
        setUserData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        message.success('Cập nhật ảnh đại diện thành công!');
      };
      reader.readAsDataURL(file);
    }
  };

  const columns = [
    { title: 'Mã đơn', dataIndex: 'id', key: 'id' },
    { title: 'Khách sạn', dataIndex: 'hotelName', key: 'hotelName' },
    { title: 'Phòng', dataIndex: 'roomType', key: 'roomType' },
    { title: 'Ngày đặt', dataIndex: 'date', key: 'date' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Hoàn tất' ? 'green' : status === 'Đã hủy' ? 'red' : 'orange'}>{status}</Tag>
      )
    },
    { 
      title: 'Thao tác', 
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<MessageOutlined />} onClick={() => navigate('/messages')}>Chat</Button>
          {record.status !== 'Hoàn tất' && record.status !== 'Đã hủy' && (
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleCancelBooking(record.id)}>Hủy</Button>
          )}
          {record.status === 'Hoàn tất' && (
            <Button size="small" type="primary" ghost icon={<StarOutlined />} onClick={() => handleOpenReview(record)}>Đánh giá</Button>
          )}
        </Space>
      )
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Row gutter={0} style={{ minHeight: '100vh', width: '100%' }}>
        <Col xs={24} md={8} lg={5} style={{ background: '#001529' }}>
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
              <Avatar size={100} src={userData.avatar} icon={<UserOutlined />} style={{ border: '3px solid rgba(255,255,255,0.2)' }} />
              <Upload showUploadList={false} customRequest={() => {}} onChange={handleAvatarChange}>
                <Button shape="circle" size="small" icon={<UploadOutlined />} style={{ position: 'absolute', bottom: 5, right: 5 }} />
              </Upload>
            </div>
            <Title level={4} style={{ color: '#fff', margin: '10px 0 5px' }}>{userData.fullName || 'Người dùng'}</Title>
            <Tag color="blue">{userData.role?.toUpperCase() || 'KHÁCH HÀNG'}</Tag>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[activeTab]}
            onClick={({ key }) => {
              if (key === 'password') setIsPasswordModalOpen(true);
              else if (key === 'back') handleBack();
              else setActiveTab(key);
            }}
            items={[
              { key: 'info', icon: <UserOutlined />, label: 'Thông tin cá nhân' },
              { key: 'messages', icon: <MessageOutlined />, label: 'Tin nhắn chat' },
              { key: 'password', icon: <LockOutlined />, label: 'Đổi mật khẩu' },
              { key: 'back', icon: <ArrowLeftOutlined />, label: 'Quay về trang chủ' },
            ]}
          />
        </Col>

        <Col xs={24} md={16} lg={19} style={{ padding: '32px' }}>
          {activeTab === 'info' && (
            <Card title={<Title level={4} style={{ margin: 0 }}>Thông tin chi tiết</Title>} extra={<Button type="primary" ghost icon={<EditOutlined />}>Chỉnh sửa</Button>}>
              <div style={{ maxWidth: '800px' }}>
                {[
                  { label: 'Tên tài khoản', value: userData.username, bold: true },
                  { label: 'Họ và tên', value: userData.fullName },
                  { label: 'Email', value: userData.email },
                  { label: 'Số điện thoại', value: userData.phone || '0987.xxx.xxx' },
                  { label: 'Ngày tham gia', value: userData.createdAt || '11/03/2026' }
                ].map((item, index, arr) => (
                  <Row key={index} style={{ padding: '20px 0', borderBottom: index === arr.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
                    <Col span={8}><Text type="secondary">{item.label}</Text></Col>
                    <Col span={16}><Text strong={item.bold}>{item.value || 'N/A'}</Text></Col>
                  </Row>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'messages' && (
            <Card title={<Title level={4} style={{ margin: 0 }}>Tin nhắn hỗ trợ</Title>}>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <MessageOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <p style={{ marginTop: 16 }}>Chưa có cuộc hội thoại nào. Hãy liên hệ với khách sạn để được hỗ trợ!</p>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      {/* MODAL ĐÁNH GIÁ */}
      <Modal title={`Đánh giá: ${selectedBooking?.hotelName}`} open={isReviewModalOpen} onCancel={() => setIsReviewModalOpen(false)} onOk={() => formReview.submit()} okText="Gửi đánh giá">
        <Form form={formReview} layout="vertical" onFinish={onFinishReview}>
          <Form.Item name="rate" label="Chất lượng dịch vụ" rules={[{ required: true }]}><Rate /></Form.Item>
          <Form.Item name="comment" label="Nội dung" rules={[{ required: true }]}><TextArea rows={4} /></Form.Item>
        </Form>
      </Modal>

      {/* MODAL ĐỔI MẬT KHẨU */}
      <Modal title="Đổi mật khẩu" open={isPasswordModalOpen} onCancel={() => setIsPasswordModalOpen(false)} onOk={() => formPassword.submit()}>
        <Form form={formPassword} layout="vertical" onFinish={onFinishPassword}>
          <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={[{ required: true }]}><Input.Password prefix={<SafetyCertificateOutlined />} /></Form.Item>
          <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, min: 6 }]}><Input.Password prefix={<LockOutlined />} /></Form.Item>
          <Form.Item name="confirm" label="Xác nhận" dependencies={['newPassword']} rules={[{ required: true }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('newPassword') === value) return Promise.resolve(); return Promise.reject(new Error('Không khớp!')); } })]}><Input.Password prefix={<LockOutlined />} /></Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Profile;