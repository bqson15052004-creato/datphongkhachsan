import React, { useState } from 'react';
import { Card, Table, Typography, Row, Col, Statistic, DatePicker, Select, Space, Tag, Tooltip, Badge } from 'antd';
import { DollarTwoTone, FilterOutlined, BankOutlined, CreditCardOutlined, WalletOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AdminRevenues = () => {
  // 1. Dữ liệu mẫu (Bổ sung thêm commission_rate riêng cho từng hotel để thực tế hơn)
  const transaction_list = [
    { 
      key: '1', 
      transaction_id: 'HD1001', 
      hotel_name: 'Vinpearl Luxury Nha Trang', 
      total_amount: 5000000, 
      commission_rate: 0.15, // 15%
      payment_method: 'banking', 
      transaction_date: '2026-03-20', 
      payment_status: 'success' 
    },
    { 
      key: '2', 
      transaction_id: 'HD1002', 
      hotel_name: 'InterContinental Da Nang', 
      total_amount: 3200000, 
      commission_rate: 0.10, // 10%
      payment_method: 'e-wallet', 
      transaction_date: '2026-03-21', 
      payment_status: 'success' 
    },
    { 
      key: '3', 
      transaction_id: 'HD1004', 
      hotel_name: 'Pullman Vũng Tàu', 
      total_amount: 4500000, 
      commission_rate: 0.12, // 12%
      payment_method: 'card', 
      transaction_date: '2026-03-23', 
      payment_status: 'success' 
    },
  ];

  const format_currency = (val) => new Intl.NumberFormat('vi-VN').format(val) + 'đ';

  // Logic: Tính tổng lợi nhuận thực tế của Admin
  const total_admin_profit = transaction_list.reduce((acc, curr) => {
    return curr.payment_status === 'success' 
      ? acc + (curr.total_amount * curr.commission_rate) 
      : acc;
  }, 0);

  const columns = [
    { 
      title: 'Mã giao dịch', 
      dataIndex: 'transaction_id', 
      key: 'transaction_id',
      render: (id) => <Text code>{id}</Text>
    },
    { 
      title: 'Khách sạn', 
      dataIndex: 'hotel_name', 
      key: 'hotel_name',
      render: (text) => <Text strong>{text}</Text>
    },
    { 
      title: 'Ngày giao dịch', 
      dataIndex: 'transaction_date', 
      key: 'transaction_date' 
    },
    {
      title: 'Tổng thu',
      dataIndex: 'total_amount',
      key: 'total_amount',
      align: 'right',
      render: (val) => <Text>{format_currency(val)}</Text>
    },
    {
      title: 'Tỷ lệ %',
      dataIndex: 'commission_rate',
      key: 'commission_rate',
      align: 'center',
      render: (rate) => <Tag color="orange">{rate * 100}%</Tag>
    },
    {
      title: 'Thực thu Admin',
      key: 'admin_profit',
      align: 'right',
      render: (_, record) => {
        const profit = record.total_amount * record.commission_rate; 
        return <Text strong style={{ color: '#52c41a' }}>+{format_currency(profit)}</Text>
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'payment_status',
      key: 'payment_status',
      align: 'center',
      render: (status) => (
        <Badge status={status === 'success' ? 'success' : 'processing'} text={status === 'success' ? 'Thành công' : 'Chờ xử lý'} />
      )
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        variant={false} 
        style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
        title={
          <Space>
            <DollarTwoTone twoToneColor="#52c41a" style={{ fontSize: '24px' }} />
            <Title level={4} style={{ margin: 0 }}>Báo cáo doanh thu</Title>
          </Space>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 32 }} align="bottom">
          <Col xs={24} lg={15}>
            <Row gutter={[12, 12]}>
              <Col span={10}>
                <Text strong><FilterOutlined /> Lọc thời gian:</Text>
                <RangePicker style={{ width: '100%', marginTop: 8 }} />
              </Col>
              <Col span={7}>
                <Text strong>Đối tác:</Text>
                <Select placeholder="Chọn khách sạn" style={{ width: '100%', marginTop: 8 }} allowClear>
                  <Select.Option value="1">Vinpearl Luxury</Select.Option>
                  <Select.Option value="2">InterContinental</Select.Option>
                </Select>
              </Col>
            </Row>
          </Col>

          <Col xs={24} lg={9}>
            <Card style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 12 }}>
              <Statistic 
                title={
                  <Space>
                    <Text strong style={{ color: '#389e0d' }}>LỢI NHUẬN HỆ THỐNG</Text>
                    <Tooltip title="Tổng số tiền hoa hồng thực nhận sau khi trừ các khoản giảm giá (nếu có)">
                      <InfoCircleOutlined style={{ fontSize: '12px' }} />
                    </Tooltip>
                  </Space>
                } 
                value={total_admin_profit} 
                content={{ color: '#3f8600', fontWeight: 'bold', fontSize: '28px' }} 
                suffix="₫" 
              />
            </Card>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={transaction_list} 
          bordered={false} 
          rowKey="transaction_id"
          pagination={{ pageSize: 8, showSizeChanger: false }}
          className="admin-table-custom"
        />
      </Card>
    </div>
  );
};

export default AdminRevenues;