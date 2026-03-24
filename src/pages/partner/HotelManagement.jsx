import React, { useState } from 'react';
import { 
  Table, Button, Card, Tag, Space, Modal, 
  Form, Input, InputNumber, Select, Upload, Typography, Row, Col 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

const HotelManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  // Dữ liệu mẫu danh sách khách sạn của Đối tác này
  const [hotels, setHotels] = useState([
    {
      id: 'H001',
      name: 'Vinpearl Luxury Nha Trang',
      address: 'Nha Trang, Khánh Hòa',
      status: 'Đã duyệt', // Trạng thái sau khi Admin duyệt
      rooms: 15,
    }
  ]);

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
        <Tag color={status === 'Đã duyệt' ? 'green' : 'orange'}>{status}</Tag>
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

  const onFinish = (values) => {
    const newHotel = {
      id: `H00${hotels.length + 1}`,
      ...values,
      status: 'Chờ duyệt', // Khi mới tạo sẽ ở trạng thái chờ Admin duyệt
      rooms: 0
    };
    setHotels([...hotels, newHotel]);
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title={<Title level={3}>Quản lý Khách sạn của bạn</Title>}
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Thêm khách sạn mới</Button>}
      >
        <Table columns={columns} dataSource={hotels} rowKey="id" />
      </Card>

      {/* Modal Thêm mới Khách sạn */}
      <Modal 
        title="Đăng ký khách sạn mới" 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Tên khách sạn" rules={[{ required: true }]}>
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
            <Input icon={<PlusOutlined />} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả khách sạn">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Hình ảnh khách sạn">
            <Upload listType="picture-card">
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