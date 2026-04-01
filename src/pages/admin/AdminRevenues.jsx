import React from 'react';
import { Card, Table, Typography, Row, Col, Statistic, DatePicker, Select, Space, Tag } from 'antd';
import { DollarTwoTone, SafetyCertificateTwoTone } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AdminRevenues = () => {
  const transaction_list = [
    { key: '1', id: 'HD1001', hotel: 'Vinpearl Luxury', amount: 5000000, method: 'Chuyển khoản', date: '2026-03-20', status: 'Thành công' },
    { key: '2', id: 'HD1002', hotel: 'InterContinental', amount: 3200000, method: 'Ví điện tử (Momo)', date: '2026-03-21', status: 'Thành công' },
    { key: '3', id: 'HD1004', hotel: 'Pullman Vũng Tàu', amount: 4500000, method: 'Thẻ Visa/Mastercard', date: '2026-03-23', status: 'Thành công' },
  ];

  const table_columns = [
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
    <div style={container_style}>
      <Card title={<Title level={3} style={no_margin_style}>Chi tiết Doanh thu Giao dịch</Title>}>
        <Row gutter={16} style={filter_row_style}>
          <Col span={8}>
            <Space direction="vertical" style={full_width_style}>
              <Text strong>Thời gian:</Text>
              <RangePicker style={full_width_style} />
            </Space>
          </Col>
          <Col span={8}>
            <Space direction="vertical" style={full_width_style}>
              <Text strong>Lọc theo khách sạn:</Text>
              <Select placeholder="Chọn khách sạn" style={full_width_style} allowClear>
                <Select.Option value="1">Vinpearl Luxury</Select.Option>
                <Select.Option value="2">InterContinental</Select.Option>
              </Select>
            </Space>
          </Col>
          <Col span={8}>
            <Statistic 
              title="Tổng thực thu" 
              value={12700000} 
              prefix={<DollarTwoTone twoToneColor="#52c41a" />} 
              suffix="đ" 
            />
          </Col>
        </Row>
        
        <Table columns={table_columns} dataSource={transaction_list} bordered />
      </Card>
    </div>
  );
};

const container_style = { padding: '24px' };
const no_margin_style = { margin: 0 };
const filter_row_style = { marginBottom: 24 };
const full_width_style = { width: '100%' };

export default AdminRevenues;