import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, Tag, Modal, Form, Input, message, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, LockOutlined, UnlockOutlined, ApartmentOutlined } from '@ant-design/icons';

// Đảm bảo file mockData.jsx đã được thêm status: 'active' như mình đã bàn
import { HOTEL_TYPES } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;

const AdminCategories = () => {
  const [is_modal_visible, setIsModalVisible] = useState(false);
  const [editing_key, setEditingKey] = useState(null); 
  const [form] = Form.useForm();
  const [categories_list, setCategoriesList] = useState([]);

  useEffect(() => {
    const saved_categories = localStorage.getItem('HOTEL_CATEGORIES');
    if (saved_categories) {
      const parsedData = JSON.parse(saved_categories);
      // Kiểm tra an toàn: Nếu data trong máy thiếu trường status, ép nó về 'active' luôn
      const validatedData = parsedData.map(item => ({
        ...item,
        status: item.status || 'active'
      }));
      setCategoriesList(validatedData);
    } else {
      // Nạp từ mockData và ép 'active'
      const initial_data = HOTEL_TYPES.map(item => ({
        ...item,
        status: 'active' 
      }));
      setCategoriesList(initial_data);
      localStorage.setItem('HOTEL_CATEGORIES', JSON.stringify(initial_data));
    }
  }, []);

  const save_to_db = (new_data) => {
    setCategoriesList(new_data);
    localStorage.setItem('HOTEL_CATEGORIES', JSON.stringify(new_data));
  };

  const handle_toggle_status = (record) => {
    const is_active = record.status === 'active';
    const action_text = is_active ? 'KHÓA' : 'MỞ KHÓA';

    Modal.confirm({
      title: `Xác nhận ${action_text} loại khách sạn?`,
      content: `Bạn đang chuẩn bị ${action_text.toLowerCase()} loại khách sạn: ${record.category_name}`,
      okText: action_text,
      okType: is_active ? 'danger' : 'primary',
      centered: true,
      onOk: () => {
        const new_list = categories_list.map(item => {
          if (item.key === record.key) {
            return { ...item, status: is_active ? 'blocked' : 'active' };
          }
          return item;
        });
        save_to_db(new_list);
        message.success(`Đã ${action_text} thành công!`);
      }
    });
  };

  const columns = [
    { 
      title: 'Loại khách sạn', 
      dataIndex: 'category_name', 
      key: 'category_name', 
      render: (text) => <Text strong>{text}</Text>
    },
    { 
      title: 'Mô tả', 
      dataIndex: 'description', 
      key: 'description', 
      render: (desc) => <Text type="secondary" italic>{desc || 'Chưa có mô tả chi tiết...'}</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center',
      render: (status) => {
        const isActive = !status || status === 'active'; 
        return (
          <Tag 
            color={isActive ? 'blue' : 'red'} 
            //icon={isActive ? <UnlockOutlined /> : <LockOutlined />}
            style={{ borderRadius: '4px', padding: '2px 8px' }}
          >
            {isActive ? 'Đang mở' : 'Đang khóa'}
          </Tag>
        );
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right',
      width: 120,
      render: (_, record) => {
        const is_active = !record.status || record.status === 'active';
        return (
          <Space size="small">
            <Tooltip title={is_active ? "Chỉnh sửa" : "Không thể sửa khi đang khóa"}>
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                // VÔ HIỆU HÓA NÚT SỬA KHI ĐANG KHÓA
                disabled={!is_active} 
                onClick={() => handle_edit_click(record)} 
              />
            </Tooltip>
            
            <Tooltip title={is_active ? "Nhấn để Khóa" : "Nhấn để Mở khóa"}>
              <Button 
                type="text" 
                icon={is_active 
                  ? <UnlockOutlined style={{ color: 'blue', fontSize: '16px' }} /> 
                  : <LockOutlined style={{ color: 'red', fontSize: '16px' }} />
                } 
                onClick={() => handle_toggle_status(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const handle_edit_click = (record) => {
    setEditingKey(record.key);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handle_submit = (values) => {
    let new_list = [];
    if (editing_key) {
      new_list = categories_list.map(item => 
        item.key === editing_key ? { ...item, ...values } : item
      );
      message.success('Cập nhật thành công!');
    } else {
      const new_category = {
        key: `CAT-${Date.now()}`,
        ...values,
        status: 'active'
      };
      new_list = [...categories_list, new_category];
      message.success('Thêm mới thành công!');
    }
    save_to_db(new_list);
    setIsModalVisible(false);
    setEditingKey(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        variant={false}
        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        title={
          <Space>
            <ApartmentOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
            <Title level={4} style={{ margin: 0 }}>Danh mục loại khách sạn</Title>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingKey(null); form.resetFields(); setIsModalVisible(true); }}>
            Thêm loại khách sạn mới
          </Button>
        }
      >
        <Table columns={columns} dataSource={categories_list} rowKey="key" pagination={{ pageSize: 7 }} />
      </Card>

      <Modal
        title={editing_key ? "CẬP NHẬT THÔNG TIN" : "THÊM LOẠI MỚI"}
        open={is_modal_visible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu lại"
        cancelText="Hủy bỏ"
        centered
      >
        <Form form={form} layout="vertical" onFinish={handle_submit} style={{ marginTop: 20 }}>
          <Form.Item name="category_name" label="Tên loại khách sạn" rules={[{ required: true, message: 'Không được để trống!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategories;