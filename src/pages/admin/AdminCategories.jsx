import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, Tag, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ApartmentOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminCategories = () => {
  const [is_modal_visible, setIsModalVisible] = useState(false);
  // Thêm state để lưu key của danh mục đang được sửa (Nếu null nghĩa là đang Thêm mới)
  const [editing_key, setEditingKey] = useState(null); 
  const [form] = Form.useForm();

  const [categories_list, setCategoriesList] = useState([
    { 
      key: '1', 
      category_name: 'Khách sạn 5 sao', 
      description: 'Khách sạn cao cấp có đầy đủ tiện nghi' 
    },
    { 
      key: '2', 
      category_name: 'Resort', 
      description: 'Khu nghỉ dưỡng sinh thái, không gian xanh' 
    },
    { 
      key: '3', 
      category_name: 'Phòng Suite', 
      description: 'Phòng cao cấp nhất, diện tích lớn, view đẹp' 
    },
    { 
      key: '4', 
      category_name: 'Hồ bơi vô cực', 
      description: 'Tiện ích cao cấp cho khách lưu trú' 
    },
  ]);

  const columns = [
    { 
      title: 'Loại khách sạn', 
      dataIndex: 'category_name', 
      key: 'category_name', 
      width: '25%',
      render: (text) => <Text strong>{text}</Text>
    },
    { 
      title: 'Mô tả', 
      dataIndex: 'description', 
      key: 'description', 
      width: '30%',
      render: (desc) => <Text type="secondary">{desc}</Text>
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          {/* Gọi hàm Sửa và truyền record vào */}
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            style={{ color: '#1890ff' }}
            onClick={() => handle_edit_click(record)}
          >
            Sửa
          </Button>
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

  const handle_delete_category = (key) => {
    Modal.confirm({
      title: 'Xác nhận xóa?',
      content: 'Việc xóa có thể ảnh hưởng đến các sản phẩm/phòng đang thuộc loại khách sạn này.',
      okText: 'Đồng ý',
      okType: 'danger',
      onOk: () => {
        setCategoriesList(categories_list.filter(item => item.key !== key));
        message.success('Đã xóa danh mục thành công');
      }
    });
  };

  // Nút Mở Modal Thêm Mới
  const open_add_modal = () => {
    setEditingKey(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Logic: Nút Mở Modal Sửa
  const handle_edit_click = (record) => {
    setEditingKey(record.key);
    form.setFieldsValue({
      category_name: record.category_name,
      description: record.description,
    });
    setIsModalVisible(true);
  };

  // Logic: Gộp chung xử lý Submit cho cả Thêm và Sửa
  const handle_submit = (values) => {
    if (editing_key) {
      // TRƯỜNG HỢP SỬA
      const updated_list = categories_list.map(item => {
        if (item.key === editing_key) {
          return { ...item, category_name: values.category_name, description: values.description };
        }
        return item;
      });
      setCategoriesList(updated_list);
      message.success('Cập nhật thành công!');
    } else {
      // TRƯỜNG HỢP THÊM MỚI
      const new_category = {
        key: Date.now().toString(),
        category_name: values.category_name,
        description: values.description,
      };
      setCategoriesList([...categories_list, new_category]);
      message.success('Thêm loại khách sạn mới thành công!');
    }

    // Đóng modal và reset
    setIsModalVisible(false);
    setEditingKey(null);
    form.resetFields();
  };

  const handle_cancel_modal = () => {
    setIsModalVisible(false);
    setEditingKey(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        variant={false}
        style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        title={
          <Title level={3} style={{ margin: 0 }}>
            <ApartmentOutlined /> Quản lý loại khách sạn
          </Title>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={open_add_modal} size="large">
            Thêm loại khách sạn mới
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

      {/* Modal Thêm/Sửa Danh Mục */}
      <Modal
        title={editing_key ? "CẬP NHẬT LOẠI KHÁCH SẠN" : "THÊM LOẠI KHÁCH SẠN MỚI"}
        open={is_modal_visible}
        onOk={() => form.submit()}
        onCancel={handle_cancel_modal}
        okText="Xác nhận"
        cancelText="Huỷ"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handle_submit}>
          <Form.Item 
            name="category_name" 
            label="Loại khách sạn" 
            rules={[{ required: true, message: 'Vui lòng nhập tên loại khách sạn!' }]}
          >
            <Input placeholder="VD: Khách sạn Boutique, View biển..." />
          </Form.Item>

          <Form.Item name="description" label="Mô tả chi tiết">
            <Input.TextArea rows={4} placeholder="Nhập mô tả của loại khách sạn này..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategories;