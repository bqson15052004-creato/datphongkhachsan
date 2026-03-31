import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Card, Tag, Space, Modal, 
  Form, Input, Select, Upload, Typography, Row, Col, message 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

const HotelManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [hotels, setHotels] = useState([]);

  // 1. Lấy dữ liệu từ LocalStorage khi trang vừa load
  useEffect(() => {
    const savedHotels = JSON.parse(localStorage.getItem('all_hotels')) || [
      {
        id: 'H001',
        name: 'Vinpearl Luxury Nha Trang',
        address: 'Nha Trang, Khánh Hòa',
        status: 'Đã duyệt',
        rooms: 15,
      }
    ];
    setHotels(savedHotels);
  }, []);

  const columns = [
    { title: 'Mã HS', dataIndex: 'id', key: 'id' },
    { title: 'Tên khách sạn', dataIndex: 'name', key: 'name' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Số phòng', dataIndex: 'rooms', key: 'rooms' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        // Đồng bộ màu sắc: Đã duyệt (green), Đang chờ (orange)
        <Tag color={status === 'Đã duyệt' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} />
          <Button danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  // 2. Hàm xử lý nạp dữ liệu tự động
  const onFinish = (values) => {
    const newHotel = {
      id: `REQ${Date.now()}`, // Tạo mã yêu cầu duy nhất
      ...values,
      status: 'Đang chờ', // Trạng thái để Admin nhận thông báo
      rooms: 0,
      date: new Date().toLocaleDateString('vi-VN')
    };

    const updatedHotels = [...hotels, newHotel];
    
    // Lưu vào State để hiển thị ngay
    setHotels(updatedHotels);
    
    // Lưu vào LocalStorage để Admin có thể đọc được
    localStorage.setItem('all_hotels', JSON.stringify(updatedHotels));
    
    message.success('Đã gửi yêu cầu đăng ký khách sạn tới Admin!');
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title={<Title level={3} style={{margin:0}}>Quản lý Khách sạn của bạn</Title>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Thêm khách sạn mới
          </Button>
        }
      >
        <Table columns={columns} dataSource={hotels} rowKey="id" />
      </Card>

      <Modal 
        title="Đăng ký khách sạn mới" 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={800}
        okText="Gửi yêu cầu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Tên khách sạn" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                <Input placeholder="Ví dụ: Khách sạn Mường Thanh" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Loại hình" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại hình">
                  <Select.Option value="hotel">Khách sạn</Select.Option>
                  <Select.Option value="resort">Resort</Select.Option>
                  <Select.Option value="homestay">Homestay</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item name="address" label="Địa chỉ chi tiết" rules={[{ required: true }]}>
            <Input placeholder="Số nhà, tên đường, tỉnh thành..." />
          </Form.Item>

          <Form.Item name="description" label="Mô tả khách sạn">
            <TextArea rows={4} placeholder="Giới thiệu ngắn gọn về khách sạn của bạn" />
          </Form.Item>

          <Form.Item label="Hình ảnh khách sạn">
            <Upload listType="picture-card" beforeUpload={() => false}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HotelManagement;