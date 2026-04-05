import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Card, Typography, Button, Space, 
  App as AntApp, Spin, Empty, Tabs, Avatar, Tooltip 
} from 'antd';
import { 
  EyeOutlined, HistoryOutlined, CarOutlined, 
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined 
} from '@ant-design/icons';
import axiosClient from '../../services/axiosClient';
import Navbar from '../../components/common/Navbar';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const CustomerBookings = () => {
  const { message: antdMessage } = AntApp.useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get('/hotels/bookings/');
        // Giả sử response trả về là mảng, nếu bọc trong data thì dùng response.data
        setBookings(Array.isArray(response) ? response : response.data || []);
      } catch (error) {
        antdMessage?.error("Không thể tải lịch sử chuyến đi.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Lọc dữ liệu theo Tab
  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  const columns = [
    {
      title: 'Thông tin chuyến đi',
      key: 'hotel_info',
      fixed: 'left',
      render: (record) => (
        <Space size="middle">
          <Avatar 
            shape="square" 
            size={50} 
            src={record.hotel_image || "https://via.placeholder.com/100"} 
            icon={<CarOutlined />}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong style={{ fontSize: 15 }}>{record.hotel_name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Phòng {record.room_number} • {record.room_type_name || 'Standard'}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Lịch trình',
      key: 'date',
      render: (record) => (
        <div style={{ lineHeight: '1.5' }}>
          <Tag icon={<ClockCircleOutlined />} color="default">
            {dayjs(record.check_in).format('DD/MM/YYYY')}
          </Tag>
          <div style={{ paddingLeft: 22, color: '#bfbfbf', fontSize: 11 }}>đến</div>
          <Tag icon={<CheckCircleOutlined />} color="default">
            {dayjs(record.check_out).format('DD/MM/YYYY')}
          </Tag>
        </div>
      )
    },
    {
      title: 'Thanh toán',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (price) => (
        <Text strong style={{ color: '#ff4d4f', fontSize: 15 }}>
          {parseFloat(price).toLocaleString()}₫
        </Text>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          'Pending': { color: 'orange', text: 'Chờ xác nhận', icon: <ClockCircleOutlined /> },
          'Confirmed': { color: 'green', text: 'Đã xác nhận', icon: <CheckCircleOutlined /> },
          'Cancelled': { color: 'red', text: 'Đã hủy', icon: <CloseCircleOutlined /> },
          'Completed': { color: 'blue', text: 'Hoàn thành', icon: <CheckCircleOutlined /> },
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return (
          <Tag color={config.color} icon={config.icon} style={{ borderRadius: 10, padding: '2px 10px' }}>
            {config.text.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (record) => (
        <Tooltip title="Xem chi tiết đơn hàng">
          <Button 
            type="primary"
            ghost
            icon={<EyeOutlined />} 
            onClick={() => antdMessage?.info(`Đang mở hóa đơn #${record.id}`)}
          />
        </Tooltip>
      )
    }
  ];

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '30px 5%', maxWidth: 1300, margin: '0 auto' }}>
        
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#1890ff', padding: 10, borderRadius: 12 }}>
            <HistoryOutlined style={{ color: '#fff', fontSize: 24 }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0 }}>Chuyến đi của tôi</Title>
            <Text type="secondary">Quản lý lịch sử đặt phòng và hành trình của bạn</Text>
          </div>
        </div>

        <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              { label: 'Tất cả', key: 'all' },
              { label: 'Chờ xác nhận', key: 'Pending' },
              { label: 'Đã xác nhận', key: 'Confirmed' },
              { label: 'Hoàn thành', key: 'Completed' },
              { label: 'Đã hủy', key: 'Cancelled' },
            ]}
            style={{ marginBottom: 16 }}
          />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
          ) : (
            <Table
              dataSource={filteredBookings}
              columns={columns}
              rowKey="id"
              pagination={{ 
                pageSize: 6, 
                showTotal: (total) => `Tổng cộng ${total} đơn hàng`,
                style: { marginTop: 20 }
              }}
              locale={{ 
                emptyText: (
                  <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description="Không tìm thấy lịch sử chuyến đi nào." 
                  />
                ) 
              }}
              scroll={{ x: 800 }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default CustomerBookings;