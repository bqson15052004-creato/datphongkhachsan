import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, Spin, message } from 'antd';
import { ShopOutlined, CheckCircleOutlined, SyncOutlined, LoadingOutlined } from '@ant-design/icons';
import axiosClient from '../../services/axiosClient';

const { Title } = Typography;

const PartnerDashboard = () => {
  const [is_loading, set_is_loading] = useState(true);
  const [dashboard_data, set_dashboard_data] = useState({
    total_rooms: 0,
    pending_orders: 0,
    completed_orders: 0,
    recent_bookings: []
  });

  // 1. Fetch dữ liệu tổng hợp từ Node.js
  const fetch_dashboard_data = async () => {
    try {
      set_is_loading(true);
      const response = await axios_client.get('/partners/dashboard-stats');
      
      set_dashboard_data(response.data.data); 
    } catch (error) {
      const error_msg = error.response?.data?.message || "Không thể tải dữ liệu thống kê";
      message.error(error_msg);
    } finally {
      set_is_loading(false);
    }
  };

  useEffect(() => {
    fetch_dashboard_data();
  }, []);

  // Cấu hình các thẻ thống kê
  const stats_config = [
    { 
      title: 'Tổng số phòng', 
      value: dashboard_data.total_rooms, 
      icon: <ShopOutlined />, 
      color: '#1890ff' 
    },
    { 
      title: 'Đơn chờ duyệt', 
      value: dashboard_data.pending_orders, 
      icon: <SyncOutlined spin={dashboard_data.pending_orders > 0} />, 
      color: '#faad14' 
    },
    { 
      title: 'Đã hoàn tất', 
      value: dashboard_data.completed_orders, 
      icon: <CheckCircleOutlined />, 
      color: '#52c41a' 
    },
  ];

  const columns = [
    { 
      title: 'Mã đơn', 
      dataIndex: '_id',
      key: '_id',
      render: (id) => <span style={{ fontWeight: 'bold' }}>#{id.slice(-6).toUpperCase()}</span> 
    },
    { 
      title: 'Khách hàng', 
      dataIndex: 'customer_name', 
      key: 'customer_name' 
    },
    { 
      title: 'Ngày đặt', 
      dataIndex: 'created_at',
      key: 'created_at', 
      render: (date) => new Date(date).toLocaleDateString('vi-VN') 
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => {
        const status_map = {
          'Pending': { color: 'gold', text: 'Chờ duyệt' },
          'Confirmed': { color: 'green', text: 'Đã xác nhận' },
          'Cancelled': { color: 'red', text: 'Đã hủy' }
        };
        const current = status_map[status] || { color: 'default', text: status };
        return <Tag color={current.color}>{current.text}</Tag>;
      }
    },
  ];

  if (is_loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div style={container_style}>
      <Title level={3} style={{ marginBottom: 24 }}>Bảng điều khiển đối tác</Title>
      
      {/* Thống kê nhanh */}
      <Row gutter={[16, 16]}>
        {stats_config.map((item, index) => (
          <Col xs={24} sm={8} key={index}>
            <Card bordered={false} hoverable style={{ borderRadius: 12 }}>
              <Statistic
                title={item.title}
                value={item.value}
                valueStyle={{ color: item.color, fontWeight: 'bold' }}
                prefix={item.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Danh sách đơn đặt phòng mới nhất */}
      <Card 
        title="Đơn đặt phòng gần đây" 
        style={{ marginTop: 24, borderRadius: 12 }} 
        bordered={false}
        extra={<a href="/partner/bookings">Xem tất cả</a>}
      >
        <Table 
          columns={columns} 
          dataSource={dashboard_data.recent_bookings} 
          rowKey="_id" 
          pagination={false} 
        />
      </Card>
    </div>
  );
};

// Hệ thống Style Constants
const container_style = { padding: '24px', background: '#f5f7fa', minHeight: '100vh' };

export default PartnerDashboard;