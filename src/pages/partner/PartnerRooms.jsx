import React, { useState } from 'react';
import { 
  Table, Button, Card, Tag, Space, Modal, 
  Form, Input, InputNumber, Select, Typography, Row, Col, Empty 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const RoomManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  // Giả lập danh sách khách sạn của đối tác để chọn
  const [myHotels] = useState([
    { id: 'H001', name: 'Vinpearl Luxury Nha Trang' },
    { id: 'H002', name: 'Pullman Vũng Tàu' }
  ]);
  
  const [selectedHotel, setSelectedHotel] = useState('H001');

  // Dữ liệu mẫu danh sách phòng của khách sạn đang chọn
  const [rooms, setRooms] = useState([
    {
      id: 'R001',
      type: 'Deluxe Ocean View',
      price: 2500000,
      quantity: 5,
      status: 'Còn phòng',
      capacity: 2
    },
    {
      id: 'R002',
      type: 'Superior King Room',
      price: 1800000,
      quantity: 10,
      status: 'Còn phòng',
      capacity: 2
    }
  ]);

  const columns = [
    { title: 'Mã Phòng', dataIndex: 'id', key: 'id' },
    { title: 'Loại Phòng', dataIndex: 'type', key: 'type', render: (text) => <Text strong>{text}</Text> },
    { title: 'Sức chứa', dataIndex: 'capacity', key: 'capacity', render: (cap) => `${cap} người` },
    { 
      title: 'Giá/Đêm', 
      dataIndex: 'price', 
      key: 'price', 
      render: (p) => <Text type="danger">{p.toLocaleString()}đ</Text> 
    },
    { title: 'Số lượng trống', dataIndex: 'quantity', key: 'quantity' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => <Tag color={status === 'Còn phòng' ? 'blue' : 'red'}>{status}</Tag>
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} size="small" />
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  const onFinish = (values) => {
    const newRoom = {
      id: `R00${rooms.length + 1}`,
      ...values,
      status: 'Còn phòng'
    };
    setRooms([...rooms, newRoom]);
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: 20 }}>
        <Row align="middle" gutter={16}>
          <Col span={6}>
            <Text strong>Chọn khách sạn quản lý: </Text>
          </Col>
          <Col span={12}>
            <Select 
              style={{ width: '100%' }} 
              value={selectedHotel} 
              onChange={(value) => setSelectedHotel(value)}
              options={myHotels.map(h => ({ label: h.name, value: h.id }))}
            />
          </Col>
        </Row>
      </Card>

      <Card 
        title={
          <Title level={4}>
            <HomeOutlined /> Danh sách loại phòng
          </Title>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Thêm loại phòng mới
          </Button>
        }
      >
        <Table columns={columns} dataSource={rooms} rowKey="id" />
      </Card>

      {/* Modal Thêm loại phòng */}
      <Modal 
        title="Thêm loại phòng mới cho khách sạn" 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="type" label="Tên loại phòng" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Deluxe Giường Đôi" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price" label="Giá mỗi đêm (VNĐ)" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="capacity" label="Sức chứa (người)" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="quantity" label="Số lượng phòng có sẵn" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả tiện nghi phòng">
            <Input.TextArea rows={3} placeholder="Ví dụ: Có bồn tắm, ban công hướng biển..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomManagement;