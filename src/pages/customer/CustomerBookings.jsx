import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Card, Typography, Button, Space, 
  App as AntApp, Spin, Empty, Tabs, Tooltip, Rate 
} from 'antd';
import { 
  HistoryOutlined, EyeOutlined, StarOutlined, 
  ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

// Import dữ liệu mẫu từ file của ông
import { MOCK_BOOKINGS, MOCK_REVIEWS } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;

const CustomerBookings = () => {
  const { message: antdMessage } = AntApp.useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Giả lập gọi API lấy dữ liệu
    setLoading(true);
    setTimeout(() => {
      setBookings(MOCK_BOOKINGS);
      setLoading(false);
    }, 500);
  }, []);

  // Lọc dữ liệu theo Tab
  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <Text strong>#{id}</Text>
    },
    {
      title: 'Khách sạn',
      dataIndex: 'hotel_name',
      key: 'hotel_name',
      width: 200,
      render: (text) => <Text style={{ color: '#1890ff', fontWeight: 500 }}>{text}</Text>
    },
    {
      title: 'Số phòng',
      dataIndex: 'room_number',
      key: 'room_number',
      width: 100,
      align: 'center',
    },
    {
      title: 'Ngày nhận',
      dataIndex: 'check_in',
      key: 'check_in',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Ngày trả',
      dataIndex: 'check_out',
      key: 'check_out',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (price) => (
        <Text strong style={{ color: '#e11d48' }}>
          {Number(price).toLocaleString()}₫
        </Text>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const configs = {
          'Pending': { color: 'orange', text: 'Chờ duyệt' },
          'Confirmed': { color: 'green', text: 'Thành công' },
          'Cancelled': { color: 'red', text: 'Đã hủy' }
        };
        const config = configs[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (record) => (
        <Tooltip title="Xem chi tiết">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => antdMessage.info(`Xem đơn hàng ${record.id}`)} 
          />
        </Tooltip>
      )
    },
    {
      title: 'Đánh giá',
      key: 'review',
      width: 150,
      render: (record) => {
        // Kiểm tra xem đơn hàng này đã được đánh giá chưa (Dựa trên hotel_name hoặc id)
        const hasReview = MOCK_REVIEWS.find(r => r.hotelId === record.id_hotel); // Giả sử có id_hotel
        
        if (record.status !== 'Confirmed' && record.status !== 'Completed') {
          return <Text type="secondary" style={{ fontSize: 12 }}>N/A</Text>;
        }

        return (
          <Button 
            type="primary" 
            size="small" 
            ghost 
            icon={<StarOutlined />}
            onClick={() => antdMessage.success("Mở form đánh giá khách sạn này")}
          >
            Đánh giá
          </Button>
        );
      }
    }
  ];

  return (
    <Card bordered={false} style={{ borderRadius: 12 }}>
      <div style={{ marginBottom: 20 }}>
        <Title level={4}><HistoryOutlined /> Lịch sử đặt phòng của bạn</Title>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          { label: 'Tất cả', key: 'all' },
          { label: 'Chờ duyệt', key: 'Pending' },
          { label: 'Thành công', key: 'Confirmed' },
          { label: 'Đã hủy', key: 'Cancelled' },
        ]}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><Spin tip="Đang tải..." /></div>
      ) : (
        <Table
          dataSource={filteredBookings}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1000 }}
        />
      )}
    </Card>
  );
};

export default CustomerBookings;