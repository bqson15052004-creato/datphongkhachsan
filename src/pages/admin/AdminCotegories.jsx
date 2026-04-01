import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, Tag, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminCategories = () => {
  const [is_modal_visible, set_is_modal_visible] = useState(false);
  const [categories, set_categories] = useState([
    { key: '1', name: 'Khách sạn 5 sao', type: 'Loại chỗ nghỉ', status: 'Hoạt động', desc: 'Khách sạn cao cấp có đầy đủ tiện nghi' },
    { key: '2', name: 'Resort', type: 'Loại chỗ nghỉ', status: 'Hoạt động', desc: 'Khu nghỉ dưỡng sinh thái' },
    { key: '3', name: 'Phòng Suite', type: 'Loại phòng', status: 'Hoạt động', desc: 'Phòng cao cấp nhất, diện tích lớn' },
  ]);
  const [form] = Form.useForm();

  const table_columns = [
    { title: 'Tên danh mục', dataIndex: 'name', key: 'name', width: '25%' },
    { title: 'Phân loại', dataIndex: 'type', key: 'type', width: '20%' },
    { title: 'Mô tả', dataIndex: 'desc', key: 'desc', width: '30%' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => <Tag color={status === 'Hoạt động' ? 'green' : 'red'}>{status}</Tag>
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" ghost icon={<EditOutlined />} size="small">Sửa</Button>
          <Button danger icon={<DeleteOutlined />} size="small">Xóa</Button>
        </Space>
      ),
    },
  ];

  const handle_add_submit = (values) => {
    const new_category = {
      key: Date.now().toString(),
      name: values.name,
      type: values.type,
      desc: values.desc,
      status: 'Hoạt động'
    };
    set_categories([...categories, new_category]);
    set_is_modal_visible(false);
    form.resetFields();
  };

  return (
    <div style={container_style}>
      <Card 
        title={<Title level={3} style={{ margin: 0 }}>Quản lý Danh mục hệ thống</Title>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => set_is_modal_visible(true)}>
            Thêm Danh mục mới
          </Button>
        }
      >
        <Table columns={table_columns} dataSource={categories} bordered />
      </Card>

      <Modal 
        title="Thêm Danh Mục Mới" 
        open={is_modal_visible} 
        onOk={() => form.submit()} 
        onCancel={() => set_is_modal_visible(false)}
        okText="Lưu lại"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handle_add_submit}>
          <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="VD: Khách sạn tình yêu, Phòng Dorm..." />
          </Form.Item>
          <Form.Item name="type" label="Phân loại" rules={[{ required: true, message: 'Vui lòng chọn phân loại!' }]}>
            <Select placeholder="Chọn loại">
              <Select.Option value="Loại chỗ nghỉ">Loại chỗ nghỉ</Select.Option>
              <Select.Option value="Loại phòng">Loại phòng</Select.Option>
              <Select.Option value="Tiện ích">Tiện ích (Wifi, Hồ bơi...)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="desc" label="Mô tả chi tiết">
            <Input.TextArea rows={3} placeholder="Nhập mô tả..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const container_style = { padding: '24px' };

export default AdminCategories;