import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Select, Button, Tag, Space, 
  Typography, Input, Modal, Form, InputNumber, 
  Switch, message, Row, Col 
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, HomeOutlined, 
  EditOutlined, LockOutlined, UnlockOutlined, TeamOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const RoomNumbers = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  
  const [hotels, setHotels] = useState([
    { id: 1, name: 'Vinpearl Luxury Nha Trang' },
    { id: 2, name: 'Muong Thanh Luxury Da Nang' },
  ]);
  const [selectedHotel, setSelectedHotel] = useState(1);
  const [rooms, setRooms] = useState([
    { id: 'R101', roomNumber: '101', type: 'Deluxe Ocean View', capacity: 2, price: 1500000, status: true, hotelId: 1 },
    { id: 'R102', roomNumber: '102', type: 'Suite Family', capacity: 4, price: 2500000, status: false, hotelId: 1 },
    { id: 'R201', roomNumber: '201', type: 'Superior Double', capacity: 2, price: 1200000, status: true, hotelId: 2 },
  ]);
  const [searchText, setSearchText] = useState('');

  const handleSubmit = (values) => {
    if (editingId) {
      setRooms(prev => prev.map(r => r.id === editingId ? { ...r, ...values } : r));
      message.success(`Đã cập nhật thông tin phòng ${values.roomNumber}`);
    } else {
      const newRoom = {
        id: `R${Math.floor(Math.random() * 1000)}`,
        ...values,
        hotelId: selectedHotel,
      };
      setRooms([...rooms, newRoom]);
      message.success(`Đã thêm phòng ${values.roomNumber} mới!`);
    }
    handleCancel();
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  // --- LOGIC KHÓA / MỞ KHÓA MỚI ---
  const handleToggleStatus = (record) => {
    const isLocking = record.status === true;
    const actionText = isLocking ? 'khóa' : 'mở khóa';

    Modal.confirm({
      title: `Xác nhận ${actionText} phòng?`,
      icon: isLocking ? <LockOutlined style={{ color: '#ff4d4f' }} /> : <UnlockOutlined style={{ color: '#52c41a' }} />,
      content: `Bạn chắc chắn muốn ${actionText} phòng số ${record.roomNumber} chứ?`,
      okText: `Xác nhận ${actionText}`,
      okType: isLocking ? 'danger' : 'primary',
      onOk: () => {
        setRooms(prev => prev.map(r => 
          r.id === record.id ? { ...r, status: !record.status } : r
        ));
        message.success(`Đã ${actionText} phòng thành công!`);
      },
    });
  };

  const filteredRooms = rooms.filter(room => 
    room.hotelId === selectedHotel && 
    room.roomNumber.toLowerCase().includes(searchText.toLowerCase())
  );

  const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  const columns = [
    {
      title: 'Số phòng',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      render: (text) => <Text strong style={{ color: '#1890ff' }}>{text}</Text>,
    },
    { title: 'Loại phòng', dataIndex: 'type', key: 'type' },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      key: 'capacity',
      align: 'center',
      render: (cap) => <Tag icon={<TeamOutlined />} color="blue">{cap} người</Tag>,
    },
    {
      title: 'Đơn giá/Đêm',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price) => <Text strong>{formatCurrency(price)}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'ĐANG HOẠT ĐỘNG' : 'ĐANG KHÓA'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            disabled={!record.status} // Khóa thì không cho sửa
            onClick={() => handleEdit(record)} 
          />
          <Button 
            type="link" 
            danger={record.status}
            style={{ color: !record.status ? '#ff4d4f' : '#52c41a' }}
            icon={record.status ? <UnlockOutlined /> : <LockOutlined />} 
            onClick={() => handleToggleStatus(record)} 
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', background: '#f5f7fa', minHeight: '100vh' }}>
      <Card variant={false} style={{ marginBottom: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}><HomeOutlined /> Quản lý chi tiết phòng</Title>
            <Text type="secondary">Cập nhật thông tin số phòng và sức chứa</Text>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Select style={{ width: '100%' }} value={selectedHotel} onChange={(val) => setSelectedHotel(val)}>
              {hotels.map(h => <Option key={h.id} value={h.id}>{h.name}</Option>)}
            </Select>
          </Col>
          <Col span={8}>
            <Input placeholder="Tìm số phòng..." prefix={<SearchOutlined />} onChange={e => setSearchText(e.target.value)} />
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); setIsModalOpen(true); }}>
              Thêm phòng mới
            </Button>
          </Col>
        </Row>

        <Table columns={columns} dataSource={filteredRooms} rowKey="id" loading={loading} pagination={{ pageSize: 8 }} />
      </Card>

      <Modal 
        title={editingId ? "Cập nhật thông tin phòng" : "Thêm phòng mới"} 
        open={isModalOpen} 
        onCancel={handleCancel}
        onOk={() => form.submit()}
        width={500}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: true, capacity: 2 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="roomNumber" label="Số phòng" rules={[{ required: true, message: 'Nhập số phòng!' }]}>
                <Input placeholder="Ví dụ: 101" disabled={!!editingId}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="capacity" label="Sức chứa" rules={[{ required: true }]}>
                <InputNumber min={1} max={10} style={{ width: '100%' }} addonAfter="Người" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="type" label="Loại phòng" rules={[{ required: true }]}>
            <Select placeholder="Chọn loại">
              <Option value="Deluxe Ocean View">Deluxe Ocean View</Option>
              <Option value="Suite Family">Suite Family</Option>
              <Option value="Superior Double">Superior Double</Option>
            </Select>
          </Form.Item>

          <Form.Item name="price" label="Đơn giá/Đêm (VNĐ)" rules={[{ required: true }]}>
            <InputNumber 
              style={{ width: '100%' }} 
              formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={v => v.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái hiển thị" valuePropName="checked">
            <Switch checkedChildren="Sẵn sàng" unCheckedChildren="Đã khóa" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomNumbers;