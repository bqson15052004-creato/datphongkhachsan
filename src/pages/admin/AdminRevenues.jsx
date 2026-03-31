import React from 'react';
import { Card, Table, Typography, Row, Col, Statistic, DatePicker, Select, Space, Tag } from 'antd';
import { DollarTwoTone, ExperimentTwoTone, BankOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AdminRevenues = () => {
  // Dữ liệu mẫu
  const transactions = [
    { key: '1', id: 'HD1001', hotel: 'Vinpearl Luxury', amount: 5000000, method: 'Chuyển khoản', date: '2026-03-20', status: 'Thành công' },
    { key: '2', id: 'HD1002', hotel: 'InterContinental', amount: 3200000, method: 'Ví điện tử (Momo)', date: '2026-03-21', status: 'Thành công' },
    { key: '3', id: 'HD1004', hotel: 'Pullman Vũng Tàu', amount: 4500000, method: 'Thẻ Visa/Mastercard', date: '2026-03-23', status: 'Thành công' },
    ];

    // Phần Select lọc phương thức thanh toán
    <Select placeholder="Phương thức thanh toán" style={{ width: '100%' }} allowClear>
    <Select.Option value="banking">Chuyển khoản ngân hàng</Select.Option>
    <Select.Option value="e-wallet">Ví điện tử (Momo/ZaloPay)</Select.Option>
    <Select.Option value="card">Thẻ quốc tế (Visa/Master)</Select.Option>
    </Select>

  const columns = [
    { title: 'Mã HĐ', dataIndex: 'id', key: 'id' },
    { title: 'Khách sạn', dataIndex: 'hotel', key: 'hotel' },
    { title: 'Ngày giao dịch', dataIndex: 'date', key: 'date' },
    { 
      title: 'Số tiền', 
      dataIndex: 'amount', 
      key: 'amount',
      render: (val) => <Text strong>{val.toLocaleString()}đ</Text> 
    },
    { title: 'Hình thức', dataIndex: 'method', key: 'method' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Thành công' ? 'green' : 'orange'}>{status}</Tag>
      )
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title={<Title level={3}>Chi tiết Doanh thu Giao dịch</Title>}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Thời gian:</Text>
              <RangePicker style={{ width: '100%' }} />
            </Space>
          </Col>
          <Col span={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Lọc theo khách sạn:</Text>
              <Select placeholder="Chọn khách sạn" style={{ width: '100%' }} allowClear>
                <Select.Option value="1">Vinpearl Luxury</Select.Option>
                <Select.Option value="2">InterContinental</Select.Option>
              </Select>
            </Space>
          </Col>
          <Col span={8}>
            <Statistic title="Tổng thực thu" value={9700000} prefix={<DollarTwoTone twoToneColor="#52c41a" />} suffix="đ" />
          </Col>
        </Row>
        <Table columns={columns} dataSource={transactions} bordered />
      </Card>
    </div>
  );
};

export default AdminRevenues;