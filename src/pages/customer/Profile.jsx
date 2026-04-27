import React, { useState, useEffect } from 'react';
import { 
  Layout, Menu, Button, theme, Avatar, Typography, 
  Badge, Card, Row, Col, Descriptions, Table, Tag, Modal, App as AntApp, Space, Form, Input, Divider, Rate 
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

  // LOGIC: LẤY DỮ LIỆU TỪ LOCALSTORAGE + MOCK
  useEffect(() => {
    const sessionUser = JSON.parse(sessionStorage.getItem('user'));
    if (sessionUser) setUserData(sessionUser);
    
    setLoading(true);
    setTimeout(() => {
      const myId = sessionUser?.id || userData.id;
      const staticBookings = MOCK_BOOKINGS.filter(b => b.id_user === myId);
      const localData = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      const myLocalBookings = localData.filter(b => b.id_user === myId);

      setBookings([...myLocalBookings.reverse(), ...staticBookings]);
      setLoading(false);
    }, 600);
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

  // CẤU HÌNH CÁC CỘT - ĐÃ TÁCH RIÊNG NGÀY NHẬN & NGÀY TRẢ
  const columns = [
    { 
      title: 'Mã đơn', 
      dataIndex: 'id_booking',
      key: 'id_booking', 
      width: 110,
      render: (id, record) => <Text code style={{ fontSize: '11px' }}>{id || `#${record.id}`}</Text> 
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
      width: 70,
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
      render: (val) => <Text strong type="danger" style={{ fontSize: '13px' }}>{Number(val)?.toLocaleString()}₫</Text> 
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => {
        const s = status?.toLowerCase();
        let color = s === 'confirmed' ? 'green' : s === 'pending' ? 'gold' : 'red';
        let text = s === 'confirmed' ? 'Đã xác nhận' : s === 'pending' ? 'Đang chờ xác nhận' : 'Đã hủy';
        return <Tag color={color} style={{ margin: 0, fontSize: '11px' }}>{text}</Tag>;
      }
    },
    { 
      title: 'Đánh giá', 
      key: 'review',
      align: 'center',
      width: 140, // Tăng nhẹ width để hiện sao cho đẹp
      render: (record) => {
        const userReview = MOCK_REVIEWS.find(
          (r) => r.id_user === record.id_user && r.id_hotel === record.id_hotel
        );

        // 1. Case: Đơn chưa được xác nhận hoặc đã hủy -> Không cho đánh giá
        if (record.status?.toLowerCase() !== 'confirmed') {
          return <Text type="secondary" style={{ fontSize: '11px' }}>-</Text>;
        }

        // 2. Case: Đã có đánh giá trong hệ thống
        if (userReview) {
          return (
            <Space direction="vertical" size={0} style={{ display: 'flex', alignItems: 'center' }}>
              <Rate disabled defaultValue={userReview.rate} style={{ fontSize: 12 }} />
              <Button 
                type="link" 
                size="small" 
                style={{ fontSize: '11px', height: '20px', padding: 0 }}
                onClick={() => {
                  antdModal.info({
                    title: `Nhận xét của bạn - ${record.hotel_name}`,
                    content: (
                      <div style={{ marginTop: 15 }}>
                        <Rate disabled defaultValue={userReview.rate} />
                        <Divider style={{ margin: '12px 0' }} />
                        <Text italic>"{userReview.comment}"</Text>
                      </div>
                    ),
                  });
                }}
              >
                Chi tiết
              </Button>
            </Space>
          );
        }

        // 3. Case: Đã xác nhận nhưng chưa đánh giá
        return (
          <Button 
            type="primary" 
            size="small" 
            ghost 
            icon={<StarOutlined />} 
            style={{ fontSize: '11px', borderRadius: '4px' }}
            onClick={() => antdMessage.info(`Đang mở form đánh giá cho ${record.hotel_name}`)}
          >
            Đánh giá
          </Button>
        );
      }
    },
  ];

  const renderUserInfo = () => (
    <Card bordered={false} style={{ borderRadius: borderRadiusLG }}>
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
            <Card bordered={false} style={{ borderRadius: borderRadiusLG }}>
               <Title level={4} style={{ marginBottom: 20 }}><HistoryOutlined /> Lịch sử chuyến đi</Title>
               <Table 
                 columns={columns} 
                 dataSource={bookings} 
                 rowKey={(record) => record.id_booking || record.id} 
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
    </Layout>
  );
};

export default Profile;