import React from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Space, DatePicker, Tag, Progress } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  DollarCircleOutlined, 
  ShoppingOutlined, 
  UserOutlined,
  HomeOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AdminReports = () => {
  const revenue_data = [
    { key: '1', month: 'Tháng 1', amount: '150.000.000', bookings: 45, status: 'Tăng' },
    { key: '2', month: 'Tháng 2', amount: '120.000.000', bookings: 38, status: 'Giảm' },
    { key: '3', month: 'Tháng 3', amount: '210.000.000', bookings: 62, status: 'Tăng' },
  ];

  const top_hotels = [
    { name: 'Vinpearl Luxury Nha Trang', sales: 85, revenue: '212.000.000đ', rate: 95 },
    { name: 'InterContinental Da Nang', sales: 72, revenue: '302.000.000đ', rate: 88 },
    { name: 'Pullman Vũng Tàu', sales: 50, revenue: '90.000.000đ', rate: 70 },
  ];

  const table_columns = [
    { title: 'Thời gian', dataIndex: 'month', key: 'month' },
    { title: 'Doanh thu', dataIndex: 'amount', key: 'amount', render: (val) => `${val}đ` },
    { title: 'Số đơn', dataIndex: 'bookings', key: 'bookings' },
    { 
      title: 'Xu hướng', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => <Tag color={status === 'Tăng' ? 'green' : 'red'}>{status}</Tag>
    }
  ];

  return (
    <div style={container_style}>
      <div style={header_style}>
        <Title level={3} style={no_margin_style}>Báo cáo & Thống kê kinh doanh</Title>
        <Space>
          <Text strong>Lọc theo thời gian:</Text>
          <RangePicker />
        </Space>
      </div>

      {/* 1. Các con số tổng quan */}
      <Row gutter={[16, 16]} style={margin_bottom_style}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={card_shadow_style}>
            <Statistic
              title="Tổng doanh thu (tháng này)"
              value={480000000}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarCircleOutlined />}
              suffix="đ"
            />
            <Text type="success"><ArrowUpOutlined /> 12% so với tháng trước</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={card_shadow_style}>
            <Statistic
              title="Tổng lượt đặt phòng"
              value={145}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="success"><ArrowUpOutlined /> 5% tăng trưởng</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={card_shadow_style}>
            <Statistic
              title="Thành viên mới"
              value={28}
              prefix={<UserOutlined />}
            />
            <Text type="danger"><ArrowDownOutlined /> 2% giảm nhẹ</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={card_shadow_style}>
            <Statistic
              title="Đối tác hoạt động"
              value={12}
              prefix={<HomeOutlined />}
            />
            <Tag color="green">Đang ổn định</Tag>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 2. Bảng doanh thu theo tháng */}
        <Col xs={24} lg={14}>
          <Card title="Diễn biến doanh thu gần đây" style={full_height_style}>
            <Table 
              dataSource={revenue_data} 
              pagination={false}
              columns={table_columns}
            />
          </Card>
        </Col>

        {/* 3. Top khách sạn hiệu quả nhất */}
        <Col xs={24} lg={10}>
          <Card title="Top Khách sạn doanh thu cao">
            {top_hotels.map((item, index) => (
              <div key={index} style={progress_item_style}>
                <div style={flex_between_style}>
                  <Text strong>{item.name}</Text>
                  <Text type="secondary">{item.revenue}</Text>
                </div>
                <Progress 
                  percent={item.rate} 
                  status="active" 
                  strokeColor={index === 0 ? '#ff4d4f' : '#1890ff'} 
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const container_style = { padding: '24px' };
const header_style = { marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const no_margin_style = { margin: 0 };
const margin_bottom_style = { marginBottom: '24px' };
const card_shadow_style = { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' };
const full_height_style = { height: '100%' };
const progress_item_style = { marginBottom: '20px' };
const flex_between_style = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' };

export default AdminReports;