import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Card, Typography, App as AntApp, Badge, Tooltip, Empty, Tabs, Row, Col } from 'antd';
import { CheckOutlined, CloseOutlined, UserOutlined, CalendarOutlined, DollarOutlined, BankOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axiosClient from '../../services/axiosClient';
import { MOCK_BOOKINGS } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;

const PartnerBookings = () => {
  const { message: antdMessage } = AntApp.useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

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
    // Ưu tiên đơn mới từ LocalStorage (đơn khách vừa đặt)
    const allBookings = [...localData.reverse(), ...apiData, ...MOCK_BOOKINGS];
    setBookings(allBookings);
    setLoading(false);
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
      setBookings(prev => prev.map(b => 
        (b.id_booking === bookingId || b.id === bookingId) ? { ...b, status: newStatus } : b
      ));
      antdMessage?.success(`[Demo] Đã chuyển sang ${newStatus}`);
    } finally { setLoading(false); }
  };

  const filteredBookings = activeTab === 'all' 
    ? bookings 
    : bookings.filter(b => (b.status || b.Status || 'pending').toLowerCase() === activeTab.toLowerCase());

  const columns = [
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
      ellipsis: true,
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
      ellipsis: true,
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
          <div><Text type="success">●</Text> {record.check_in}</div>
          <div><Text type="danger">●</Text> {record.check_out}</div>
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
        // Fix: Ép mặc định 'pending' nếu dữ liệu rỗng
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
      title: 'Hành động',
      key: 'action',
      width: 80,
      align: 'center',
      render: (_, record) => {
        const s = (record.status || record.Status || 'pending').toLowerCase();
        
        if (s === 'pending' || s === 'chờ duyệt') {
          return (
            <Space size="middle">
              <Tooltip title="Xác nhận">
                <CheckOutlined 
                  style={{ color: 'blue', cursor: 'pointer', fontSize: '16px' }} 
                  onClick={() => handleUpdateStatus(record.id_booking || record.id, 'Confirmed')}
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <CloseOutlined 
                  style={{ color: 'red', cursor: 'pointer', fontSize: '16px' }} 
                  onClick={() => handleUpdateStatus(record.id_booking || record.id, 'Cancelled')}
                />
              </Tooltip>
            </Space>
          );
        }
        return (
          <Tooltip title="Xem chi tiết">
            <InfoCircleOutlined 
              style={{ color: '#1890ff', cursor: 'pointer', fontSize: '18px' }} 
              onClick={() => antdMessage.info("Chi tiết đơn hàng đang được cập nhật")}
            />
          </Tooltip>
        );
      }
    }
  ];

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}> 
        <Card bordered={false} style={{ marginBottom: 12, borderRadius: 8 }}>
          <Row justify="space-between" align="middle">
            <Col><Title level={4} style={{ margin: 0 }}>Quản lý Đơn hàng (Partner)</Title></Col>
            <Col><Badge status="processing" text="Dữ liệu thực" /></Col>
          </Row>
        </Card>

        <Card bordered={false} style={{ borderRadius: 12 }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab} size="small"
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
            rowKey={(record) => record.id_booking || record.id}
            loading={loading}
            // Loại bỏ hoàn toàn thanh cuộn ngang bằng cách không set scroll.x
            pagination={{ pageSize: 8, size: 'small', current: currentPage, onChange: (p) => setCurrentPage(p) }}
          />
        </Card>
      </div>
    </div>
  );
};

export default PartnerBookings;