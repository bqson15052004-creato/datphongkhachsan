import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Select, Button, Tag, Space, 
  Typography, Input, Modal, Form, InputNumber, 
  Switch, message, Row, Col 
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, HomeOutlined, 
  EditOutlined, DeleteOutlined, InfoCircleOutlined 
} from '@ant-design/icons';
// import { partnerApi } from '../../services/partnerApi'; // Mở ra khi có file api

const { Title, Text } = Typography;
const { Option } = Select;

const RoomNumbers = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  // 1. DATA STATES
  const [hotels, setHotels] = useState([
    { id: 1, name: 'Vinpearl Luxury Nha Trang' },
    { id: 2, name: 'Muong Thanh Luxury Da Nang' },
  ]);
  const [selectedHotel, setSelectedHotel] = useState(1);
  const [rooms, setRooms] = useState([
    { id: 'R101', roomNumber: '101', type: 'Deluxe Ocean View', price: 1500000, status: true, hotelId: 1 },
    { id: 'R102', roomNumber: '102', type: 'Suite Family', price: 2500000, status: false, hotelId: 1 },
    { id: 'R201', roomNumber: '201', type: 'Superior Double', price: 1200000, status: true, hotelId: 2 },
  ]);
  const [searchText, setSearchText] = useState('');

  // 2. LOGIC KẾT NỐI BE (TẠM COMMENT)
  /*
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Lấy danh sách khách sạn của partner
      const hotelRes = await partnerApi.getMyHotels();
      setHotels(hotelRes.data);
      if (hotelRes.data.length > 0) setSelectedHotel(hotelRes.data[0].id);
    } catch (error) {
      message.error("Không thể tải danh sách khách sạn");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomsByHotel = async (hotelId) => {
    setLoading(true);
    try {
      const res = await partnerApi.getRoomNumbers(hotelId);
      setRooms(res.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedHotel) fetchRoomsByHotel(selectedHotel);
  }, [selectedHotel]);
  */

  // 3. HANDLERS
  const handleAddRoom = async (values) => {
    // Logic BE (Tạm comment)
    /*
    try {
      setLoading(true);
      const payload = { ...values, hotelId: selectedHotel };
      await partnerApi.createRoomNumber(payload);
      message.success("Thêm phòng thành công!");
      fetchRoomsByHotel(selectedHotel); // Load lại bảng
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Không thể thêm phòng. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
    */

    // Logic Mock tạm thời
    const newRoom = {
      id: `R${Math.floor(Math.random() * 1000)}`,
      ...values,
      hotelId: selectedHotel,
    };
    setRooms([...rooms, newRoom]);
    message.success(`[Mock] Đã thêm phòng ${values.roomNumber}`);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    /*
    try {
      await partnerApi.deleteRoomNumber(id);
      message.success("Đã xóa phòng");
      fetchRoomsByHotel(selectedHotel);
    } catch (error) {
      message.error("Xóa thất bại");
    }
    */
    setRooms(rooms.filter(r => r.id !== id));
    message.warning("[Mock] Đã xóa dữ liệu tạm");
  };

  // 4. TABLE CONFIG
  const filteredRooms = rooms.filter(room => 
    room.hotelId === selectedHotel && 
    room.roomNumber.toLowerCase().includes(searchText.toLowerCase())
  );

  const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  const columns = [
    {
      title: 'Mã phòng',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <Text copyable type="secondary">{text}</Text>,
    },
    {
      title: 'Số phòng',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      render: (text) => <Text strong color="blue">{text}</Text>,
    },
    {
      title: 'Loại phòng',
      dataIndex: 'type',
      key: 'type',
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
          {status ? 'Còn trống' : 'Hết phòng/Bảo trì'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => setIsModalOpen(true)} />
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card variant={false} style={{ marginBottom: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}><HomeOutlined /> Quản lý chi tiết phòng</Title>
            <Text type="secondary">Chọn khách sạn để xem và quản lý danh sách số phòng thực tế</Text>
          </Col>
        </Row>
      </Card>

      <Card variant={false} style={{ borderRadius: 12 }}>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Select 
              style={{ width: '100%' }} 
              value={selectedHotel} 
              onChange={(val) => setSelectedHotel(val)}
              placeholder="Chọn khách sạn"
            >
              {hotels.map(h => <Option key={h.id} value={h.id}>{h.name}</Option>)}
            </Select>
          </Col>
          <Col span={8}>
            <Input 
              placeholder="Tìm theo số phòng..." 
              prefix={<SearchOutlined />} 
              onChange={e => setSearchText(e.target.value)}
            />
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} size="large" shape="round">
              Thêm phòng mới
            </Button>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={filteredRooms} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal 
        title="Thông tin phòng" 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAddRoom} initialValues={{ status: true }}>
          <Form.Item name="roomNumber" label="Số phòng" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: A101" />
          </Form.Item>
          <Form.Item name="type" label="Loại phòng" rules={[{ required: true }]}>
            <Select placeholder="Chọn loại">
              <Option value="Deluxe Ocean View">Deluxe Ocean View</Option>
              <Option value="Suite Family">Suite Family</Option>
            </Select>
          </Form.Item>
          <Form.Item name="price" label="Giá gốc (VNĐ)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Trống" unCheckedChildren="Đã khóa" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomNumbers;