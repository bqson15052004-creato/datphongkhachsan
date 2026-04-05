import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Card, Statistic, Table, Tag, Typography, Spin, Empty, Space, Avatar, Tooltip } from 'antd';
import { 
  ShopOutlined, 
  SyncOutlined, 
  DollarCircleOutlined,
  ArrowUpOutlined,
  UserOutlined,
  HistoryOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import axiosClient from '../../services/axiosClient';

const { Title, Text } = Typography;

const PartnerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: { totalRooms: 0, pendingBookings: 0, completedBookings: 0, totalRevenue: 0 },
    recentBookings: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        /* --- KẾT NỐI BE THẬT (Mở ra khi có API) --- */
        // const response = await axiosClient.get('/hotels/partner-dashboard/');
        // setData(response);
        // setLoading(false);

        /* --- LOGIC MOCK DATA ĐỂ HIỆN GIAO DIỆN --- */
        setTimeout(() => {
          setData({
            stats: { 
              totalRooms: 12, 
              pendingBookings: 5, 
              completedBookings: 28, 
              totalRevenue: 8500000 
            },
            recentBookings: [
              { id: 1, customer_name: 'Nguyễn Văn Sơn', created_at: new Date(), total_price: 1200000, status: 'Pending' },
              { id: 2, customer_name: 'Lê Thị Bưởi', created_at: new Date(), total_price: 2500000, status: 'Confirmed' },
              { id: 3, customer_name: 'Trần Văn Cường', created_at: new Date(), total_price: 900000, status: 'Completed' },
            ]
          });
          setLoading(false);
        }, 1000);

      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Hàm format tiền tệ
  const formatCurrency = (value) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

  const statCards = [
    { 
      title: 'Quy mô hệ thống', 
      value: data.stats.totalRooms, 
      icon: <ShopOutlined />, 
      color: '#1890ff',
      trend: '+2 phòng mới'
    },
    { 
      title: 'Đơn cần xử lý', 
      value: data.stats.pendingBookings, 
      icon: <SyncOutlined spin={data.stats.pendingBookings > 0} />, 
      color: '#faad14',
      trend: 'Cần duyệt ngay',
      trendColor: '#f5222d'
    },
    { 
      title: 'Doanh thu tháng này', 
      value: data.stats.totalRevenue, 
      icon: <DollarCircleOutlined />, 
      color: '#52c41a',
      isPrice: true,
      trend: 'Tăng 12.5%',
    },
  ];

  const columns = [
    { 
      title: 'Khách hàng', 
      key: 'customer',
      render: (record) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.customer_avatar} />
          <Text strong>{record.customer_name}</Text>
        </Space>
      )
    },
    { 
      title: 'Ngày đặt', 
      dataIndex: 'created_at', 
      key: 'created_at',
      render: (date) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 13 }}><CalendarOutlined /> {new Date(date).toLocaleDateString('vi-VN')}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{new Date(date).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</Text>
        </Space>
      )
    },
    { 
      title: 'Giá trị đơn', 
      dataIndex: 'total_price', 
      key: 'total_price',
      align: 'right',
      render: (price) => <Text strong style={{ color: '#1a3353' }}>{formatCurrency(price)}</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        const config = {
          'Pending': { color: 'gold', text: 'Đang chờ' },
          'Confirmed': { color: 'green', text: 'Đã xác nhận' },
          'Cancelled': { color: 'red', text: 'Đã hủy' },
          'Completed': { color: 'blue', text: 'Hoàn thành' }
        };
        const item = config[status] || { color: 'default', text: status };
        return <Tag bordered={false} color={item.color} style={{ borderRadius: 12, padding: '2px 12px' }}>{item.text.toUpperCase()}</Tag>;
      }
    },
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ padding: '24px 0', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0, color: '#1a3353' }}>Bảng điều khiển Đối tác</Title>
          <Text type="secondary">Cập nhật tình hình kinh doanh của bạn theo thời gian thực</Text>
        </div>
        
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
          <Row gutter={[24, 24]}>
            {statCards.map((item, index) => (
              <Col xs={24} sm={8} key={index}>
                <Card 
                  bordered={false} 
                  style={{ borderRadius: 20, boxShadow: '0 10px 20px rgba(0,0,0,0.02)' }}
                >
                  <Statistic
                    title={<Text strong type="secondary" style={{ fontSize: 14 }}>{item.title}</Text>}
                    value={item.value}
                    formatter={(val) => item.isPrice ? formatCurrency(val) : val}
                    valueStyle={{ color: item.color, fontWeight: 800, fontSize: 28 }}
                    prefix={item.icon}
                  />
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Tag color={item.trendColor || 'success'} bordered={false} style={{ fontSize: 11, borderRadius: 6 }}>
                      <ArrowUpOutlined /> {item.trend}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: 11 }}>so với kỳ trước</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Card 
            title={
              <Space>
                <HistoryOutlined style={{ color: '#1890ff' }} />
                <span style={{ fontSize: 18, fontWeight: 600 }}>Giao dịch mới nhất</span>
              </Space>
            } 
            extra={
              <Tooltip title="Tải lại">
                <Button 
                  type="text" 
                  icon={<SyncOutlined />} 
                  onClick={() => window.location.reload()} 
                />
              </Tooltip>
            }
            style={{ marginTop: 32, borderRadius: 20, boxShadow: '0 10px 20px rgba(0,0,0,0.02)' }} 
            bordered={false}
          >
            <Table 
              columns={columns} 
              dataSource={data.recentBookings} 
              pagination={{ pageSize: 5 }} 
              rowKey="id"
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Hôm nay chưa có đơn hàng nào" /> }}
            />
          </Card>
        </Spin>
      </div>
    </div>
  );
};

export default PartnerDashboard;