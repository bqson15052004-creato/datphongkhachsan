import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Card, Typography, Button, Space, 
  App as AntApp, Spin, Empty, Tabs, Tooltip, 
  Modal, Rate, Input, Badge 
} from 'antd';
import { 
  HistoryOutlined, StarOutlined, StarFilled,
  ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
  CalendarOutlined, MessageOutlined, EyeOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs'; // Cần thiết để lấy ngày tháng khi đánh giá

// Import dữ liệu mẫu
import { MOCK_BOOKINGS } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;

const CustomerBookings = () => {
  const { message: antdMessage } = AntApp.useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // --- STATE CHO MODAL ĐÁNH GIÁ ---
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [reviewingRecord, setReviewingRecord] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    setLoading(true);
    const fetchData = () => {
      const staticBookings = MOCK_BOOKINGS || [];
      const localBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      
      const normalizedLocal = localBookings.map(b => ({
        ...b,
        id: b.id_booking || b.id, 
        status: b.status || 'Pending' 
      }));

      const combinedData = [...normalizedLocal, ...staticBookings];
      setBookings(combinedData);
      setLoading(false);
    };

    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, []);

  const openReviewModal = (record) => {
    setReviewingRecord(record);
    setRating(5);
    setReviewComment('');
    setIsReviewModalVisible(true);
  };

  const handleSubmitReview = () => {
    if (!reviewingRecord) return;

    // --- LOGIC LƯU ĐÁNH GIÁ XUỐNG LOCALSTORAGE ---
    const newReview = {
      id: Date.now(),
      hotelId: reviewingRecord.id_hotel || 1, // ID để HotelDetail filter
      user: "Khách hàng", 
      avatar: "",
      rate: rating,
      date: dayjs().format('DD/MM/YYYY'),
      comment: reviewComment
    };

    // Lưu vào "kho chung" mock_reviews
    const existingReviews = JSON.parse(localStorage.getItem('mock_reviews') || '[]');
    localStorage.setItem('mock_reviews', JSON.stringify([...existingReviews, newReview]));

    // Cập nhật UI tại bảng
    setBookings(prev => prev.map(b => {
      if (b.id === reviewingRecord.id) {
        return { ...b, is_reviewed: true, rating: rating, review_comment: reviewComment };
      }
      return b;
    }));

    antdMessage.success(`Cảm ơn bạn đã đánh giá ${rating} sao!`);
    setIsReviewModalVisible(false);
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'all') return true;
    const s = (b.status || '').toLowerCase();
    if (activeTab === 'pending') return s === 'pending' || s === 'chờ duyệt';
    if (activeTab === 'confirmed') return s === 'confirmed' || s === 'thành công';
    if (activeTab === 'cancelled') return s === 'cancelled' || s === 'đã hủy';
    return s === activeTab.toLowerCase();
  });

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <Text code>#{id}</Text>
    },
    {
      title: 'Khách sạn',
      dataIndex: 'hotel_name',
      key: 'hotel_name',
      width: 200,
      ellipsis: true,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#1890ff' }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.hotel_address || 'Địa chỉ đang cập nhật'}</Text>
        </Space>
      )
    },
    { 
      title: 'Ngày nhận', 
      dataIndex: 'check_in',
      key: 'check_in',
      width: 120,
      render: (date) => (
        <Space direction="vertical" size={0}>
          <Text style={{fontSize: '12px'}}><CalendarOutlined style={{color: '#52c41a'}} /> {date}</Text>
          <Text type="secondary" style={{fontSize: '10px'}}>Check-in</Text>
        </Space>
      )
    },
    { 
      title: 'Ngày trả', 
      dataIndex: 'check_out',
      key: 'check_out',
      width: 120,
      render: (date) => (
        <Space direction="vertical" size={0}>
          <Text style={{fontSize: '12px'}}><CalendarOutlined style={{color: '#ff4d4f'}} /> {date}</Text>
          <Text type="secondary" style={{fontSize: '10px'}}>Check-out</Text>
        </Space>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_price',
      key: 'total_price',
      width: 130,
      align: 'right',
      render: (price) => (
        <Text strong style={{ color: '#e11d48', fontSize: 14 }}>
          {Number(price).toLocaleString()}₫
        </Text>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      align: 'center',
      render: (status) => {
        const s = (status || 'Pending').toLowerCase();
        const configs = {
          'pending': { color: 'orange', text: 'Chờ duyệt', icon: <ClockCircleOutlined /> },
          'chờ duyệt': { color: 'orange', text: 'Chờ duyệt', icon: <ClockCircleOutlined /> },
          'confirmed': { color: 'green', text: 'Thành công', icon: <CheckCircleOutlined /> },
          'thành công': { color: 'green', text: 'Thành công', icon: <CheckCircleOutlined /> },
          'cancelled': { color: 'red', text: 'Đã hủy', icon: <CloseCircleOutlined /> },
          'đã hủy': { color: 'red', text: 'Đã hủy', icon: <CloseCircleOutlined /> },
          'completed': { color: 'blue', text: 'Hoàn thành', icon: <CheckCircleOutlined /> }
        };
        const config = configs[s] || { color: 'default', text: status, icon: null };
        return (
          <Tag icon={config.icon} color={config.color} style={{ borderRadius: 12, padding: '0 10px' }}>
            {config.text.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Đánh giá',
      key: 'review',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const s = (record.status || '').toLowerCase();
        const canReview = s === 'confirmed' || s === 'thành công' || s === 'completed';
        if (!canReview) return <Text type="secondary">—</Text>;
        if (record.is_reviewed || record.rating) {
          return (
            <Tooltip title={record.review_comment || "Bạn đã đánh giá đơn này"}>
              <Tag color="gold" style={{ margin: 0, cursor: 'help' }}>
                {record.rating || 5} <StarFilled style={{ color: '#faad14' }} />
              </Tag>
            </Tooltip>
          );
        }
        return (
          <Button 
            type="primary" size="small" ghost 
            icon={<StarOutlined />}
            onClick={() => openReviewModal(record)}
            style={{ fontSize: '11px', borderRadius: '4px' }}
          >
            Đánh giá
          </Button>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 80,
      align: 'center',
      render: () => (
        <Tooltip title="Xem chi tiết">
          <EyeOutlined style={{ color: '#1890ff', cursor: 'pointer', fontSize: '18px' }} />
        </Tooltip>
      )
    }
  ];

  return (
    <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          <HistoryOutlined style={{ marginRight: 12, color: '#1890ff' }} />
          Lịch sử đặt phòng
        </Title>
        <Badge count={bookings.length} color="#1890ff" showZero>
          <Button type="text">Tất cả đơn hàng</Button>
        </Badge>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          { label: 'Tất cả đơn', key: 'all' },
          { label: 'Đang chờ', key: 'pending' },
          { label: 'Thành công', key: 'confirmed' },
          { label: 'Đã hủy', key: 'cancelled' },
        ]}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" /></div>
      ) : (
        <Table
          dataSource={filteredBookings}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 6, placement: 'bottomCenter' }}
          scroll={{ x: 1000 }}
          locale={{ emptyText: <Empty description="Không tìm thấy đơn hàng nào." /> }}
        />
      )}

      <Modal
        title={<Space><MessageOutlined style={{color: '#faad14'}} /> Đánh giá trải nghiệm</Space>}
        open={isReviewModalVisible}
        onOk={handleSubmitReview}
        onCancel={() => setIsReviewModalVisible(false)}
        okText="Gửi đánh giá"
        cancelText="Để sau"
        centered
        destroyOnClose
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <Text strong style={{ fontSize: 16 }}>{reviewingRecord?.hotel_name}</Text>
          <div style={{ margin: '15px 0' }}>
            <Rate value={rating} onChange={setRating} style={{ fontSize: 35 }} />
          </div>
          <Input.TextArea
            rows={4}
            placeholder="Chia sẻ cảm nhận của bạn..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            style={{ borderRadius: 8 }}
          />
        </div>
      </Modal>
    </Card>
  );
};

export default CustomerBookings;