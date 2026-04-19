import React, { useState, useEffect } from 'react';
import { 
  Card, Descriptions, Tag, Avatar, Typography, Divider, 
  Button, Space, Modal, Form, Input, App as AntApp, Row, Col 
} from 'antd';
import { 
  SafetyCertificateOutlined, 
  UserOutlined, 
  MailOutlined, 
  EditOutlined, 
  KeyOutlined,
  LockOutlined,
  ThunderboltOutlined,
  IdcardOutlined,
  HistoryOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminProfile = () => {
  const { message } = AntApp.useApp();
  
  const [user, setUser] = useState({});
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formUpdate] = Form.useForm();
  const [formPassword] = Form.useForm();

  useEffect(() => {
    const sessionUser = JSON.parse(sessionStorage.getItem('user')) || {
      id: 'ADMIN-001',
      full_name: 'Sơn Admin',
      email: 'admin@system.com',
      avatar: '',
      phone: '0988 888 888'
    };
    setUser(sessionUser);
    formUpdate.setFieldsValue(sessionUser);
  }, [formUpdate]);

  const handleUpdate = (values) => {
    setLoading(true);
    setTimeout(() => {
      const updatedUser = { ...user, ...values };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      message.success('Cập nhật hồ sơ Admin thành công!');
      setIsEditModalVisible(false);
      setLoading(false);
    }, 800);
  };

  const handlePasswordChange = (values) => {
    setLoading(true);
    setTimeout(() => {
      message.success('Đổi mật khẩu quản trị thành công!');
      setIsPasswordModalVisible(false);
      formPassword.resetFields();
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Card 
        bordered={false}
        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        title={
          <Space>
            <SafetyCertificateOutlined style={{ color: '#ff4d4f', fontSize: '22px' }} /> 
            <Title level={4} style={{ margin: 0 }}>Hệ thống Quản trị viên</Title>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<EditOutlined />} onClick={() => setIsEditModalVisible(true)}>
              Sửa hồ sơ
            </Button>
            <Button type="primary" danger icon={<KeyOutlined />} onClick={() => setIsPasswordModalVisible(true)}>
              Đổi mật khẩu
            </Button>
          </Space>
        }
      >
        <Row gutter={[48, 16]}>
          {/* CỘT TRÁI: THÔNG TIN NHÂN DIỆN */}
          <Col xs={24} md={12}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 20 }}>
              <Avatar size={80} src={user.avatar} icon={<UserOutlined />} style={{ border: '3px solid #fff2f0' }} />
              <div>
                <Title level={4} style={{ margin: 0 }}>{user.full_name}</Title>
                <Text type="secondary">Quản trị viên cấp cao (Root)</Text>
                <div style={{ marginTop: 8 }}>
                  <Tag color="red" icon={<ThunderboltOutlined />}>Bảo mật mức 5</Tag>
                </div>
              </div>
            </div>

            <Descriptions column={1} labelStyle={{ fontWeight: '500', color: '#8c8c8c' }}>
              <Descriptions.Item label={<span><MailOutlined /> Email hệ thống</span>}>
                {user.email}
              </Descriptions.Item>
              <Descriptions.Item label={<span><IdcardOutlined /> Mã nhân viên</span>}>
                <Text code>{user.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={<span><LockOutlined /> Trạng thái</span>}>
                <Tag color="green">Đang hoạt động</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>

          {/* CỘT PHẢI: QUYỀN HẠN & HỆ THỐNG */}
          <Col xs={24} md={12} style={{ borderLeft: '1px solid #f0f0f0' }}>
            <Title level={5} style={{ marginBottom: 20, color: '#ff4d4f' }}>Phân quyền & Bảo mật</Title>
            
            <Descriptions column={1} labelStyle={{ fontWeight: '500', color: '#8c8c8c' }}>
              <Descriptions.Item label="Cấp độ truy cập">
                <Text strong>Level 1 (Super Admin)</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày gia nhập">
                01/01/2026
              </Descriptions.Item>
              <Descriptions.Item label={<span><HistoryOutlined /> Lần đăng nhập cuối</span>}>
                Vừa xong
              </Descriptions.Item>
              <Descriptions.Item label="Phạm vi quản lý">
                <Space size={[0, 4]} wrap>
                  <Tag color="volcano">Hotels</Tag>
                  <Tag color="volcano">Users</Tag>
                  <Tag color="volcano">Bookings</Tag>
                  <Tag color="volcano">Revenue</Tag>
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* --- MODALS (GIỮ NGUYÊN LOGIC) --- */}
      <Modal
        title="Chỉnh sửa thông tin Admin"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => formUpdate.submit()}
        confirmLoading={loading}
        centered
      >
        <Form form={formUpdate} layout="vertical" onFinish={handleUpdate} style={{ marginTop: 20 }}>
          <Form.Item name="full_name" label="Họ và tên Admin" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email hệ thống" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="avatar" label="Link ảnh đại diện">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Đổi mật khẩu quản trị"
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        onOk={() => formPassword.submit()}
        confirmLoading={loading}
        okButtonProps={{ danger: true }}
        centered
      >
        <Form form={formPassword} layout="vertical" onFinish={handlePasswordChange} style={{ marginTop: 20 }}>
          <Form.Item name="oldPass" label="Mật khẩu hiện tại" rules={[{ required: true }]}><Input.Password /></Form.Item>
          <Form.Item name="newPass" label="Mật khẩu mới" rules={[{ required: true, min: 8 }]}><Input.Password /></Form.Item>
          <Form.Item name="confirm" label="Xác nhận mật khẩu" dependencies={['newPass']}
            rules={[{ required: true }, ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPass') === value) return Promise.resolve();
                return Promise.reject(new Error('Mật khẩu không khớp!'));
              },
            })]}
          ><Input.Password /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProfile;