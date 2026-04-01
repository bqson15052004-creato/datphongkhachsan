import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Card, Tag, Space, Modal, 
  Form, Input, InputNumber, Select, Typography, Row, Col, Popconfirm, message 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons';
import axiosClient from '../../services/axiosClient';

const { Title, Text } = Typography;

const RoomManagement = () => {
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [editing_room, set_editing_room] = useState(null);
  const [form] = Form.useForm();
  
  // 1. Quản lý danh sách khách sạn của đối tác
  const [my_hotels, set_my_hotels] = useState([
    { id: 'H001', name: 'Vinpearl Luxury Nha Trang' },
    { id: 'H002', name: 'Pullman Vũng Tàu' }
  ]);
  const [selected_hotel_id, set_selected_hotel_id] = useState('H001');

  // 2. Quản lý danh sách phòng (Snake-case)
  const [room_list, set_room_list] = useState([]);
  const [is_loading, set_is_loading] = useState(false);

  // 3. Fetch dữ liệu phòng từ Node.js dựa trên khách sạn được chọn
  const fetch_rooms = async (hotel_id) => {
    try {
      set_is_loading(true);
      const response = await axios_client.get(`/rooms?hotel_id=${hotel_id}`);
      set_room_list(response.data.data);
    } catch (error) {
      const mock_rooms = [
        {
          _id: 'R001',
          room_type: 'Deluxe Ocean View',
          price: 2500000,
          quantity: 5,
          status: 'Available',
          capacity: 2
        }
      ];
      set_room_list(mock_rooms);
    } finally {
      set_is_loading(false);
    }
  };

  useEffect(() => {
    fetch_rooms(selected_hotel_id);
  }, [selected_hotel_id]);

  const columns = [
    { 
      title: 'Mã số', 
      dataIndex: '_id', 
      key: '_id',
      render: (id) => <Text code>{id.slice(-5)}</Text>
    },
    { 
      title: 'Loại Phòng', 
      dataIndex: 'room_type', 
      key: 'room_type', 
      render: (text) => <Text strong>{text}</Text> 
    },
    { 
      title: 'Sức chứa', 
      dataIndex: 'capacity', 
      key: 'capacity', 
      render: (cap) => `${cap} người` 
    },
    { 
      title: 'Giá/Đêm', 
      dataIndex: 'price', 
      key: 'price', 
      render: (p) => <Text type="danger" strong>{p.toLocaleString()}đ</Text> 
    },
    { 
      title: 'Kho phòng', 
      dataIndex: 'quantity', 
      key: 'quantity',
      render: (q) => <Tag color={q > 0 ? 'blue' : 'black'}>{q} phòng trống</Tag>
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined style={{color: '#1890ff'}} />} 
            onClick={() => handle_edit(record)} 
          />
          <Popconfirm title="Xóa loại phòng này?" onConfirm={() => handle_delete(record._id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 4. Logic Xử lý Form
  const handle_edit = (room) => {
    set_editing_room(room);
    form.setFieldsValue(room);
    set_is_modal_open(true);
  };

  const on_finish = async (values) => {
    try {
      const payload = { ...values, hotel_id: selected_hotel_id };
      if (editing_room) {
        await axios_client.put(`/rooms/${editing_room._id}`, payload);
        message.success("Cập nhật phòng thành công");
      } else {
        await axios_client.post('/rooms', payload);
        message.success("Thêm phòng mới thành công");
      }
      fetch_rooms(selected_hotel_id);
      close_modal();
    } catch (error) {
      message.error("Thao tác thất bại");
    }
  };

  const close_modal = () => {
    set_is_modal_open(false);
    set_editing_room(null);
    form.resetFields();
  };

  const handle_delete = async (id) => {
    try {
      await axios_client.delete(`/rooms/${id}`);
      message.success("Đã xóa phòng");
      fetch_rooms(selected_hotel_id);
    } catch (error) {
      message.error("Không thể xóa");
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 20, borderRadius: 12 }}>
        <Row align="middle" gutter={16}>
          <Col>
            <Text strong>Đang quản lý khách sạn: </Text>
          </Col>
          <Col span={8}>
            <Select 
              style={{ width: '100%' }} 
              value={selected_hotel_id} 
              onChange={(value) => set_selected_hotel_id(value)}
              options={my_hotels.map(h => ({ label: h.name, value: h.id }))}
            />
          </Col>
        </Row>
      </Card>

      <Card 
        title={
          <Space>
            <HomeOutlined style={{ color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>Danh sách loại phòng</Title>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => set_is_modal_open(true)} shape="round">
            Thêm loại phòng mới
          </Button>
        }
        style={{ borderRadius: 12 }}
      >
        <Table 
          columns={columns} 
          dataSource={room_list} 
          rowKey="_id" 
          loading={is_loading}
        />
      </Card>

      <Modal 
        title={editing_room ? "Chỉnh sửa loại phòng" : "Thêm loại phòng mới"}
        open={is_modal_open} 
        onCancel={close_modal}
        onOk={() => form.submit()}
        okText="Lưu thông tin"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={on_finish} style={{ marginTop: 15 }}>
          <Form.Item name="room_type" label="Tên loại phòng" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="Ví dụ: Deluxe Giường Đôi" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price" label="Giá mỗi đêm (VNĐ)" rules={[{ required: true }]}>
                <InputNumber 
                  style={{ width: '100%' }} 
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                  addonAfter="đ"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="capacity" label="Sức chứa (người)" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} placeholder="2" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="quantity" label="Số lượng phòng có sẵn" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="10" />
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