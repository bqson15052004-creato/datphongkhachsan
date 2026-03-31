import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, Tag, Modal, Form, Input, Select, InputNumber, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PercentageOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AdminDiscounts = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Dữ liệu mẫu
  const [discounts, setDiscounts] = useState([
    { 
      key: '1', 
      code: 'SONDEPTRAI20',
      name: 'Khuyến mãi mùa hè', 
      type: 'Khách hàng', 
      percent: 20, 
      status: 'Đang chạy', 
      expiry: '2026-06-30' 
    },
    { 
      key: '2', 
      code: 'PARTNER15', 
      name: 'Hoa hồng tiêu chuẩn', 
      type: 'Đối tác', 
      percent: 15, 
      status: 'Đang chạy', 
      expiry: 'Không thời hạn' 
    },
    { 
      key: '3', 
      code: 'FLASH50', 
      name: 'Giảm giá Flash Sale', 
      type: 'Khách hàng', 
      percent: 50, 
      status: 'Hết hạn', 
      expiry: '2026-02-15' 
    },
  ]);

  const columns = [
    { title: 'Mã Code', dataIndex: 'code', key: 'code', render: (text) => <b>{text}</b> },
    { title: 'Tên chương trình', dataIndex: 'name', key: 'name' },
    { 
      title: 'Đối tượng áp dụng', 
      dataIndex: 'type', 
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Khách hàng' ? 'blue' : 'purple'}>{type}</Tag>
      )
    },
    { 
      title: 'Mức giảm (%)', 
      dataIndex: 'percent', 
      key: 'percent',
      render: (percent) => <Text type="danger" strong>{percent}%</Text>
    },
    { title: 'Hạn sử dụng', dataIndex: 'expiry', key: 'expiry' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Đang chạy' ? 'green' : 'default'}>{status}</Tag>
      )
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

  const handleAddSubmit = (values) => {
    const newDiscount = {
      key: Date.now().toString(),
      code: values.code.toUpperCase(),
      name: values.name,
      type: values.type,
      percent: values.percent,
      status: 'Đang chạy',
      expiry: values.expiry ? values.expiry.format('YYYY-MM-DD') : 'Không thời hạn'
    };
    setDiscounts([...discounts, newDiscount]);
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title={<Title level={3} style={{ margin: 0 }}>Thiết lập Chiết khấu & Khuyến mãi</Title>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Tạo mã mới
          </Button>
        }
      >
        <Table columns={columns} dataSource={discounts} bordered />
      </Card>

      <Modal 
        title="Tạo chương trình Chiết khấu / Khuyến mãi mới" 
        open={isModalVisible} 
        onOk={() => form.submit()} 
        onCancel={() => setIsModalVisible(false)}
        okText="Khởi tạo"
        cancelText="Hủy bỏ"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleAddSubmit}>
          <Form.Item name="name" label="Tên chương trình" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="VD: Khuyến mãi mừng khai trương" />
          </Form.Item>
          
          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="code" label="Mã Code" rules={[{ required: true, message: 'Nhập mã!' }]}>
              <Input placeholder="VD: SUMMER20" style={{ textTransform: 'uppercase' }} />
            </Form.Item>

            <Form.Item name="percent" label="Mức tỷ lệ (%)" rules={[{ required: true, message: 'Nhập tỷ lệ!' }]}>
              <InputNumber min={1} max={100} formatter={value => `${value}%`} parser={value => value.replace('%', '')} style={{ width: '100px' }} />
            </Form.Item>
          </Space>

          <Form.Item name="type" label="Đối tượng áp dụng" rules={[{ required: true, message: 'Vui lòng chọn!' }]}>
            <Select placeholder="Chọn đối tượng">
              <Select.Option value="Khách hàng">Khách hàng (Mã giảm giá đặt phòng)</Select.Option>
              <Select.Option value="Đối tác">Đối tác (Tỷ lệ thu hoa hồng)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="expiry" label="Ngày hết hạn (Bỏ trống nếu không thời hạn)">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Chọn ngày hết hạn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDiscounts;