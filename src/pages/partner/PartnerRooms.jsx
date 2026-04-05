import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Card, Tag, Space, Modal, 
  Form, Input, InputNumber, Select, Typography, Row, Col, 
  App as AntApp, Tooltip, Empty, Badge, Avatar, Popconfirm 
} from 'antd'; // Đã fix: Thêm đầy đủ Popconfirm, Avatar, Badge
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  HomeOutlined, 
  DollarOutlined, 
  InfoCircleOutlined, 
  TeamOutlined 
} from '@ant-design/icons'; // Đã fix: Dùng TeamOutlined thay cho UserGroupOutlined
import axiosClient from '../../services/axiosClient';

const { Title, Text } = Typography;

const PartnerRooms = () => {
  const { message: antdMessage } = AntApp.useApp();
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [editing_room, set_editing_room] = useState(null);
  const [form] = Form.useForm();
  
  // Dữ liệu mẫu khách sạn
  const [my_hotels, set_my_hotels] = useState([
    { id: 'H001', name: 'Vinpearl Luxury Nha Trang' },
    { id: 'H002', name: 'Pullman Vũng Tàu' }
  ]);
  const [selected_hotel_id, set_selected_hotel_id] = useState('H001');

  const [room_list, set_room_list] = useState([]);
  const [is_loading, set_is_loading] = useState(false);

  // Hàm fetch dữ liệu - Có bọc try-catch để chống trắng màn hình
  const fetch_rooms = async (hotel_id) => {
    set_is_loading(true);
    try {
      // Thử gọi API thật
      const response = await axiosClient.get(`/rooms?hotel_id=${hotel_id}`);
      const data = response.data || response;
      set_room_list(Array.isArray(data) ? data : []);
    } catch (error) {
      // Nếu Backend chưa bật (Lỗi ERR_CONNECTION_REFUSED), dùng Mock Data
      console.warn("Backend đang tắt, hiển thị dữ liệu mẫu để tránh trắng màn hình");
      const mock_rooms = [
        {
          _id: 'R001',
          room_type: 'Deluxe Ocean View',
          price: 2500000,
          quantity: 12,
          capacity: 2,
          description: 'Phòng hướng biển cực đẹp, đầy đủ tiện nghi.'
        },
        {
          _id: 'R002',
          room_type: 'Presidential Suite',
          price: 15000000,
          quantity: 2,
          capacity: 4,
          description: 'Hạng sang nhất khách sạn, bồn tắm dát vàng.'
        }
      ];
      set_room_list(mock_rooms);
    } finally {
      set_is_loading(false);
    }
  };

  useEffect(() => {
    if (selected_hotel_id) fetch_rooms(selected_hotel_id);
  }, [selected_hotel_id]);

  const columns = [
    { 
      title: 'Loại Phòng', 
      dataIndex: 'room_type', 
      key: 'room_type', 
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#1890ff' }}>{text}</Text>
          <Tooltip title={record.description}>
            <Text type="secondary" style={{ fontSize: 12, cursor: 'help' }}>
              <InfoCircleOutlined /> Tiện ích chi tiết
            </Text>
          </Tooltip>
        </Space>
      )
    },
    { 
      title: 'Sức chứa', 
      dataIndex: 'capacity', 
      key: 'capacity', 
      align: 'center',
      render: (cap) => (
        <Tag icon={<TeamOutlined />} color="cyan" style={{ borderRadius: 10 }}>
          {cap} Người
        </Tag>
      ) 
    },
    { 
      title: 'Giá/Đêm', 
      dataIndex: 'price', 
      key: 'price', 
      render: (p) => (
        <Text strong style={{ color: '#f5222d' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)}
        </Text>
      ) 
    },
    { 
      title: 'Kho phòng', 
      dataIndex: 'quantity', 
      key: 'quantity',
      align: 'center',
      render: (q) => (
        <Badge count={q} showZero color={q > 0 ? '#52c41a' : '#d9d9d9'}>
          <Tag color={q > 0 ? 'green' : 'default'} style={{ marginRight: 0 }}>
            {q > 0 ? 'Còn phòng' : 'Hết phòng'}
          </Tag>
        </Badge>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button 
            type="text"
            icon={<EditOutlined style={{ color: '#1890ff' }} />} 
            onClick={() => {
              set_editing_room(record);
              form.setFieldsValue(record);
              set_is_modal_open(true);
            }} 
          />
          <Popconfirm 
            title="Xóa hạng phòng này?" 
            onConfirm={() => antdMessage.success("Đã xóa (giả lập)")}
            okText="Xóa" cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const on_finish = async (values) => {
    set_is_loading(true);
    try {
      const payload = { ...values, hotel_id: selected_hotel_id };
      if (editing_room) {
        await axiosClient.put(`/rooms/${editing_room._id}`, payload);
        antdMessage.success("Cập nhật thành công!");
      } else {
        await axiosClient.post('/rooms', payload);
        antdMessage.success("Thêm mới thành công!");
      }
      fetch_rooms(selected_hotel_id);
      set_is_modal_open(false);
    } catch (error) {
      antdMessage.error("Lỗi: Không thể lưu (Kiểm tra Server Backend)");
    } finally {
      set_is_loading(false);
    }
  };

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ padding: '32px 5%', maxWidth: 1400, margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>Quản lý Hạng phòng</Title>
            <Text type="secondary">Cấu hình giá cả và số lượng phòng trống thực tế</Text>
          </div>
          <Button 
            type="primary" icon={<PlusOutlined />} 
            onClick={() => { set_editing_room(null); form.resetFields(); set_is_modal_open(true); }}
            style={{ borderRadius: 8, height: 40 }}
          >
            Thêm loại phòng mới
          </Button>
        </div>

        <Card bordered={false} style={{ marginBottom: 24, borderRadius: 16 }}>
          <Space size="middle">
            <Avatar style={{ backgroundColor: '#1890ff' }} icon={<HomeOutlined />} />
            <Text strong>Khách sạn:</Text>
            <Select 
              style={{ minWidth: 300 }} 
              value={selected_hotel_id} 
              onChange={set_selected_hotel_id}
              options={my_hotels.map(h => ({ label: h.name, value: h.id }))}
            />
          </Space>
        </Card>

        <Card bordered={false} style={{ borderRadius: 16 }}>
          <Table 
            columns={columns} dataSource={room_list} rowKey="_id" 
            loading={is_loading} pagination={{ pageSize: 6 }}
            locale={{ emptyText: <Empty description="Chưa có dữ liệu phòng" /> }}
          />
        </Card>

        <Modal 
          title={editing_room ? "Cập nhật hạng phòng" : "Tạo hạng phòng mới"}
          open={is_modal_open} onCancel={() => set_is_modal_open(false)}
          onOk={() => form.submit()} confirmLoading={is_loading}
          width={650} centered
        >
          <Form form={form} layout="vertical" onFinish={on_finish} style={{ marginTop: 20 }}>
            <Form.Item name="room_type" label="Tên loại phòng" rules={[{ required: true }]}>
              <Input placeholder="Ví dụ: Deluxe King Room" />
            </Form.Item>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} prefix={<DollarOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="capacity" label="Sức chứa" rules={[{ required: true }]}>
                  <InputNumber min={1} style={{ width: '100%' }} addonAfter="Người" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="quantity" label="Số lượng phòng" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default PartnerRooms;