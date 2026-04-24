import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Row, Col, Statistic, DatePicker, Select, Space, Tag, Tooltip, Badge } from 'antd';
import { DollarTwoTone, FilterOutlined, InfoCircleOutlined } from '@ant-design/icons';

// Import dữ liệu từ mockData
import { TRANSACTION_LIST_MOCK } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AdminRevenues = () => {
  const [transaction_list, setTransactionList] = useState([]);

  // 1. Kết nối và khởi tạo dữ liệu
  useEffect(() => {
    const saved_transactions = localStorage.getItem('TRANSACTION_DATA');
    if (saved_transactions) {
      setTransactionList(JSON.parse(saved_transactions));
    } else {
      // Nếu chưa có, nạp từ mockData và lưu vào máy
      setTransactionList(TRANSACTION_LIST_MOCK);
      localStorage.setItem('TRANSACTION_DATA', JSON.stringify(TRANSACTION_LIST_MOCK));
    }
  }, []);

  // 2. Định dạng tiền VND
  const format_currency = (val) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(val);
  };

  // 3. Tính toán tổng lợi nhuận Admin dựa trên danh sách hiện tại
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
      render: (rate) => <Tag color="orange">{Math.round(rate * 100)}%</Tag>
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
        <Badge 
          status={status === 'success' ? 'success' : 'processing'} 
          text={status === 'success' ? 'Thành công' : 'Chờ xử lý'} 
        />
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
              <Col span={12}>
                <Text strong><FilterOutlined /> Lọc thời gian:</Text>
                <RangePicker style={{ width: '100%', marginTop: 8 }} placeholder={['Từ ngày', 'Đến ngày']} />
              </Col>
              <Col span={12}>
                <Text strong>Đối tác:</Text>
                <Select placeholder="Chọn khách sạn" style={{ width: '100%', marginTop: 8 }} allowClear>
                  {/* Map từ dữ liệu thực tế để Select luôn đúng */}
                  {[...new Set(transaction_list.map(t => t.hotel_name))].map(name => (
                    <Select.Option key={name} value={name}>{name}</Select.Option>
                  ))}
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
                    <Tooltip title="Tổng tiền hoa hồng thực nhận">
                      <InfoCircleOutlined style={{ fontSize: '12px' }} />
                    </Tooltip>
                  </Space>
                } 
                value={total_admin_profit} 
                formatter={(val) => <span style={{ color: '#3f8600', fontWeight: 'bold', fontSize: '28px' }}>{format_currency(val)}</span>}
              />
            </Card>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={transaction_list} 
          rowKey="transaction_id"
          pagination={{ pageSize: 8 }}
        />
      </Card>
    </div>
  );
};

export default AdminRevenues;