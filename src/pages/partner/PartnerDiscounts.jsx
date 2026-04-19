import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Space, Typography, Tag, Modal, Form, Input, Select, DatePicker, message, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagOutlined, HomeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { MOCK_HOTELS, MOCK_DISCOUNTS } from '../../constants/mockData';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const PartnerDiscounts = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [discounts, setDiscounts] = useState(MOCK_DISCOUNTS);
  
  // Quản lý trang hiện tại để tính STT chính xác
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 1. LOGIC SẮP XẾP: Luôn ưu tiên mã có ngày bắt đầu gần nhất lên trước (hoặc ngược lại)
  // Tôi dùng useMemo để danh sách tự sắp xếp lại mỗi khi discounts thay đổi
  const sortedDiscounts = useMemo(() => {
    return [...discounts].sort((a, b) => {
      // Sắp xếp theo ngày bắt đầu (Tăng dần: Ngày sớm nhất lên đầu)
      return dayjs(a.start_date).unix() - dayjs(b.start_date).unix();
    });
  }, [discounts]);

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      align: 'center',
      // Công thức tính STT nối tiếp khi qua trang
      render: (_, __, index) => <Text strong>{(currentPage - 1) * pageSize + index + 1}</Text>,
    },
    { 
      title: 'Mã Code', 
      dataIndex: 'code', 
      key: 'code',
      render: (code) => <Tag color="blue" style={{ fontWeight: 'bold' }} icon={<TagOutlined />}>{code}</Tag>
    },
    { 
      title: 'Khách sạn áp dụng', 
      dataIndex: 'id_hotels', 
      key: 'id_hotels',
      width: 280,
      render: (id_list) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {id_list.map(id => {
            const hotel = MOCK_HOTELS.find(h => h.id_hotel === id);
            return (
              <Tag icon={<HomeOutlined />} key={id} color="cyan">
                {hotel ? hotel.hotel_name : `Hotel ${id}`}
              </Tag>
            );
          })}
        </div>
      )
    },
    { 
      title: 'Giảm (%)', 
      dataIndex: 'percentage', 
      key: 'percentage',
      align: 'center',
      render: (p) => <Text type="danger" strong>{p}%</Text>
    },
    { 
      title: 'Ngày bắt đầu', 
      dataIndex: 'start_date', 
      key: 'start_date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => dayjs(a.start_date).unix() - dayjs(b.start_date).unix(), // Cho phép click vào tiêu đề để sort tay
    },
    { 
      title: 'Ngày kết thúc', 
      dataIndex: 'end_date', 
      key: 'end_date',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    { 
      title: 'Trạng thái', 
      key: 'status',
      align: 'center',
      render: (_, record) => {
        const isExpired = dayjs().isAfter(dayjs(record.end_date));
        return <Tag color={isExpired ? 'default' : 'green'}>{isExpired ? 'Hết hạn' : 'Còn hạn'}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} />
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => {
              setDiscounts(discounts.filter(item => item.id_discount !== record.id_discount));
              message.success('Đã xóa mã giảm giá');
            }}
          />
        </Space>
      ),
    },
  ];

  const handleAddDiscount = (values) => {
    const [startDate, endDate] = values.range;
    const newDiscount = {
      id_discount: `D${Date.now()}`,
      code: values.code.toUpperCase(),
      id_hotels: values.id_hotels,
      percentage: values.percentage,
      start_date: startDate.format('YYYY-MM-DD'),
      end_date: endDate.format('YYYY-MM-DD'),
    };

    setDiscounts([newDiscount, ...discounts]);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Tạo mã thành công!');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <TagOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>Quản lý Mã giảm giá</Title>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Thêm mã mới
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={sortedDiscounts} // Sử dụng mảng đã sort
          rowKey="id_discount" 
          bordered 
          pagination={{ 
            current: currentPage,
            pageSize: pageSize,
            onChange: (page) => setCurrentPage(page),
            showTotal: (total) => `Tổng cộng ${total} mã`,
            position: ['bottomRight']
          }}
        />
      </Card>

      <Modal
        title="Tạo chương trình giảm giá"
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        width={750}
      >
        <Form form={form} layout="vertical" onFinish={handleAddDiscount}>
          <Form.Item 
            name="id_hotels" 
            label="Chọn khách sạn áp dụng" 
            rules={[{ required: true }]}
          >
            <Select mode="multiple" placeholder="Chọn khách sạn" allowClear>
              {MOCK_HOTELS.map(h => (
                <Select.Option key={h.id_hotel} value={h.id_hotel}>{h.hotel_name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Space style={{ display: 'flex', width: '100%' }} align="baseline">
            <Form.Item name="code" label="Mã Code" rules={[{ required: true }]} style={{ width: 220 }}>
              <Input placeholder="KM2026" style={{ textTransform: 'uppercase' }} />
            </Form.Item>
            <Form.Item name="percentage" label="Giảm %" rules={[{ required: true }]} style={{ width: 120 }}>
              <InputNumber min={1} max={100} suffix="%" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="range" label="Thời gian hiệu lực" rules={[{ required: true }]} style={{ flex: 1 }}>
              <RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default PartnerDiscounts;