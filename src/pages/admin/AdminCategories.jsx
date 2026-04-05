import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, Tag, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ApartmentOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminCategories = () => {
  const [is_modal_visible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 1. Dữ liệu mẫu chuẩn snake_case (Khớp với API trả về sau này)
  const [categories_list, setCategoriesList] = useState([
    { 
      key: '1', 
      category_name: 'Khách sạn 5 sao', 
      category_type: 'property_type', 
      category_status: 'active', 
      description: 'Khách sạn cao cấp có đầy đủ tiện nghi' 
    },
    { 
      key: '2', 
      category_name: 'Resort', 
      category_type: 'property_type', 
      category_status: 'active', 
      description: 'Khu nghỉ dưỡng sinh thái, không gian xanh' 
    },
    { 
      key: '3', 
      category_name: 'Phòng Suite', 
      category_type: 'room_type', 
      category_status: 'active', 
      description: 'Phòng cao cấp nhất, diện tích lớn, view đẹp' 
    },
    { 
      key: '4', 
      category_name: 'Hồ bơi vô cực', 
      category_type: 'amenity', 
      category_status: 'active', 
      description: 'Tiện ích cao cấp cho khách lưu trú' 
    },
  ]);

  // 2. Định nghĩa các cột Table
  const columns = [
    { 
      title: 'Tên danh mục', 
      dataIndex: 'category_name', 
      key: 'category_name', 
      width: '25%',
      render: (text) => <Text strong>{text}</Text>
    },
    { 
      title: 'Phân loại', 
      dataIndex: 'category_type', 
      key: 'category_type', 
      width: '20%',
      render: (type) => {
        const types = {
          property_type: { label: 'Loại chỗ nghỉ', color: 'blue' },
          room_type: { label: 'Loại phòng', color: 'purple' },
          amenity: { label: 'Tiện ích', color: 'orange' }
        };
        return <Tag color={types[type]?.color}>{types[type]?.label || type}</Tag>;
      }
    },
    { 
      title: 'Mô tả', 
      dataIndex: 'description', 
      key: 'description', 
      width: '30%',
      render: (desc) => <Text type="secondary">{desc}</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'category_status',
      key: 'category_status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'} variant="soft">
          {status === 'active' ? 'HOẠT ĐỘNG' : 'NGỪNG KINH DOANH'}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} style={{ color: '#1890ff' }}>Sửa</Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handle_delete_category(record.key)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // 3. Logic: Xóa danh mục
  const handle_delete_category = (key) => {
    Modal.confirm({
      title: 'Xác nhận xóa?',
      content: 'Việc xóa danh mục có thể ảnh hưởng đến các sản phẩm/phòng đang thuộc danh mục này.',
      okText: 'Đồng ý',
      okType: 'danger',
      onOk: () => {
        setCategoriesList(categories_list.filter(item => item.key !== key));
        message.success('Đã xóa danh mục thành công');
      }
    });
  };

  // 4. Logic: Thêm mới
  const handle_add_submit = (values) => {
    const new_category = {
      key: Date.now().toString(),
      category_name: values.category_name,
      category_type: values.category_type,
      description: values.description,
      category_status: 'active'
    };
    setCategoriesList([...categories_list, new_category]);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Thêm danh mục thành công!');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        variant={false}
        style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        title={
          <Title level={3} style={{ margin: 0 }}>
            <ApartmentOutlined /> Quản lý Danh mục hệ thống
          </Title>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} size="large">
            Thêm danh mục
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={categories_list} 
          bordered={false}
          pagination={{ pageSize: 6 }}
        />
      </Card>

      {/* Modal Thêm Danh Mục */}
      <Modal
        title="THÊM DANH MỤC MỚI"
        open={is_modal_visible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        okText="Xác nhận lưu"
        cancelText="Hủy bỏ"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handle_add_submit}>
          <Form.Item 
            name="category_name" 
            label="Tên danh mục" 
            rules={[{ required: true, message: 'Tên không được để trống!' }]}
          >
            <Input placeholder="VD: Khách sạn Boutique, View biển..." />
          </Form.Item>

          <Form.Item 
            name="category_type" 
            label="Phân loại hệ thống" 
            rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
          >
            <Select placeholder="Chọn nhóm danh mục">
              <Select.Option value="property_type">Loại chỗ nghỉ (Hotel, Resort, Villa...)</Select.Option>
              <Select.Option value="room_type">Loại phòng (Suite, Deluxe, Standard...)</Select.Option>
              <Select.Option value="amenity">Tiện ích (Wifi, Bể bơi, Gym...)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Mô tả chi tiết">
            <Input.TextArea rows={4} placeholder="Nhập mô tả ý nghĩa của danh mục này..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategories;