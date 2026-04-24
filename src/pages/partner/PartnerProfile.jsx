import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Avatar, Typography, Space, Button, Modal, Form, Input, App as AntApp, Row, Col, Divider, Upload } from 'antd';
import { 
  ShopOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  MailOutlined, 
  SafetyCertificateOutlined, 
  KeyOutlined, 
  LockOutlined,
  EditOutlined,
  IdcardOutlined,
  CalendarOutlined,
  UploadOutlined // Thêm icon Upload
} from '@ant-design/icons';
import { MOCK_HOTELS } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;

const PartnerProfile = () => {
  const { message } = AntApp.useApp();
  const [userData, setUserData] = useState({});
  const [hotelData, setHotelData] = useState(null);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Thêm state quản lý file ảnh
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user')) || {};
    setUserData(user);
    const hotel = MOCK_HOTELS.find(h => h.id_hotel === user.hotel_id);
    setHotelData(hotel);

    editForm.setFieldsValue({
      full_name: user.full_name,
      phone: user.phone,
      tax_id: user.tax_id,
    });

    // Nếu đối tác đã có ảnh đại diện thì nạp vào ô Upload
    if (user.avatar) {
      setFileList([{ uid: '-1', name: 'avatar.png', status: 'done', url: user.avatar }]);
    }
  }, [editForm]);

  // Hàm chuyển ảnh sang Base64
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Đổi thành async để đợi xử lý ảnh
  const handleUpdateProfile = async (values) => {
    let avatarBase64 = userData.avatar;

    // Xử lý nếu có chọn ảnh mới hoặc xóa ảnh
    if (fileList.length > 0 && fileList[0].originFileObj) {
      avatarBase64 = await getBase64(fileList[0].originFileObj);
    } else if (fileList.length === 0) {
      avatarBase64 = '';
    }

    const updatedUser = { ...userData, ...values, avatar: avatarBase64 };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    setUserData(updatedUser);
    message.success('Cập nhật thông tin doanh nghiệp thành công!');
    setIsEditModalVisible(false);
  };

  const handlePasswordChange = (values) => {
    message.success('Đổi mật khẩu thành công!');
    setIsPasswordModalVisible(false);
    passwordForm.resetFields();
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Card 
        bordered={false}
        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        title={
          <Space>
            <ShopOutlined style={{ color: '#1890ff', fontSize: '22px' }} /> 
            <Title level={4} style={{ margin: 0 }}>Hồ sơ Đối tác doanh nghiệp</Title>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<EditOutlined />} onClick={() => setIsEditModalVisible(true)}>
              Cập nhật thông tin
            </Button>
            <Button type="primary" icon={<KeyOutlined />} onClick={() => setIsPasswordModalVisible(true)}>
              Đổi mật khẩu
            </Button>
          </Space>
        }
      >
        <Row gutter={[48, 16]}>
          {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN & ĐẠI DIỆN */}
          <Col xs={24} md={12}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 20 }}>
              <Avatar size={80} src={userData.avatar} style={{ border: '3px solid #e6f7ff' }} />
              <div>
                <Title level={4} style={{ margin: 0 }}>{userData.full_name}</Title>
                <Text type="secondary">Người đại diện pháp luật</Text>
                <div style={{ marginTop: 8 }}>
                  {userData.status === 'active' ? (
                    <Tag color="green" icon={<SafetyCertificateOutlined />}>Đang hoạt động</Tag>
                  ) : (
                    <Tag color="red" icon={<LockOutlined />}>Đã khóa</Tag>
                  )}
                </div>
              </div>
            </div>

            <Descriptions column={1} labelStyle={{ fontWeight: '500', color: '#8c8c8c' }}>
              <Descriptions.Item label={<span><MailOutlined /> Email liên hệ</span>}>
                {userData.email}
              </Descriptions.Item>
              <Descriptions.Item label={<span><PhoneOutlined /> Số điện thoại</span>}>
                {userData.phone || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label={<span><IdcardOutlined /> Mã số thuế</span>}>
                <Text code>{userData.tax_id || 'Chưa cập nhật'}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Col>

          {/* CỘT PHẢI: THÔNG TIN CƠ SỞ & DOANH NGHIỆP */}
          <Col xs={24} md={12} style={{ borderLeft: '1px solid #f0f0f0' }}>
            <Title level={5} style={{ marginBottom: 20, color: '#1890ff' }}>Thông tin cơ sở quản lý</Title>
            
            <Descriptions column={1} labelStyle={{ fontWeight: '500', color: '#8c8c8c' }}>
              <Descriptions.Item label="Tên cơ sở">
                <Text strong>{hotelData?.hotel_name || 'Đang cập nhật...'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={<span><EnvironmentOutlined /> Địa chỉ</span>}>
                {hotelData?.address || 'Đang cập nhật địa chỉ...'}
              </Descriptions.Item>
              <Descriptions.Item label={<span><CalendarOutlined /> Ngày gia nhập</span>}>
                {userData.created_at || '12/04/2026'}
              </Descriptions.Item>
              <Descriptions.Item label="Loại hình">
                <Tag color="blue">{hotelData?.type?.toUpperCase() || 'HOTEL'}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* --- MODAL CẬP NHẬT THÔNG TIN ĐỐI TÁC --- */}
      <Modal
        title="Cập nhật thông tin đối tác"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        centered
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateProfile}>
          <Form.Item name="full_name" label="Tên người đại diện" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tax_id" label="Mã số thuế">
            <Input />
          </Form.Item>

          {/* PHẦN CHỌN ẢNH TỪ MÁY TÍNH */}
          <Form.Item label="Ảnh đại diện">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Upload
                fileList={fileList}
                onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                beforeUpload={() => false} // Chặn gửi request để mở file từ máy
                maxCount={1}
                onRemove={() => setFileList([])}
              >
                <Button icon={<UploadOutlined />}>Chọn file từ máy tính</Button>
              </Upload>
              
              {fileList.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" size="small">Xem trước:</Text>
                  <br />
                  <Avatar 
                    shape="square" 
                    size={64} 
                    src={fileList[0].url || (fileList[0].originFileObj ? URL.createObjectURL(fileList[0].originFileObj) : '')} 
                  />
                </div>
              )}
            </Space>
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => setIsEditModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">Lưu lại</Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* --- MODAL ĐỔI MẬT KHẨU --- */}
      <Modal
        title="Đổi mật khẩu tài khoản"
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={null}
        centered
      >
        <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
          <Form.Item name="oldPass" label="Mật khẩu cũ" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="newPass" label="Mật khẩu mới" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item 
            name="confirm" label="Xác nhận mật khẩu" dependencies={['newPass']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPass') === value) return Promise.resolve();
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Space>
              <Button onClick={() => setIsPasswordModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">Cập nhật</Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PartnerProfile;