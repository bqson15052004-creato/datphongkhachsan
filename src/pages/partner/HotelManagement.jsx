import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Card, Tag, Space, Modal, 
  Form, Input, Select, Upload, Typography, Row, Col, message, Popconfirm 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShopOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const HotelManagement = () => {
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [editing_hotel, set_editing_hotel] = useState(null);
  const [form] = Form.useForm();
  const [hotel_list, set_hotel_list] = useState([]);

  // 1. Load dữ liệu khởi tạo
  useEffect(() => {
    const saved_hotels = JSON.parse(localStorage.getItem('all_hotels')) || [
      {
        id: 'H001',
        name: 'Vinpearl Luxury Nha Trang',
        address: 'Nha Trang, Khánh Hòa',
        status: 'Đã duyệt',
        rooms: 15,
        type: 'resort'
      }
    ];
    set_hotel_list(saved_hotels);
  }, []);

  // 2. Hàm lưu dữ liệu vào LocalStorage
  const save_to_local = (data) => {
    set_hotel_list(data);
    localStorage.setItem('all_hotels', JSON.stringify(data));
  };

  // 3. Xử lý thêm mới hoặc cập nhật
  const on_finish = (values) => {
    if (editing_hotel) {
      // Logic Cập nhật
      const updated_data = hotel_list.map(h => 
        h.id === editing_hotel.id ? { ...h, ...values } : h
      );
      save_to_local(updated_data);
      message.success('Cập nhật thông tin khách sạn thành công!');
    } else {
      // Logic Thêm mới
      const new_hotel = {
        id: `REQ${Date.now()}`,
        ...values,
        status: 'Đang chờ', 
        rooms: 0,
        date_created: new Date().toLocaleDateString('vi-VN')
      };
      save_to_local([...hotel_list, new_hotel]);
      message.success('Đã gửi yêu cầu đăng ký tới Admin!');
    }
    close_modal();
  };

  // 4. Xử lý Xóa
  const handle_delete = (id) => {
    const filtered_data = hotel_list.filter(h => h.id !== id);
    save_to_local(filtered_data);
    message.success('Đã gỡ bỏ khách sạn.');
  };

  // 5. Điều khiển Modal
  const open_modal = (hotel = null) => {
    if (hotel) {
      set_editing_hotel(hotel);
      form.setFieldsValue(hotel);
    }
    set_is_modal_open(true);
  };

  const close_modal = () => {
    set_is_modal_open(false);
    set_editing_hotel(null);
    form.resetFields();
  };

  const columns = [
    { 
      title: 'Mã số', 
      dataIndex: 'id', 
      key: 'id',
      render: (id) => <Text code>{id}</Text>
    },
    { 
      title: 'Thông tin khách sạn', 
      key: 'hotel_info',
      render: (record) => (
        <div>
          <Text strong>{record.name}</Text><br/>
          <Text type="secondary" style={{fontSize: 12}}>{record.address}</Text>
        </div>
      )
    },
    { 
      title: 'Loại hình', 
      dataIndex: 'type', 
      key: 'type',
      render: (type) => <Tag color="blue">{type?.toUpperCase()}</Tag>
    },
    { 
      title: 'Quy mô', 
      dataIndex: 'rooms', 
      key: 'rooms',
      render: (rooms) => `${rooms} phòng`
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        const is_approved = status === 'Đã duyệt';
        return (
          <Tag color={is_approved ? 'green' : 'orange'} icon={is_approved ? <ShopOutlined /> : null}>
            {status.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined style={{color: '#1890ff'}} />} 
            onClick={() => open_modal(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handle_delete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={container_style}>
      <Card 
        bordered={false}
        style={card_style}
        title={
          <Space>
            <ShopOutlined style={{fontSize: 24, color: '#1890ff'}} />
            <Title level={3} style={no_margin_style}>Quản lý Cơ sở lưu trú</Title>
          </Space>
        }
        extra={
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => open_modal()} shape="round">
            Đăng ký khách sạn mới
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={hotel_list} 
          rowKey="id" 
          pagination={{ pageSize: 6 }}
        />
      </Card>

      <Modal 
        title={editing_hotel ? "Chỉnh sửa thông tin khách sạn" : "Đăng ký cơ sở kinh doanh mới"} 
        open={is_modal_open} 
        onCancel={close_modal}
        onOk={() => form.submit()}
        width={720}
        okText={editing_hotel ? "Lưu thay đổi" : "Gửi yêu cầu đăng ký"}
        cancelText="Hủy bỏ"
        centered
      >
        <Form form={form} layout="vertical" onFinish={on_finish} style={{marginTop: 20}}>
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="name" label="Tên thương mại" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                <Input placeholder="Ví dụ: Khách sạn Landmark 81" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="type" label="Loại hình kinh doanh" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại hình">
                  <Select.Option value="hotel">Khách sạn</Select.Option>
                  <Select.Option value="resort">Khu nghỉ dưỡng (Resort)</Select.Option>
                  <Select.Option value="homestay">Homestay / Villa</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item name="address" label="Địa chỉ kinh doanh" rules={[{ required: true }]}>
            <Input placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh..." />
          </Form.Item>

          <Form.Item name="description" label="Giới thiệu chung">
            <TextArea rows={4} placeholder="Mô tả ngắn về vị trí, dịch vụ đặc sắc..." />
          </Form.Item>

          <Form.Item label="Giấy phép kinh doanh / Hình ảnh mặt tiền">
            <Upload listType="picture-card" beforeUpload={() => false}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </div>
            </Upload>
            <Text type="secondary" style={{fontSize: 12}}>* Định dạng JPG, PNG. Tối đa 5MB.</Text>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Hệ thống Style Constants
const container_style = { padding: '30px', background: '#f0f2f5', minHeight: '100vh' };
const card_style = { borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const no_margin_style = { margin: 0 };

export default HotelManagement;