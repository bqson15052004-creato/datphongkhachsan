import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, Spin, Space, Select } from 'antd';
// import { Column } from '@ant-design/plots';
import { 
  LineChartOutlined, 
  BarChartOutlined,
  DollarCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const PartnerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [processedData, setProcessedData] = useState({
    stats: { totalRevenue: 0 },
    monthly: [],
    chartData: []
  });

  useEffect(() => {
    // Mock dữ liệu khách sạn của đối tác
    const mockHotels = [
      { id: 101, name: 'Vinpearl Luxury Nha Trang' },
      { id: 102, name: 'Vinpearl Resort & Spa Phú Quốc' },
    ];
    setHotels(mockHotels);
    setSelectedHotel(mockHotels[0].id);
  }, []);

  useEffect(() => {
    if (!selectedHotel) return;
    setLoading(true);

    const rawData = [
      { m: '01/2024', rev: 80000000 }, { m: '02/2024', rev: 95000000 }, { m: '03/2024', rev: 88000000 },
      { m: '04/2024', rev: 110000000 }, { m: '05/2024', rev: 130000000 }, { m: '06/2024', rev: 125000000 },
      { m: '07/2024', rev: 160000000 }, { m: '08/2024', rev: 155000000 }, { m: '09/2024', rev: 120000000 },
      { m: '10/2024', rev: 100000000 }, { m: '11/2024', rev: 90000000 }, { m: '12/2024', rev: 140000000 },
      { m: '01/2025', rev: 120000000 }, { m: '02/2025', rev: 150000000 }, { m: '03/2025', rev: 130000000 },
      { m: '04/2025', rev: 180000000 }, { m: '05/2025', rev: 210000000 }, { m: '06/2025', rev: 195000000 },
      { m: '07/2025', rev: 250000000 }, { m: '08/2025', rev: 240000000 }, { m: '09/2025', rev: 200000000 },
      { m: '10/2025', rev: 170000000 }, { m: '11/2025', rev: 160000000 }, { m: '12/2025', rev: 220000000 },
      { m: '01/2026', rev: 190000000 }, { m: '02/2026', rev: 230000000 }, { m: '03/2026', rev: 210000000 }, { m: '04/2026', rev: 260000000 }
    ];

    setTimeout(() => {
      // Xử lý dữ liệu bảng tháng (có tính % tăng trưởng so với tháng trước)
      const monthly = rawData.map((d, i) => ({
        key: d.m, 
        period: d.m, 
        revenue: d.rev,
        growth: i === 0 ? 0 : parseFloat(((d.rev - rawData[i-1].rev) / rawData[i-1].rev * 100).toFixed(1))
      })).reverse();

      // Dữ liệu biểu đồ (Lấy 12 tháng gần nhất để hiển thị xu hướng)
      const chartData = rawData.slice(-12).map(d => ({ month: d.m, revenue: d.rev }));

      setProcessedData({
        stats: { totalRevenue: rawData.reduce((s, i) => s + i.rev, 0) },
        monthly, 
        chartData
      });
      setLoading(false);
    }, 500);
  }, [selectedHotel]);

  const config = {
    data: processedData.chartData,
    xField: 'month',
    yField: 'revenue',
    label: { 
      position: 'top', 
      style: { fill: '#aaa', opacity: 0.6 }, 
      formatter: (v) => `${(v.revenue / 1000000).toFixed(0)}M` 
    },
    columnStyle: { radius: [4, 4, 0, 0] },
    color: '#1890ff',
  };

  const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);
  
  const columns = [
    { title: 'Tháng', dataIndex: 'period', key: 'period', render: (t) => <Text strong>{t}</Text> },
    { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', align: 'right', render: (v) => <Text strong>{formatCurrency(v)}</Text> },
    { title: 'Tăng trưởng', dataIndex: 'growth', key: 'growth', align: 'center', 
      render: (g) => <Tag color={g >= 0 ? 'green' : 'red'}>{g >= 0 ? '+' : ''}{g}%</Tag> 
    },
  ];

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Space orientation="vertical" size={0}>
            <Title level={2} style={{ margin: 0 }}>Báo cáo doanh thu</Title>
            <Text type="secondary">Phân tích chi tiết theo từng tháng kinh doanh</Text>
          </Space>
          <Select style={{ width: 280 }} value={selectedHotel} onChange={setSelectedHotel}>
            {hotels.map(h => <Option key={h.id} value={h.id}>{h.name}</Option>)}
          </Select>
        </div>

        <Spin spinning={loading}>
          <Row gutter={[24, 24]}>
            {/* Thẻ Tổng Doanh Thu */}
            <Col span={24}>
              <Card variant={false} style={{ borderRadius: 12, background: '#001529' }}>
                <Statistic 
                  title={<span style={{color: 'rgba(255,255,255,0.7)'}}>Tổng doanh thu lũy kế</span>} 
                  value={processedData.stats.totalRevenue} 
                  formatter={formatCurrency} 
                  valueStyle={{color: '#fff', fontSize: 32}} 
                  prefix={<DollarCircleOutlined />}
                />
              </Card>
            </Col>

            {/* Biểu đồ xu hướng */}
            <Col span={24}>
              <Card title={<Space><BarChartOutlined />Biểu đồ xu hướng 12 tháng gần nhất</Space>} variant={false} style={{ borderRadius: 12 }}>
                <div style={{ height: 350 }}></div>
              </Card>
            </Col>

            {/* Bảng chi tiết tháng */}
            <Col span={24}>
              <Card title={<Space><LineChartOutlined />Chi tiết doanh thu theo tháng</Space>} variant={false} style={{ borderRadius: 12 }}>
                <Table 
                  columns={columns} 
                  dataSource={processedData.monthly} 
                  pagination={{ pageSize: 12 }}
                  bordered
                />
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  );
};

export default PartnerDashboard;