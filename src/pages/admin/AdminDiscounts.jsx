import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, Tag, Modal, Form, Input, Select, InputNumber, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AdminDiscounts = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 1. Dữ liệu mẫu theo chuẩn snake_case (Khớp với bảng discount trong ERD)
  const [discounts, setDiscounts] = useState([
    {
      id_discount: '1',
      code: 'SONDEPTRAI20',
      name: 'Khuyến mãi mùa hè',
      target_type: 'customer', // customer | partner
      percentage: 20,
      status: 'active', // active | expired | hidden
      start_date: '2026-03-01',
      end_date: '2026-06-30'
    },
    {
      id_discount: '2',
      code: 'PARTNER15',
      name: 'Hoa hồng tiêu chuẩn',
      target_type: 'partner',
      percentage: 15,
      status: 'active',
      start_date: '2026-01-01',
      end_date: null // Không thời hạn
    }
  ]);

  // 2. Cấu hình cột Table
  const columns = [
    { 
      title: 'Mã Code', 
      dataIndex: 'code', 
      key: 'code', 
      render: (text) => <Tag color="orange" style={{ fontWeight: 'bold' }}>{text}</Tag> 
    },
    { title: 'Tên chương trình', dataIndex: 'name', key: 'name' },
    {
      title: 'Đối tượng',
      dataIndex: 'target_type',
      key: 'target_type',
      render: (type) => (
        <Tag color={type === 'customer' ? 'blue' : 'purple'}>
          {type === 'customer' ? 'Khách hàng' : 'Đối tác'}
        </Tag>
      )
    },
    {
      title: 'Mức giảm (%)',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (val) => <Text type="danger" strong>{val}%</Text>
    },
    { 
      title: 'Hạn dùng', 
      dataIndex: 'end_date', 
      key: 'end_date',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'Vô thời hạn'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'active' ? 'green' : 'default';
        let text = status === 'active' ? 'Đang chạy' : 'Hết hạn';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} size="small">Sửa</Button>
          <Button type="link" danger icon={<DeleteOutlined />} size="small">Xóa</Button>
        </Space>
      ),
    },
  ];

  // 3. Xử lý thêm mới (Dữ liệu gửi lên Backend)
  const handleAddSubmit = (values) => {
    const newDiscount = {
      id_discount: Date.now().toString(),
      code: values.code.toUpperCase(),
      name: values.name,
      target_type: values.target_type,
      percentage: values.percentage,
      status: 'active',
      start_date: dayjs().format('YYYY-MM-DD'), // Ngày tạo là ngày bắt đầu
      end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : null
    };

    setDiscounts([...discounts, newDiscount]);
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={<Title level={4} style={{ margin: 0 }}>Quản lý Chiết khấu & Hoa hồng</Title>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Tạo mã mới
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={discounts} 
          rowKey="id_discount" // Khớp với khóa chính trong ERD
          bordered 
        />
      </Card>

      <Modal
        title="Thiết lập chương trình mới"
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu cấu hình"
        cancelText="Hủy"
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleAddSubmit}>
          <Form.Item name="name" label="Tên chương trình" rules={[{ required: true, message: 'Bắt buộc nhập!' }]}>
            <Input placeholder="VD: Giảm giá khai trương hè 2026" />
          </Form.Item>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item name="code" label="Mã Code" style={{ flex: 1 }} rules={[{ required: true, message: 'Nhập mã!' }]}>
              <Input placeholder="VD: SUMMER26" style={{ textTransform: 'uppercase' }} />
            </Form.Item>

            <Form.Item name="percentage" label="Tỷ lệ (%)" rules={[{ required: true, message: 'Nhập %!' }]}>
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item name="target_type" label="Đối tượng áp dụng" rules={[{ required: true }]}>
            <Select placeholder="Chọn loại đối tượng">
              <Select.Option value="customer">Khách hàng (Mã giảm giá đặt phòng)</Select.Option>
              <Select.Option value="partner">Đối tác (Tỷ lệ thu hoa hồng hệ thống)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="end_date" label="Ngày hết hạn (Bỏ trống nếu vô thời hạn)">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDiscounts;