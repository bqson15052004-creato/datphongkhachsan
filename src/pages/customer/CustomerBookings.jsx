import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Card, Typography, Button, Space, 
  App as AntApp, Spin, Empty, Tabs, Tooltip, 
  Modal, Rate, Input, Badge, Descriptions 
} from 'antd';
import { 
  HistoryOutlined, StarOutlined, StarFilled,
  ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
  CalendarOutlined, MessageOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

// Import dữ liệu mẫu
import { MOCK_BOOKINGS } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;

const CustomerBookings = () => {
  const { message: antdMessage } = AntApp.useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // --- STATE CHO MODAL ĐÁNH GIÁ (GỬI MỚI) ---
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [reviewingRecord, setReviewingRecord] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // --- STATE CHO MODAL XEM CHI TIẾT (ĐÃ ĐÁNH GIÁ) ---
  const [isReviewDetailOpen, setIsReviewDetailOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

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
      
      // --- CHỈ THÊM ĐÚNG ĐOẠN SẮP XẾP NÀY ---
      combinedData.sort((a, b) => Number(b.id) - Number(a.id));
      // -------------------------------------

      setBookings(combinedData);
      setLoading(false);
    };

    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, []);

  // Hàm mở Modal gửi đánh giá mới
  const openReviewModal = (record) => {
    setReviewingRecord(record);
    setRating(5);
    setReviewComment('');
    setIsReviewModalVisible(true);
  };

  // HÀM MỚI: Mở Modal xem chi tiết đánh giá cũ
  const openReviewDetail = (record) => {
    setSelectedReview(record);
    setIsReviewDetailOpen(true);
  };

  const handleSubmitReview = () => {
    if (!reviewingRecord) return;

    const newReview = {
      id: Date.now(),
      hotelId: reviewingRecord.id_hotel || 1,
      user: "Khách hàng", 
      avatar: "",
      rate: rating,
      date: dayjs().format('DD/MM/YYYY'),
      comment: reviewComment
    };

    const existingReviews = JSON.parse(localStorage.getItem('mock_reviews') || '[]');
    localStorage.setItem('mock_reviews', JSON.stringify([...existingReviews, newReview]));

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
          const ratingCount = record.rating || 5;
          return (
            <Space direction="vertical" size={2} align="center">
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: ratingCount }).map((_, index) => (
                  <StarFilled key={index} style={{ color: '#faad14', fontSize: '12px' }} />
                ))}
              </div>
              <Typography.Link 
                style={{ fontSize: '12px' }} 
                onClick={() => openReviewDetail(record)} 
              >
                Chi tiết
              </Typography.Link>
            </Space>
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

      {/* MODAL GỬI ĐÁNH GIÁ MỚI */}
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

      {/* MODAL XEM CHI TIẾT ĐÁNH GIÁ */}
      <Modal
        title={<Space><StarFilled style={{ color: '#faad14' }} /> Chi tiết đánh giá từ bạn</Space>}
        open={isReviewDetailOpen}
        onCancel={() => setIsReviewDetailOpen(false)}
        footer={[<Button key="close" onClick={() => setIsReviewDetailOpen(false)}>Đóng</Button>]}
        width={650}
        centered
      >
        {selectedReview ? (
          <Descriptions 
            bordered 
            column={1} 
            size="small"
            labelStyle={{ width: '30%', fontWeight: 'bold', backgroundColor: '#fafafa' }}
            contentStyle={{ width: '70%', backgroundColor: '#fff' }}
          >
            <Descriptions.Item label="Mã đơn hàng">
              <Text code>#{selectedReview.id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Khách sạn">
              {selectedReview.hotel_name}
            </Descriptions.Item>
            <Descriptions.Item label="Điểm đánh giá">
              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: selectedReview.rating || 5 }).map((_, i) => (
                  <StarFilled key={i} style={{ color: '#faad14' }} />
                ))}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Bình luận của bạn">
              <div style={{ minHeight: '80px', whiteSpace: 'pre-line', padding: '8px 0' }}>
                {selectedReview.review_comment || "Bạn không để lại bình luận."}
              </div>
            </Descriptions.Item>
          </Descriptions>
        ) : <Empty />}
      </Modal>
    </Card>
  );
};

export default CustomerBookings;