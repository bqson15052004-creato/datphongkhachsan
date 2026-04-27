import React, { useState, useMemo } from 'react';
import { 
  Card, Table, Button, Space, Typography, Tag, Modal, Form, 
  Input, Select, DatePicker, App as AntApp, InputNumber, Row, Col 
} from 'antd';
import { PlusOutlined, EditOutlined, LockOutlined, UnlockOutlined, TagOutlined, HomeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { MOCK_HOTELS, MOCK_DISCOUNTS } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const PartnerDiscounts = () => {
  const { message: antdMessage, modal: antdModal } = AntApp.useApp();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null); // Trạng thái đang sửa mã nào
  const [form] = Form.useForm();

  // Khởi tạo thêm status cho mock data nếu chưa có
  const [discounts, setDiscounts] = useState(
    MOCK_DISCOUNTS.map(d => ({ ...d, status: d.status || 'active' }))
  );
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const sortedDiscounts = useMemo(() => {
    return [...discounts].sort((a, b) => dayjs(a.start_date).unix() - dayjs(b.start_date).unix());
  }, [discounts]);

  // --- LOGIC KHÓA / MỞ KHÓA ---
  const handleToggleLock = (record) => {
    const isCurrentlyLocked = record.status === 'locked';
    const actionText = isCurrentlyLocked ? 'mở khóa' : 'khóa';

    antdModal.confirm({
      title: `Xác nhận ${actionText} mã giảm giá?`,
      icon: isCurrentlyLocked ? <UnlockOutlined style={{ color: '#52c41a' }} /> : <LockOutlined style={{ color: '#ff4d4f' }} />,
      content: `Bạn chắc chắn muốn ${actionText} mã "${record.code}" chứ?`,
      okText: `Xác nhận ${actionText}`,
      okType: isCurrentlyLocked ? 'primary' : 'danger',
      onOk: () => {
        setDiscounts(prev => prev.map(item => 
          item.id_discount === record.id_discount 
            ? { ...item, status: isCurrentlyLocked ? 'active' : 'locked' } 
            : item
        ));
        antdMessage.success(`Đã ${actionText} mã giảm giá thành công!`);
      },
    });
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center',
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
      width: 250,
      render: (id_list) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {/* THÊM CHECK MẢNG TẠI ĐÂY */}
          {Array.isArray(id_list) && id_list.map(id => {
            const hotel = MOCK_HOTELS.find(h => h.id_hotel === id);
            return (
              <Tag icon={<HomeOutlined />} key={id} color="cyan">
                {hotel ? hotel.hotel_name : `Hotel ${id}`}
              </Tag>
            );
          })}
          {!id_list || id_list.length === 0 ? <Text type="secondary">Tất cả</Text> : null}
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
      title: 'Hiệu lực', 
      key: 'duration',
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div><Text type="secondary">Từ:</Text> {dayjs(record.start_date).format('DD/MM/YYYY')}</div>
          <div><Text type="secondary">Đến:</Text> {dayjs(record.end_date).format('DD/MM/YYYY')}</div>
        </div>
      )
    },
    { 
      title: 'Trạng thái', 
      key: 'status',
      align: 'center',
      render: (_, record) => {
        if (record.status === 'locked') return <Tag color="error">ĐÃ KHÓA</Tag>;
        const isExpired = dayjs().isAfter(dayjs(record.end_date));
        return <Tag color={isExpired ? 'default' : 'blue'}>{isExpired ? 'Hết hạn' : 'Đang hoạt động'}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          {/* NÚT SỬA */}
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: record.status === 'locked' ? '#d9d9d9' : 'blue' }} />} 
            disabled={record.status === 'locked'}
            onClick={() => {
              setEditingId(record.id_discount);
              form.setFieldsValue({
                ...record,
                range: [dayjs(record.start_date), dayjs(record.end_date)]
              });
              setIsModalVisible(true);
            }}
          />
          
          <Button 
            type="text" 
            icon={
              record.status === 'locked' 
                ? <LockOutlined style={{ color: 'red' }} /> 
                : <UnlockOutlined style={{ color: 'blue' }} />
            } 
            onClick={() => handleToggleLock(record)}
          />
        </Space>
      ),
    },
  ];

  const handleSubmit = (values) => {
    const [startDate, endDate] = values.range;
    const discountData = {
      code: values.code.toUpperCase(),
      id_hotels: values.id_hotels,
      percentage: values.percentage,
      start_date: startDate.format('YYYY-MM-DD'),
      end_date: endDate.format('YYYY-MM-DD'),
      status: 'active'
    };

    if (editingId) {
      // Logic cập nhật
      setDiscounts(prev => prev.map(item => 
        item.id_discount === editingId ? { ...item, ...discountData } : item
      ));
      antdMessage.success('Cập nhật mã thành công!');
    } else {
      // Logic thêm mới
      const newDiscount = {
        ...discountData,
        id_discount: `D${Date.now()}`,
      };
      setDiscounts([newDiscount, ...discounts]);
      antdMessage.success('Tạo mã mới thành công!');
    }

    setIsModalVisible(false);
    setEditingId(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <TagOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>Chương trình khuyến mãi</Title>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            setEditingId(null);
            form.resetFields();
            setIsModalVisible(true);
          }}>
            Tạo mã giảm giá mới
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={sortedDiscounts}
          rowKey="id_discount" 
          pagination={{ 
            current: currentPage,
            pageSize: pageSize,
            onChange: (page) => setCurrentPage(page),
            showTotal: (total) => `Tổng cộng ${total} mã`,
          }}
        />
      </Card>

      <Modal
        title={editingId ? "Cập nhật mã giảm giá" : "Tạo mã giảm giá"}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingId(null);
        }}
        width={700}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Form.Item 
            name="id_hotels" 
            label="Khách sạn áp dụng" 
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 khách sạn' }]}
          >
            <Select mode="multiple" placeholder="Chọn khách sạn" allowClear>
              {MOCK_HOTELS.map(h => (
                <Select.Option key={h.id_hotel} value={h.id_hotel}>{h.hotel_name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="code" label="Mã Code" rules={[{ required: true }]}>
                <Input placeholder="KM2026" style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="percentage" label="Giảm %" rules={[{ required: true }]}>
                <InputNumber min={1} max={100} suffix="%" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="range" label="Thời gian hiệu lực" rules={[{ required: true }]}>
                <RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PartnerDiscounts;