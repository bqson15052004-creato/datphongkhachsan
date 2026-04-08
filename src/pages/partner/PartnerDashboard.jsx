import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, Spin, Space, Select } from 'antd';
import { Column } from '@ant-design/plots';
import { 
  ShopOutlined, SyncOutlined, DollarCircleOutlined, 
  HistoryOutlined, HomeOutlined, 
  LineChartOutlined, CalendarOutlined,
  BarChartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const PartnerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [processedData, setProcessedData] = useState({
    stats: { totalRooms: 0, pendingBookings: 0, totalRevenue: 0 },
    monthly: [],
    quarterly: [],
    yearly: [],
    chartData: []
  });

  useEffect(() => {
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
      // 2024 (12 tháng)
      { m: '01/2024', rev: 80000000 }, { m: '02/2024', rev: 95000000 }, { m: '03/2024', rev: 88000000 },
      { m: '04/2024', rev: 110000000 }, { m: '05/2024', rev: 130000000 }, { m: '06/2024', rev: 125000000 },
      { m: '07/2024', rev: 160000000 }, { m: '08/2024', rev: 155000000 }, { m: '09/2024', rev: 120000000 },
      { m: '10/2024', rev: 100000000 }, { m: '11/2024', rev: 90000000 }, { m: '12/2024', rev: 140000000 },
      // 2025 (12 tháng)
      { m: '01/2025', rev: 120000000 }, { m: '02/2025', rev: 150000000 }, { m: '03/2025', rev: 130000000 },
      { m: '04/2025', rev: 180000000 }, { m: '05/2025', rev: 210000000 }, { m: '06/2025', rev: 195000000 },
      { m: '07/2025', rev: 250000000 }, { m: '08/2025', rev: 240000000 }, { m: '09/2025', rev: 200000000 },
      { m: '10/2025', rev: 170000000 }, { m: '11/2025', rev: 160000000 }, { m: '12/2025', rev: 220000000 },
      // 2026 (đến tháng 4)
      { m: '01/2026', rev: 190000000 }, { m: '02/2026', rev: 230000000 }, { m: '03/2026', rev: 210000000 }, { m: '04/2026', rev: 260000000 }
    ];

    setTimeout(() => {
      // Bảng tháng
      const monthly = rawData.map((d, i) => ({
        key: d.m, period: d.m, revenue: d.rev,
        growth: i === 0 ? 0 : parseFloat(((d.rev - rawData[i-1].rev) / rawData[i-1].rev * 100).toFixed(1))
      })).reverse();

      // Biểu đồ (12 tháng gần nhất)
      const chartData = rawData.slice(-12).map(d => ({ month: d.m, revenue: d.rev }));

      // Quý (Gom 3 tháng 1)
      const quarterly = [];
      for (let i = 0; i < rawData.length; i += 3) {
        const chunk = rawData.slice(i, i + 3);
        const qRev = chunk.reduce((s, c) => s + c.rev, 0);
        const [m, y] = chunk[0].m.split('/');
        const qNum = Math.floor((parseInt(m) - 1) / 3) + 1;
        quarterly.push({ key: `Q${qNum}-${y}`, period: `Quý ${qNum}/${y}`, revenue: qRev });
      }
      const quarterlyWithGrowth = quarterly.map((q, i) => ({
        ...q, growth: i === 0 ? 0 : parseFloat(((q.revenue - quarterly[i-1].revenue) / quarterly[i-1].revenue * 100).toFixed(1))
      })).reverse();

      // Năm
      const yearlyMap = rawData.reduce((acc, d) => {
        const y = d.m.split('/')[1]; acc[y] = (acc[y] || 0) + d.rev; return acc;
      }, {});
      const yearly = Object.keys(yearlyMap).map((y, i, arr) => ({
        key: y, period: `Năm ${y}`, revenue: yearlyMap[y],
        growth: i === 0 ? 0 : parseFloat(((yearlyMap[y] - yearlyMap[arr[i-1]]) / yearlyMap[arr[i-1]] * 100).toFixed(1))
      })).reverse();

      setProcessedData({
        stats: { totalRooms: 45, pendingBookings: 12, totalRevenue: rawData.reduce((s,i)=>s+i.rev, 0) },
        monthly, quarterly: quarterlyWithGrowth, yearly, chartData
      });
      setLoading(false);
    }, 800);
  }, [selectedHotel]);

  const config = {
    data: processedData.chartData,
    xField: 'month',
    yField: 'revenue',
    label: { position: 'top', style: { fill: '#aaa', opacity: 0.6 }, formatter: (v) => `${(v.revenue / 1000000).toFixed(0)}M` },
    columnStyle: { radius: [4, 4, 0, 0] },
    color: '#1890ff',
  };

  const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);
  
  const columns = (title) => [
    { title: title, dataIndex: 'period', key: 'period', render: (t) => <Text strong>{t}</Text> },
    { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', align: 'right', render: (v) => <Text strong>{formatCurrency(v)}</Text> },
    { title: 'Tăng trưởng', dataIndex: 'growth', key: 'growth', align: 'center', 
      render: (g) => <Tag color={g >= 0 ? 'green' : 'red'}>{g >= 0 ? '+' : ''}{g}%</Tag> 
    },
  ];

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Space direction="vertical">
            <Title level={2} style={{ margin: 0 }}>Báo cáo doanh thu kinh doanh</Title>
            <Text type="secondary">Phân tích dòng tiền từ 01/2024</Text>
          </Space>
          <Select style={{ width: 280 }} value={selectedHotel} onChange={setSelectedHotel}>
            {hotels.map(h => <Option key={h.id} value={h.id}>{h.name}</Option>)}
          </Select>
        </div>

        <Spin spinning={loading}>
          <Row gutter={[24, 24]}>
            {/* Cột trái: Biểu đồ và Bảng Tháng */}
            <Col xs={24} lg={16}>
              <Space direction="vertical" size={24} style={{ width: '100%' }}>
                <Card title={<Space><BarChartOutlined />Xu hướng 12 tháng gần đây</Space>} variant={false} style={{ borderRadius: 12 }}>
                  <div style={{ height: 280 }}><Column {...config} /></div>
                </Card>

                <Card title={<Space><LineChartOutlined />Chi tiết doanh thu tháng</Space>} variant={false} style={{ borderRadius: 12 }}>
                  <Table 
                    columns={columns('Tháng')} 
                    dataSource={processedData.monthly} 
                    pagination={{ pageSize: 6, size: 'small' }} // Mỗi trang 6 tháng cho gọn
                    size="middle"
                  />
                </Card>
              </Space>
            </Col>

            {/* Cột phải: Tổng quan, Quý và Năm */}
            <Col xs={24} lg={8}>
              <Space direction="vertical" size={24} style={{ width: '100%' }}>
                <Card variant={false} style={{borderRadius: 12, background: '#001529', color: '#fff'}}>
                  <Statistic 
                    title={<span style={{color: 'rgba(255,255,255,0.7)'}}>Doanh thu lũy kế</span>} 
                    value={processedData.stats.totalRevenue} 
                    formatter={formatCurrency} 
                    valueStyle={{color: '#fff', fontSize: 28}} 
                  />
                </Card>

                <Card title={<Space><CalendarOutlined />Báo cáo Quý</Space>} variant={false} size="small" style={{ borderRadius: 12 }}>
                  <Table 
                    columns={columns('Quý')} 
                    dataSource={processedData.quarterly} 
                    pagination={{ pageSize: 4, size: 'small', showSizeChanger: false }} // PHÂN TRANG Ở ĐÂY
                    size="small"
                  />
                </Card>

                <Card title={<Space><HistoryOutlined />Báo cáo Năm</Space>} variant={false} size="small" style={{ borderRadius: 12 }}>
                  <Table 
                    columns={columns('Năm')} 
                    dataSource={processedData.yearly} 
                    pagination={false} 
                    size="small"
                  />
                </Card>
              </Space>
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  );
};

export default PartnerDashboard;