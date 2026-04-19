import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Space, DatePicker, Tag, Progress, Tooltip } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarCircleOutlined,
  ShoppingOutlined,
  UserOutlined,
  HomeOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AdminReports = () => {
  // 1. Helper định dạng tiền tệ (Dùng nhiều nên tách ra cho sạch)
  const format_currency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // 2. Dữ liệu doanh thu (Đồng bộ snake_case với BE)
  const [revenue_data] = useState([
    { key: '1', month_label: 'Tháng 1', total_revenue: 150000000, booking_count: 45, trend_status: 'up' },
    { key: '2', month_label: 'Tháng 2', total_revenue: 120000000, booking_count: 38, trend_status: 'down' },
    { key: '3', month_label: 'Tháng 3', total_revenue: 210000000, booking_count: 62, trend_status: 'up' },
  ]);

  const [top_hotels] = useState([
    { hotel_name: 'Vinpearl Luxury Nha Trang', total_sales: 85, revenue_value: 212000000, occupancy_rate: 95 },
    { hotel_name: 'InterContinental Da Nang', total_sales: 72, revenue_value: 302000000, occupancy_rate: 88 },
    { hotel_name: 'Pullman Vũng Tàu', total_sales: 50, revenue_value: 90000000, occupancy_rate: 70 },
  ]);

  const report_summary = {
    monthly_revenue: 480000000,
    revenue_growth: 12.5,
    total_bookings: 145,
    booking_growth: 5.2,
    new_members: 28,
    member_growth: -2,
    active_partners: 12
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header báo cáo */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <Title level={3} style={{ margin: 0 }}>
          <ShoppingOutlined /> Thống kê kinh doanh hệ thống
        </Title>
        <Space>
          <Text strong>Thời gian báo cáo:</Text>
          <RangePicker placeholder={['Từ ngày', 'Đến ngày']} style={{ borderRadius: '8px' }} />
        </Space>
      </div>

      {/* 1. Hàng thẻ thống kê nhanh */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant={false} hoverable style={{ borderRadius: '12px', borderLeft: '4px solid #52c41a' }}>
            <Statistic
              title={<Space>Doanh thu tháng <Tooltip title="Tổng tiền sau khi trừ chiết khấu"><InfoCircleOutlined /></Tooltip></Space>}
              value={report_summary.monthly_revenue}
              formatter={(val) => <Text style={{ color: '#3f8600', fontSize: '24px', fontWeight: 'bold' }}>{format_currency(val)}</Text>}
            />
            <Text type="success" size="small"><ArrowUpOutlined /> {report_summary.revenue_growth}% so với kỳ trước</Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card variant={false} hoverable style={{ borderRadius: '12px', borderLeft: '4px solid #1890ff' }}>
            <Statistic
              title="Tổng đơn đặt phòng"
              value={report_summary.total_bookings}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            />
            <Text type="success"><ArrowUpOutlined /> {report_summary.booking_growth}% tăng trưởng</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant={false} hoverable style={{ borderRadius: '12px', borderLeft: '4px solid #faad14' }}>
            <Statistic
              title="Thành viên mới"
              value={report_summary.new_members}
              prefix={<UserOutlined />}
              valueStyle={{ fontWeight: 'bold' }}
            />
            <Text type={report_summary.member_growth < 0 ? "danger" : "success"}>
              {report_summary.member_growth < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />} 
              {Math.abs(report_summary.member_growth)}% người dùng mới
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant={false} hoverable style={{ borderRadius: '12px', borderLeft: '4px solid #722ed1' }}>
            <Statistic
              title="Đối tác hoạt động"
              value={report_summary.active_partners}
              prefix={<HomeOutlined />}
              valueStyle={{ fontWeight: 'bold', color: '#722ed1' }}
            />
            <Tag color="purple" style={{ marginTop: 4 }}>12 Khách sạn đang online</Tag>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 2. Bảng chi tiết doanh thu */}
        <Col xs={24} lg={15}>
          <Card 
            title="Biểu đồ tăng trưởng doanh thu" 
            variant={false} 
            style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <Table
              dataSource={revenue_data}
              pagination={false}
              size="middle"
              columns={[
                { title: 'Kỳ báo cáo', dataIndex: 'month_label', key: 'month_label', render: (text) => <Text strong>{text}</Text> },
                { 
                  title: 'Doanh thu thực tế', 
                  dataIndex: 'total_revenue', 
                  key: 'total_revenue', 
                  render: (val) => <Text type="danger" strong>{format_currency(val)}</Text> 
                },
                { title: 'Số lượng đơn', dataIndex: 'booking_count', key: 'booking_count', align: 'center' },
                {
                  title: 'Trạng thái',
                  dataIndex: 'trend_status',
                  key: 'trend_status',
                  render: (status) => (
                    <Tag icon={status === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />} color={status === 'up' ? 'green' : 'red'}>
                      {status === 'up' ? 'VƯỢT CHỈ TIÊU' : 'CẦN CẢI THIỆN'}
                    </Tag>
                  )
                }
              ]}
            />
          </Card>
        </Col>

        {/* 3. Hiệu suất khách sạn */}
        <Col xs={24} lg={9}>
          <Card 
            title="Khách sạn hiệu suất cao" 
            variant={false} 
            style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            {top_hotels.map((item, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <Text strong style={{maxWidth: '180px'}} ellipsis>{item.hotel_name}</Text>
                  <Text type="secondary" style={{fontSize: '13px'}}>{format_currency(item.revenue_value)}</Text>
                </div>
                <Tooltip title={`Tỷ lệ lấp đầy: ${item.occupancy_rate}%`}>
                  <Progress 
                    percent={item.occupancy_rate} 
                    showInfo={false}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': index === 0 ? '#52c41a' : '#1890ff',
                    }}
                    size={12}
                  />
                </Tooltip>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>Xếp hạng: Top {index + 1}</Text>
                  <Text type="secondary" style={{ fontSize: '11px' }}>{item.total_sales} đơn thành công</Text>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminReports;