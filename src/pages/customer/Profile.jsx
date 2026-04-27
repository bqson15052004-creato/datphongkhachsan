import React, { useState, useEffect } from 'react';
import { 
  Layout, Menu, Button, theme, Avatar, Typography, 
  Card, Row, Col, Descriptions, Tag, Modal, App as AntApp, Space, Form, Input, Divider, Upload, Image 
} from 'antd';
import {
  UserOutlined, LogoutOutlined, EditOutlined, LockOutlined,
  VerifiedOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  UploadOutlined, PaperClipOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// IMPORT MOCK DATA
import { MOCK_USERS } from '../../constants/mockData.jsx';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const Profile = () => {
  const navigate = useNavigate();
  const { message: antdMessage, modal: antdModal } = AntApp.useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [formUpdate] = Form.useForm();
  
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const [userData, setUserData] = useState(
    JSON.parse(sessionStorage.getItem('user')) || MOCK_USERS.find(u => u.id === 3) 
  );
  
  // State quản lý việc upload ảnh
  const [loading, setLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const [previewImage, setPreviewImage] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    const sessionUser = JSON.parse(sessionStorage.getItem('user'));
    if (sessionUser) setUserData(sessionUser);
    window.scrollTo(0, 0);
  }, []);

  // Xử lý khi chọn file từ máy tính
  const handleFileChange = ({ file }) => {
    if (file.status === 'removed') {
      setPreviewImage("");
      setUploadedFile(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result); // Tạo base64 để xem trước
      setUploadedFile(file);
    };
    reader.readAsDataURL(file.originFileObj);
  };

  const handleUpdateProfile = (values) => {
    setLoading(true);
    setTimeout(() => {
      // Nếu có ảnh mới thì lấy ảnh mới (base64), không thì giữ ảnh cũ
      const newData = { 
        ...userData, 
        ...values, 
        avatar: previewImage || userData.avatar 
      };
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

  const renderUserInfo = () => (
    <Card bordered={false} style={{ borderRadius: borderRadiusLG }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}><UserOutlined /> Thông tin cá nhân</Title>
        <Space>
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => {
            formUpdate.setFieldsValue(userData);
            setPreviewImage(userData.avatar); // Hiển thị ảnh hiện tại trong modal
            setUploadedFile(null);
            setIsUpdateModalOpen(true);
          }}>Sửa hồ sơ</Button>
          <Button icon={<LockOutlined />} onClick={() => setIsPasswordModalOpen(true)}>Đổi mật khẩu</Button>
        </Space>
      </div>
      <Divider />
      <Row gutter={[32, 32]} align="middle">
        <Col xs={24} md={8} style={{ textAlign: 'center' }}>
          <Avatar size={140} src={userData.avatar} icon={<UserOutlined />} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          <Title level={3} style={{ marginTop: 16 }}>{userData.full_name}</Title>
          <Space>
             <Tag color="blue">CUSTOMER</Tag>
             <Tag color="green" icon={<VerifiedOutlined />}>Đã xác minh</Tag>
          </Space>
        </Col>
        <Col xs={24} md={16}>
          <Descriptions column={1} bordered labelStyle={{ fontWeight: 'bold', width: '140px' }}>
            <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
            <Descriptions.Item label="Điện thoại">{userData.phone || 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label="Ngày tham gia">22/04/2026</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">Hà Nội, Việt Nam</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );

  return (
    <Layout style={{ minHeight: '85vh', background: '#f5f5f5', borderRadius: borderRadiusLG, overflow: 'hidden' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" width={220} style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '24px 16px', textAlign: 'center' }}>
            {!collapsed && <Text strong style={{ fontSize: 16, color: '#1890ff' }}>TÀI KHOẢN</Text>}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['info']}
          onClick={({ key }) => key === 'logout' && handleLogout()}
          items={[
            { key: 'info', icon: <UserOutlined />, label: 'Thông tin cá nhân' },
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
          {renderUserInfo()}
        </Content>
      </Layout>

      {/* MODAL CẬP NHẬT - PHẦN ÔNG CẦN ĐÂY */}
      <Modal 
        title="Cập nhật hồ sơ" 
        open={isUpdateModalOpen} 
        onCancel={() => setIsUpdateModalOpen(false)} 
        onOk={() => formUpdate.submit()} 
        confirmLoading={loading}
        okText="Lưu lại"
        cancelText="Hủy"
      >
        <Form form={formUpdate} layout="vertical" onFinish={handleUpdateProfile}>
          <Form.Item name="full_name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input size="large" />
          </Form.Item>
          
          <Form.Item name="phone" label="Số điện thoại">
            <Input size="large" />
          </Form.Item>

          {/* PHẦN TẢI ẢNH GIỐNG MẪU */}
          <Form.Item label="Ảnh đại diện">
            <Upload
              maxCount={1}
              beforeUpload={() => false} // Chặn auto upload lên server
              showUploadList={false}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />}>Chọn file từ máy tính</Button>
            </Upload>

            {uploadedFile && (
              <div style={{ marginTop: 8 }}>
                <PaperClipOutlined style={{ color: '#1890ff' }} /> 
                <Text type="secondary" style={{ marginLeft: 8, color: '#1890ff' }}>{uploadedFile.name}</Text>
              </div>
            )}

            {previewImage && (
              <div style={{ marginTop: 16 }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Xem trước:</Text>
                <Image
                  src={previewImage}
                  width={100}
                  height={100}
                  style={{ borderRadius: 8, objectFit: 'cover', border: '1px solid #f0f0f0' }}
                />
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Đổi mật khẩu" open={isPasswordModalOpen} onCancel={() => setIsPasswordModalOpen(false)} onOk={() => setIsPasswordModalOpen(false)}>
        <Form layout="vertical">
          <Form.Item label="Mật khẩu hiện tại" required><Input.Password size="large" /></Form.Item>
          <Form.Item label="Mật khẩu mới" required><Input.Password size="large" /></Form.Item>
          <Form.Item label="Xác nhận mật khẩu mới" required><Input.Password size="large" /></Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Profile;