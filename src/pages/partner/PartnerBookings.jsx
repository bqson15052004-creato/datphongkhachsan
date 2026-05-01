import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Card, Typography, App as AntApp, Badge, Tooltip, Tabs, Row, Col, Input, DatePicker } from 'antd';
import { 
  CheckOutlined, 
  CloseOutlined, 
  UserOutlined, 
  BankOutlined, 
  InfoCircleOutlined, 
  SearchOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs'; // QUAN TRỌNG: Nhớ import cái này để xử lý ngày tháng
import axiosClient from '../../services/axiosClient';
import { MOCK_BOOKINGS } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;

const PartnerBookings = () => {
  const { message: antdMessage } = AntApp.useApp();
  
  // KHAI BÁO STATE
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [filterDateRange, setFilterDateRange] = useState(null); // State cho DatePicker
  const pageSize = 10;

  // --- LOGIC FETCH DỮ LIỆU ---
  const fetchBookings = async () => {
    setLoading(true);
    let apiData = [];
    try {
      const response = await axiosClient.get('/hotels/partner-bookings/');
      apiData = Array.isArray(response) ? response : [];
    } catch (error) {
      console.warn("Dùng dữ liệu giả lập.");
    }
    const localData = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
    const allBookings = [...localData.reverse(), ...apiData, ...MOCK_BOOKINGS];
    setBookings(allBookings);
    updateBadgeCount(allBookings);
    setLoading(false);
  };

  const updateBadgeCount = (allBookings) => {
    const pendingCount = allBookings.filter(b => {
      const s = (b.status || b.Status || 'pending').toLowerCase();
      return s === 'pending' || s === 'chờ duyệt';
    }).length;
    localStorage.setItem('pending_bookings_count', pendingCount);
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setLoading(true);
    try {
      await axiosClient.patch(`/hotels/bookings/${bookingId}/`, { status: newStatus });
      fetchBookings();
    } catch (error) {
      const localData = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      const updatedLocalData = localData.map(b => 
        (b.id_booking === bookingId || b.id === bookingId) ? { ...b, status: newStatus } : b
      );
      localStorage.setItem('mock_bookings', JSON.stringify(updatedLocalData));
      const newBookingsState = bookings.map(b => 
        (b.id_booking === bookingId || b.id === bookingId) ? { ...b, status: newStatus } : b
      );
      setBookings(newBookingsState);
      updateBadgeCount(newBookingsState);
      antdMessage?.success(`[Demo] Đã chuyển sang ${newStatus}`);
    } finally { setLoading(false); }
  };

  // --- HÀM LỌC TỔNG HỢP (Fix lỗi logic ở image_3ca11e.png) ---
  const filteredBookings = bookings.filter(b => {
    const statusMatch = activeTab === 'all' || 
      (b.status || b.Status || 'pending').toLowerCase() === activeTab.toLowerCase();

    const search = (searchText || '').toLowerCase();
    const textMatch = 
      String(b.id_booking || b.id || '').toLowerCase().includes(search) ||
      String(b.hotel_name || '').toLowerCase().includes(search);

    let dateMatch = true;
    if (filterDateRange && filterDateRange.length === 2) {
      const start = filterDateRange[0].startOf('day');
      const end = filterDateRange[1].endOf('day');
      const checkIn = dayjs(b.check_in);
      const checkOut = dayjs(b.check_out);
      dateMatch = (checkIn.isAfter(start) || checkIn.isSame(start)) && 
                  (checkOut.isBefore(end) || checkOut.isSame(end));
    }
    return statusMatch && textMatch && dateMatch;
  });

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center',
      render: (_, __, index) => <Text strong>{(currentPage - 1) * pageSize + index + 1}</Text>,
    },
    { 
      title: 'Mã đơn', 
      key: 'id_booking',
      width: 80,
      render: (record) => <Text code style={{color: '#1890ff', fontSize: '11px'}}>{record.id_booking || `#${record.id}`}</Text>
    },
    { 
      title: 'Khách hàng', 
      key: 'customer',
      width: 140,
      render: (record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{fontSize: '12px'}}><UserOutlined /> {record.customer_name || 'Khách'}</Text>
          <Text type="secondary" style={{fontSize: 10}}>{record.customer_email || 'No email'}</Text>
        </Space>
      )
    },
    { 
      title: 'Khách sạn', 
      dataIndex: 'hotel_name',
      key: 'hotel_name',
      width: 130,
      render: (name) => <Text strong style={{fontSize: '11px'}}><BankOutlined /> {name}</Text>
    },
    { 
      title: 'Phòng', 
      key: 'room_info',
      width: 90,
      render: (record) => (
        <Space direction="vertical" size={0}>
          <Tag color="cyan" style={{margin: 0, fontSize: '10px'}}>P.{record.room_number || record.id_room}</Tag>
          <Text type="secondary" style={{fontSize: 10}}>{record.room_type || 'Standard'}</Text>
        </Space>
      )
    },
    { 
      title: 'Lưu trú', 
      key: 'dates',
      width: 140,
      render: (record) => (
        <div style={{lineHeight: '1.4', fontSize: 10}}>
          <div><Text type="success">●</Text> Nhận: {record.check_in}</div>
          <div><Text type="danger">●</Text> Trả: {record.check_out}</div>
        </div>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_price',
      key: 'total_price',
      width: 100,
      align: 'right',
      render: (price) => <Text strong style={{color: '#faad14', fontSize: '12px'}}>{Number(price)?.toLocaleString()}₫</Text>
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 100,
      align: 'center',
      render: (record) => {
        const s = (record.status || record.Status || 'pending').toLowerCase();
        const statusConfig = {
          'pending': { color: 'orange', text: 'CHỜ DUYỆT' },
          'chờ duyệt': { color: 'orange', text: 'CHỜ DUYỆT' },
          'confirmed': { color: 'green', text: 'XÁC NHẬN' },
          'cancelled': { color: 'red', text: 'TỪ CHỐI' }
        };
        const config = statusConfig[s] || { color: 'default', text: s.toUpperCase() };
        return <Tag color={config.color} style={{borderRadius: 10, fontSize: '9px'}}>{config.text}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 80,
      align: 'center',
      render: (_, record) => {
        const s = (record.status || record.Status || 'pending').toLowerCase();
        if (s === 'pending' || s === 'chờ duyệt') {
          return (
            <Space size="middle">
              <Tooltip title="Xác nhận">
                <CheckOutlined style={{ color: 'blue', cursor: 'pointer' }} onClick={() => handleUpdateStatus(record.id_booking || record.id, 'Confirmed')} />
              </Tooltip>
              <Tooltip title="Từ chối">
                <CloseOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleUpdateStatus(record.id_booking || record.id, 'Cancelled')} />
              </Tooltip>
            </Space>
          );
        }
        return <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => antdMessage.info("Đang xem chi tiết...")} />;
      }
    }
  ];

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}> 
        <Card bordered={false} style={{ marginBottom: 12, borderRadius: 8 }}>
          <Row justify="space-between" align="middle">
            <Col><Title level={4} style={{ margin: 0 }}>Quản lý Đơn đặt phòng</Title></Col>
            <Col>
              <Space>
                <Badge status="processing" text="Dữ liệu thực" />
                <Button size="small" onClick={fetchBookings}>Làm mới</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card bordered={false} style={{ borderRadius: 12 }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab} 
            size="small"
            tabBarExtraContent={
              <Space style={{ paddingBottom: 8 }}>
                <Input 
                  placeholder="Tìm mã đơn, khách sạn..." 
                  prefix={<SearchOutlined />} 
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)} 
                  allowClear
                  style={{ width: 220, borderRadius: 8 }}
                />
                <DatePicker.RangePicker 
                  placeholder={['Nhận', 'Trả']}
                  onChange={(dates) => setFilterDateRange(dates)}
                  style={{ borderRadius: 8, width: 230 }}
                />
              </Space>
            }
            items={[
              { label: 'Tất cả', key: 'all' },
              { label: 'Chờ duyệt', key: 'pending' },
              { label: 'Đã xác nhận', key: 'confirmed' },
              { label: 'Đã hủy', key: 'cancelled' },
            ]}
          />
          <Table 
            columns={columns} 
            dataSource={filteredBookings} 
            rowKey={(record, index) => record.id_booking || record.id || index}
            loading={loading}
            pagination={{ 
              current: currentPage,
              pageSize: pageSize,
              onChange: (page) => setCurrentPage(page),
              showTotal: (total) => `Tổng cộng ${total} đơn`,
              position: ['bottomRight'],
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default PartnerBookings;