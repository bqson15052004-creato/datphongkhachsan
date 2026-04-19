import React, { useState, useEffect } from 'react';
import {
  Layout, Menu, Card, Avatar, Button, Typography, Tag,
  Modal, Form, Input, Row, Col, Table, Space, Rate, App as AntApp, Descriptions, Badge
} from 'antd';
import {
  UserOutlined, HistoryOutlined,
  ArrowLeftOutlined, StarOutlined, DeleteOutlined, 
  LogoutOutlined, VerifiedOutlined, CarryOutOutlined,
  LockOutlined, EditOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MOCK_BOOKINGS, MOCK_USERS } from '../../constants/mockData';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Profile = () => {
  const navigate = useNavigate();
  const { message: antdMessage, modal: antdModal } = AntApp.useApp();
  
  const [activeTab, setActiveTab] = useState('info');
  const [formReview] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [formPassword] = Form.useForm();
  
  const [userData, setUserData] = useState(
    JSON.parse(sessionStorage.getItem('user')) || MOCK_USERS[2] 
  );
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchUserProfile = () => {
    const sessionUser = JSON.parse(sessionStorage.getItem('user'));
    if (sessionUser) setUserData(sessionUser);
  };

  const fetchUserBookings = () => {
    setLoading(true);
    setTimeout(() => {
      const myBookings = MOCK_BOOKINGS.filter(b => b.id_user === userData.id);
      setBookings(myBookings);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserBookings();
  }, [userData.id]);

  const handleLogout = () => {
    sessionStorage.clear();
    antdMessage.success("Đã đăng xuất thành công");
    navigate('/');
  };

  const handleUpdateProfile = (values) => {
    setLoading(true);
    setTimeout(() => {
      const newData = { ...userData, ...values };
      setUserData(newData);
      sessionStorage.setItem('user', JSON.stringify(newData));
      antdMessage.success("Cập nhật thông tin thành công!");
      setIsUpdateModalOpen(false);
      setLoading(false);
    }, 800);
  };

  const handleChangePassword = (values) => {
    setLoading(true);
    setTimeout(() => {
      antdMessage.success("Đổi mật khẩu thành công!");
      setIsPasswordModalOpen(false);
      formPassword.resetFields();
      setLoading(false);
    }, 800);
  };

  const columns = [
    { title: 'Mã đơn', dataIndex: 'id', key: 'id', render: (id) => <Text code>{id}</Text> },
    { title: 'Khách sạn', dataIndex: 'hotel_name', key: 'hotel_name', render: (name) => <Text strong>{name}</Text> },
    {
      title: 'Thời gian',
      key: 'dates',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 13 }}><Badge status="processing" /> Vào: <b>{record.check_in}</b></Text>
          <Text style={{ fontSize: 13 }}><Badge status="warning" /> Ra: <b>{record.check_out}</b></Text>
        </Space>
      )
    },
    {
      title: 'Giá tiền',
      dataIndex: 'total_price',
      key: 'total_price',
      align: 'right',
      render: (total) => <Text strong style={{ color: '#ff4d4f' }}>{total?.toLocaleString()}₫</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'Confirmed': { color: 'success', text: 'Đã xác nhận' },
          'Cancelled': { color: 'error', text: 'Đã hủy' },
          'Pending': { color: 'processing', text: 'Chưa xác nhận' }
        };
        const current = statusMap[status] || { color: 'default', text: status };
        return <Badge status={current.color} text={current.text} />;
      }
    },
    {
        title: 'Hành động',
        key: 'action',
        align: 'center',
        render: (_, record) => (
          <Space>
            {record.status === 'Pending' && (
              <Button size="small" danger ghost onClick={() => {
                antdModal.confirm({
                    title: 'Xác nhận hủy đơn?',
                    content: 'Hành động này không thể hoàn tác.',
                    okText: 'Hủy đơn',
                    okType: 'danger',
                    onOk: () => {
                        setBookings(prev => prev.map(b => b.id === record.id ? {...b, status: 'Cancelled'} : b));
                        antdMessage.success('Đã hủy đơn');
                    }
                })
              }}>Hủy đơn</Button>
            )}
            {record.status === 'Confirmed' && <Tag color="default">Chờ trả phòng</Tag>}
          </Space>
        )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f4f7fe' }}>
      <Row gutter={0} style={{ minHeight: '100vh', width: '100%' }}>
        {/* SIDEBAR */}
        <Col xs={24} lg={5} style={{ background: '#001529' }}>
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Badge count={<VerifiedOutlined style={{ color: '#52c41a' }} />} offset={[-10, 80]}>
              <Avatar size={90} src={userData.avatar} icon={<UserOutlined />} />
            </Badge>
            <Title level={4} style={{ color: '#fff', marginTop: 15 }}>{userData.full_name}</Title>
            <Text style={{ color: 'rgba(255,255,255,0.45)' }}>{userData.email}</Text>
          </div>
          
          <Menu
            theme="dark" mode="inline" selectedKeys={[activeTab]}
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

        {/* CONTENT */}
        <Col xs={24} lg={19} style={{ padding: '40px' }}>
          {activeTab === 'info' ? (
            <Card variant={false} style={{ borderRadius: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>Thông tin cá nhân</Title>
                {/* ĐÂY RỒI ÔNG SƠN ƠI: 2 NÚT NẰM CẠNH NHAU */}
                <Space>
                  <Button type="primary" icon={<EditOutlined />} onClick={() => {
                    formUpdate.setFieldsValue(userData);
                    setIsUpdateModalOpen(true);
                  }}>
                    Cập nhật thông tin
                  </Button>
                  <Button icon={<LockOutlined />} onClick={() => setIsPasswordModalOpen(true)}>
                    Đổi mật khẩu
                  </Button>
                </Space>
              </div>

              <Descriptions bordered column={1}>
                <Descriptions.Item label="Họ và tên">{userData.full_name}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ Email">{userData.email}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{userData.phone || 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Vai trò"><Tag color="gold">{userData.role?.toUpperCase()}</Tag></Descriptions.Item>
              </Descriptions>
            </Card>
          ) : (
            <Card bordered={false} style={{ borderRadius: 16 }}>
              <Title level={3}>Lịch sử đặt phòng</Title>
              <Table columns={columns} dataSource={bookings} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} />
            </Card>
          )}
        </Col>
      </Row>

      {/* MODAL CẬP NHẬT THÔNG TIN */}
      <Modal
        title="Cập nhật hồ sơ cá nhân"
        open={isUpdateModalOpen}
        onCancel={() => setIsUpdateModalOpen(false)}
        onOk={() => formUpdate.submit()}
        confirmLoading={loading}
        centered
      >
        <Form form={formUpdate} layout="vertical" onFinish={handleUpdateProfile} style={{ marginTop: 20 }}>
          <Form.Item name="full_name" label="Họ và tên" rules={[{ required: true, message: 'Không được để trống tên!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input placeholder="Nhập số điện thoại..." />
          </Form.Item>
          <Form.Item name="avatar" label="Link ảnh đại diện">
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL ĐỔI MẬT KHẨU */}
      <Modal
        title="Đổi mật khẩu bảo mật"
        open={isPasswordModalOpen}
        onCancel={() => setIsPasswordModalOpen(false)}
        onOk={() => formPassword.submit()}
        confirmLoading={loading}
        centered
      >
        <Form form={formPassword} layout="vertical" onFinish={handleChangePassword} style={{ marginTop: 20 }}>
          <Form.Item name="oldPassword" label="Mật khẩu hiện tại" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, min: 6, message: 'Tối thiểu 6 ký tự!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item 
            name="confirmPassword" 
            label="Xác nhận mật khẩu mới" 
            dependencies={['newPassword']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              })
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Profile;