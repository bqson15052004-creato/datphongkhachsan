import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Space, DatePicker, Tag, Progress, Tooltip } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingOutlined,
  UserOutlined,
  HomeOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { REVENUE_MOCK, TOP_HOTELS_MOCK, REPORT_SUMMARY_MOCK } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;

const AdminReports = () => {
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [revenue_data, setRevenueData] = useState([]);
  const [top_hotels, setTopHotels] = useState([]);
  const [report_summary, setReportSummary] = useState(null);

  useEffect(() => {
    // 1. Lấy dữ liệu gốc
    const now = dayjs();
    const currentYear = now.year();
    const currentMonth = now.month() + 1;

    const saved_revenue = localStorage.getItem('REVENUE_DATA');
    const saved_top_hotels = localStorage.getItem('TOP_HOTELS');
    const saved_summary = localStorage.getItem('REPORT_SUMMARY');

    let baseRevenue = saved_revenue ? JSON.parse(saved_revenue) : REVENUE_MOCK;
    let baseTopHotels = saved_top_hotels ? JSON.parse(saved_top_hotels) : TOP_HOTELS_MOCK;
    let baseSummary = saved_summary ? JSON.parse(saved_summary) : REPORT_SUMMARY_MOCK;

    if (!saved_revenue) {
      localStorage.setItem('REVENUE_DATA', JSON.stringify(REVENUE_MOCK));
      localStorage.setItem('TOP_HOTELS', JSON.stringify(TOP_HOTELS_MOCK));
      localStorage.setItem('REPORT_SUMMARY', JSON.stringify(REPORT_SUMMARY_MOCK));
    }

    // 2. LOGIC TẠO DỮ LIỆU THEO NĂM
    const isCurrentYear = selectedYear === currentYear;
    // Tạo factor để biến đổi dữ liệu giữa các năm cho sinh động
    const factor = isCurrentYear ? 1 : 0.6 + (Math.random() * 0.5);

    // Bước A: Tính toán doanh thu và số lượng đơn đã scale theo factor
    const calculatedMonths = Array.from({ length: 12 }).map((_, index) => {
      const month = index + 1;
      if (isCurrentYear && month > currentMonth) return null;

      const existingMonthData = baseRevenue[index];
      const revenue = existingMonthData 
        ? existingMonthData.total_revenue * factor 
        : (baseRevenue[0]?.total_revenue || 50000000) * (0.7 + Math.random() * 0.6) * factor;

      const bookings = existingMonthData 
        ? Math.floor(existingMonthData.booking_count * factor)
        : Math.floor((baseRevenue[0]?.booking_count || 20) * (0.7 + Math.random() * 0.6) * factor);

      return {
        key: `month-${month}-${selectedYear}`,
        month_label: `Tháng ${month}/${selectedYear}`,
        total_revenue: revenue,
        booking_count: bookings,
      };
    }).filter(Boolean);

    // Bước B: Gắn trend_status bằng cách so sánh tháng hiện tại với tháng trước đó trong mảng đã tính
    const finalRevenueData = calculatedMonths.map((item, index) => {
      const prevRevenue = index > 0 ? calculatedMonths[index - 1].total_revenue : item.total_revenue;
      return {
        ...item,
        trend_status: item.total_revenue >= prevRevenue ? 'up' : 'down'
      };
    });

    // 3. Cập nhật các danh sách khác
    const filteredTopHotels = baseTopHotels.map(item => ({
      ...item,
      revenue_value: item.revenue_value * factor,
      total_sales: Math.floor(item.total_sales * factor)
    })).sort((a, b) => b.revenue_value - a.revenue_value);

    setRevenueData(finalRevenueData);
    setTopHotels(filteredTopHotels);
    setReportSummary(baseSummary);

  }, [selectedYear]);

  const format_currency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(value);
  };

  if (!report_summary) return null;

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <Title level={3} style={{ margin: 0 }}>
          <ShoppingOutlined /> Thống kê kinh doanh hệ thống
        </Title>
        <Space>
          <Text strong>Thời gian báo cáo (Năm):</Text>
          <DatePicker 
            picker="year" 
            placeholder="Chọn năm" 
            style={{ borderRadius: '8px', width: '150px' }}
            defaultValue={dayjs()} 
            disabledDate={(current) => current && current.year() > dayjs().year()}
            onChange={(date) => date && setSelectedYear(date.year())}
          />
        </Space>
      </div>

      {/* Cards Thống kê nhanh */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant={false} hoverable style={{ borderRadius: '12px', borderLeft: '4px solid #52c41a' }}>
            <Statistic
              title={<Space>Doanh thu tháng <Tooltip title="Tổng tiền sau khi trừ chiết khấu"><InfoCircleOutlined /></Tooltip></Space>}
              value={report_summary.monthly_revenue}
              formatter={(val) => <Text style={{ color: '#3f8600', fontSize: '24px', fontWeight: 'bold' }}>{format_currency(val)}</Text>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant={false} hoverable style={{ borderRadius: '12px', borderLeft: '4px solid #1890ff' }}>
            <Statistic
              title="Tổng đơn đặt phòng"
              value={report_summary.total_bookings}
              prefix={<ShoppingOutlined />}
              styles={{ content: { color: '#1890ff', fontWeight: 'bold' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant={false} hoverable style={{ borderRadius: '12px', borderLeft: '4px solid #faad14' }}>
            <Statistic
              title="Thành viên mới"
              value={report_summary.new_members}
              prefix={<UserOutlined />}
              styles={{ content: { fontWeight: 'bold' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant={false} hoverable style={{ borderRadius: '12px', borderLeft: '4px solid #722ed1' }}>
            <Statistic
              title="Đối tác hoạt động"
              value={report_summary.active_partners}
              prefix={<HomeOutlined />}
              styles={{ content: { color: '#722ed1', fontWeight: 'bold' } }}
            />
            <Tag color="purple" style={{ marginTop: 4 }}>{report_summary.active_partners} Khách sạn mới</Tag>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Bảng Doanh thu */}
        <Col xs={24} lg={15}>
          <Card title="Biểu đồ tăng trưởng doanh thu" variant={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Table
              dataSource={revenue_data}
              rowKey="key"
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
                  title: 'Đánh giá',
                  dataIndex: 'trend_status',
                  key: 'trend_status',
                  render: (status) => (
                    <Tag icon={status === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />} color={status === 'up' ? 'green' : 'red'}>
                      {status === 'up' ? 'TĂNG' : 'GIẢM '}
                    </Tag>
                  )
                }
              ]}
            />
          </Card>
        </Col>

        {/* Khách sạn doanh thu cao nhất */}
        <Col xs={24} lg={9}>
          <Card title="Khách sạn doanh thu cao nhất theo từng năm" variant={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
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
                    strokeColor={index === 0 ? '#52c41a' : '#1890ff'}
                    size={12}
                  />
                </Tooltip>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>Top {index + 1}</Text>
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