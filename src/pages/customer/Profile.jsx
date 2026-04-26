import React, { useState, useEffect } from 'react';
import { 
  Layout, Menu, Button, theme, Avatar, Typography, 
  Badge, Card, Row, Col, Descriptions, Table, Tag, Modal, App as AntApp, Space, Form, Input, Divider, Tooltip, Rate 
} from 'antd';
import {
  UserOutlined, HistoryOutlined, LogoutOutlined,
  EditOutlined, LockOutlined, PhoneOutlined,
  VerifiedOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// IMPORT MOCK DATA
import { MOCK_BOOKINGS, MOCK_USERS, MOCK_REVIEWS } from '../../constants/mockData.jsx';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const Profile = () => {
  const navigate = useNavigate();
  const { message: antdMessage, modal: antdModal } = AntApp.useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState('info');
  
  const [formUpdate] = Form.useForm();
  const [formPassword] = Form.useForm();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [userData, setUserData] = useState(
    JSON.parse(sessionStorage.getItem('user')) || MOCK_USERS.find(u => u.id === 3) 
  );
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    const sessionUser = JSON.parse(sessionStorage.getItem('user'));
    if (sessionUser) setUserData(sessionUser);
    
    setLoading(true);
    setTimeout(() => {
      const myId = sessionUser?.id || userData.id;
      const myBookings = MOCK_BOOKINGS.filter(b => b.id_user === myId);
      setBookings(myBookings);
      setLoading(false);
    }, 500);
  }, [userData.id]);

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

  const handleLogout = () => {
    antdModal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn có muốn thoát khỏi tài khoản không?',
      okText: 'Đăng xuất',
      okType: 'danger',
      onOk: () => {
        sessionStorage.clear();
        navigate('/');
      }
    });
  };

  // CẤU HÌNH CÁC CỘT (TÁCH RIÊNG NGÀY NHẬN/TRẢ)
  const columns = [
    { 
      title: 'Mã', 
      dataIndex: 'id', 
      key: 'id', 
      width: 65,
      render: (id) => <Text code style={{ fontSize: '12px' }}>#{id}</Text> 
    },
    { 
      title: 'Khách sạn', 
      dataIndex: 'hotel_name', 
      key: 'hotel_name', 
      ellipsis: true,
      render: (name) => <Text strong style={{ color: '#1890ff', fontSize: '13px' }}>{name}</Text> 
    },
    { 
      title: 'Phòng', 
      dataIndex: 'room_number', 
      key: 'room_number',
      width: 65,
      align: 'center'
    },
    { 
      title: 'Ngày nhận', 
      dataIndex: 'check_in', 
      key: 'check_in',
      width: 100,
      render: (date) => <Text style={{ fontSize: '12px' }}>{dayjs(date).format('DD/MM/YYYY')}</Text>
    },
    { 
      title: 'Ngày trả', 
      dataIndex: 'check_out', 
      key: 'check_out',
      width: 100,
      render: (date) => <Text style={{ fontSize: '12px' }}>{dayjs(date).format('DD/MM/YYYY')}</Text>
    },
    { 
      title: 'Tổng tiền', 
      dataIndex: 'total_price', 
      key: 'total_price', 
      width: 110,
      render: (val) => <Text strong type="danger" style={{ fontSize: '13px' }}>{val?.toLocaleString()}₫</Text> 
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status) => {
        let color = status === 'Confirmed' ? 'green' : status === 'Pending' ? 'gold' : 'red';
        let text = status === 'Confirmed' ? 'Xong' : status === 'Pending' ? 'Chờ' : 'Hủy';
        return <Tag color={color} style={{ margin: 0, fontSize: '11px' }}>{text}</Tag>;
      }
    },
    { 
      title: 'Đánh giá', 
      key: 'review',
      align: 'center',
      width: 130,
      render: (record) => {
        const userReview = MOCK_REVIEWS.find(
          (r) => r.id_user === record.id_user && r.id_hotel === record.id_hotel
        );

        if (record.status !== 'Confirmed') return <Text type="secondary">-</Text>;

        if (userReview) {
          return (
            <Space direction="vertical" size={0}>
              <Rate disabled defaultValue={userReview.rate} style={{ fontSize: 10 }} />
              <Button 
                type="link" 
                size="small" 
                style={{ fontSize: '11px', padding: 0, height: 'auto' }}
                onClick={() => {
                  antdModal.info({
                    title: `Nhận xét của bạn - ${record.hotel_name}`,
                    content: (
                      <div style={{ marginTop: 15 }}>
                        <Rate disabled defaultValue={userReview.rate} />
                        <Divider style={{ margin: '12px 0' }} />
                        <Text italic>"{userReview.comment}"</Text>
                        <Text type="secondary" style={{ display: 'block', marginTop: 10, fontSize: 12 }}>
                          Ngày đánh giá: {dayjs(userReview.date).format('DD/MM/YYYY')}
                        </Text>
                      </div>
                    ),
                  });
                }}
              >
                Xem nhận xét
              </Button>
            </Space>
          );
        }

        return (
          <Button 
            type="primary" size="small" ghost icon={<StarOutlined />} 
            onClick={() => antdMessage.success(`Mở form đánh giá cho ${record.hotel_name}`)}
          >
            Đánh giá
          </Button>
        );
      }
    },
  ];

  const renderUserInfo = () => (
    <Card variant={false} style={{ borderRadius: borderRadiusLG }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}><UserOutlined /> Thông tin cá nhân</Title>
        <Space>
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => {
            formUpdate.setFieldsValue(userData);
            setIsUpdateModalOpen(true);
          }}>Sửa</Button>
          <Button icon={<LockOutlined />} onClick={() => setIsPasswordModalOpen(true)}>Mật khẩu</Button>
        </Space>
      </div>
      <Divider />
      <Row gutter={[32, 32]} align="middle">
        <Col xs={24} md={8} style={{ textAlign: 'center' }}>
          <Badge count={<VerifiedOutlined style={{ color: '#52c41a', fontSize: 20 }} />} offset={[-10, 100]}>
            <Avatar size={140} src={userData.avatar} icon={<UserOutlined />} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          </Badge>
          <Title level={3} style={{ marginTop: 16 }}>{userData.full_name}</Title>
          <Tag color="blue">CUSTOMER</Tag>
        </Col>
        <Col xs={24} md={16}>
          <Descriptions column={1} bordered labelStyle={{ fontWeight: 'bold', width: '140px' }}>
            <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
            <Descriptions.Item label="Điện thoại">{userData.phone || 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái"><Tag color="green">Đã xác minh</Tag></Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );

  return (
    <Layout style={{ minHeight: '85vh', background: '#f5f5f5', borderRadius: borderRadiusLG, overflow: 'hidden' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" width={220} style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '24px 16px', textAlign: 'center' }}>
           {!collapsed && <Text strong style={{ fontSize: 16, color: '#1890ff' }}>MY PROFILE</Text>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentTab]}
          onClick={({ key }) => (key === 'logout' ? handleLogout() : setCurrentTab(key))}
          items={[
            { key: 'info', icon: <UserOutlined />, label: 'Thông tin cá nhân' },
            { key: 'history', icon: <HistoryOutlined />, label: 'Lịch sử đặt phòng' },
            { type: 'divider' },
            { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
          ]}
        />
      </Sider>
      
      <Layout>
        <Header style={{ background: colorBgContainer, padding: 0, display: 'flex', alignItems: 'center', height: 64 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ width: 64, height: 64 }}
          />
        </Header>
        
        <Content style={{ margin: '20px', minHeight: 280 }}>
          {currentTab === 'info' ? renderUserInfo() : (
            <Card variant={false} style={{ borderRadius: borderRadiusLG }}>
               <Title level={4} style={{ marginBottom: 20 }}><HistoryOutlined /> Lịch sử chuyến đi</Title>
               <Table 
                 columns={columns} 
                 dataSource={bookings} 
                 rowKey="id" 
                 loading={loading} 
                 pagination={{ pageSize: 6 }}
                 size="small"
                 scroll={{ x: 'max-content' }}
               />
            </Card>
          )}
        </Content>
      </Layout>

      <Modal title="Cập nhật hồ sơ" open={isUpdateModalOpen} onCancel={() => setIsUpdateModalOpen(false)} onOk={() => formUpdate.submit()} confirmLoading={loading}>
        <Form form={formUpdate} layout="vertical" onFinish={handleUpdateProfile}>
          <Form.Item name="full_name" label="Họ và tên" rules={[{ required: true }]}><Input size="large" /></Form.Item>
          <Form.Item name="phone" label="Số điện thoại"><Input size="large" /></Form.Item>
          <Form.Item name="avatar" label="URL Ảnh đại diện"><Input size="large" /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Đổi mật khẩu" open={isPasswordModalOpen} onCancel={() => setIsPasswordModalOpen(false)} onOk={() => formPassword.submit()} confirmLoading={loading}>
        <Form form={formPassword} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item name="oldPassword" label="Mật khẩu cũ" rules={[{ required: true }]}><Input.Password size="large" /></Form.Item>
          <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, min: 6 }]}><Input.Password size="large" /></Form.Item>
          <Form.Item name="confirm" label="Xác nhận" dependencies={['newPassword']} rules={[{ required: true }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('newPassword') === value) return Promise.resolve(); return Promise.reject(new Error('Không khớp!')); } })]}><Input.Password size="large" /></Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Profile;