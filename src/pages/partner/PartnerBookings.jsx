import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Card, Typography, App as AntApp, Badge, Tooltip, Empty, Tabs } from 'antd';
import { CheckOutlined, CloseOutlined, UserOutlined, CalendarOutlined, DollarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axiosClient from '../../services/axiosClient';

const { Title, Text } = Typography;

const PartnerBookings = () => {
  const { message: antdMessage } = AntApp.useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/hotels/partner-bookings/');
      setBookings(response);
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      await axiosClient.patch(`/hotels/bookings/${bookingId}/`, { status: newStatus });
      antdMessage?.success(newStatus === 'Confirmed' ? 'Đã xác nhận đơn hàng thành công!' : 'Đã từ chối đơn hàng.');
      fetchBookings();
    } catch (error) {
      antdMessage?.error("Cập nhật trạng thái thất bại.");
    } finally {
      setLoading(false);
    }
  };

  // Lọc dữ liệu dựa trên Tab đang chọn
  const filteredBookings = activeTab === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === activeTab);

  const columns = [
    { 
      title: 'Mã đơn', 
      dataIndex: 'id', 
      key: 'id',
      width: 100,
      render: (id) => <Text code style={{color: '#1890ff'}}>#{id}</Text>
    },
    { 
      title: 'Khách hàng', 
      key: 'customer',
      render: (record) => (
        <Space direction="vertical" size={0}>
          <Text strong><UserOutlined /> {record.customer_name || 'Khách vãng lai'}</Text>
          <Text type="secondary" style={{fontSize: 12}}>{record.customer_phone || 'N/A'}</Text>
        </Space>
      )
    },
    { 
      title: 'Phòng & Khách sạn', 
      key: 'room_info',
      render: (record) => (
        <div>
          <Text strong>{record.hotel_name}</Text> <br/>
          <Tag color="cyan">Phòng {record.room_number}</Tag>
          <Text type="secondary" style={{fontSize: 12}}>{record.room_type_name}</Text>
        </div>
      )
    },
    { 
      title: 'Ngày lưu trú', 
      key: 'dates',
      render: (record) => (
        <div style={{minWidth: 160}}>
          <Space direction="vertical" size={0}>
            <Text style={{fontSize: 13}}><CalendarOutlined /> <Text type="success">Vào: {record.check_in}</Text></Text>
            <Text style={{fontSize: 13}}><CalendarOutlined /> <Text type="danger">Ra: {record.check_out}</Text></Text>
          </Space>
        </div>
      )
    },
    {
      title: 'Thanh toán',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (price) => (
        <Text strong style={{color: '#faad14'}}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)}
        </Text>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          'Pending': { color: 'orange', text: 'CHỜ DUYỆT', icon: <Badge status="warning" /> },
          'Confirmed': { color: 'green', text: 'ĐÃ XÁC NHẬN', icon: <Badge status="success" /> },
          'Cancelled': { color: 'red', text: 'ĐÃ TỪ CHỐI', icon: <Badge status="error" /> },
          'Completed': { color: 'blue', text: 'HOÀN THÀNH', icon: <Badge status="processing" /> }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color} style={{borderRadius: 10, padding: '2px 10px'}}>{config.text}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        record.status === 'Pending' ? (
          <Space>
            <Tooltip title="Xác nhận đơn">
              <Button 
                type="primary" 
                shape="circle"
                icon={<CheckOutlined />}
                onClick={() => handleUpdateStatus(record.id, 'Confirmed')}
              />
            </Tooltip>
            <Tooltip title="Từ chối đơn">
              <Button 
                danger 
                shape="circle"
                icon={<CloseOutlined />}
                onClick={() => handleUpdateStatus(record.id, 'Cancelled')}
              />
            </Tooltip>
          </Space>
        ) : (
          <Tooltip title="Xem chi tiết đơn hàng">
            <Button icon={<InfoCircleOutlined />} type="link">Chi tiết</Button>
          </Tooltip>
        )
      )
    }
  ];

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ padding: '30px', maxWidth: 1400, margin: '0 auto' }}>
        <Card 
          bordered={false}
          style={{ borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Title level={3} style={{ margin: 0 }}>
              <DollarOutlined style={{color: '#1890ff', marginRight: 10}} />
              Quản lý đặt phòng
            </Title>
            <Text type="secondary">Tổng số đơn hàng: {bookings.length}</Text>
          </div>

          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              { label: `Tất cả đơn`, key: 'all' },
              { label: `Chờ duyệt`, key: 'Pending' },
              { label: `Đã xác nhận`, key: 'Confirmed' },
              { label: `Đã hoàn thành`, key: 'Completed' },
              { label: `Đã hủy`, key: 'Cancelled' },
            ]}
          />

          <Table 
            columns={columns} 
            dataSource={filteredBookings} 
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 8 }}
            scroll={{ x: 1000 }}
            locale={{ emptyText: <Empty description="Không có đơn đặt phòng nào" /> }}
          />
        </Card>
      </div>
    </div>
  );
};

export default PartnerBookings;