import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Card, Typography, message, Badge } from 'antd';
import { CheckOutlined, CloseOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import axiosClient from '../../services/axiosClient';

const { Title, Text } = Typography;

const PartnerBookings = () => {
  const [booking_list, set_booking_list] = useState([]);
  const [is_loading, set_is_loading] = useState(false);
  // 1. Hàm lấy danh sách đặt phòng của partner
  const fetch_partner_bookings = async () => {
    set_is_loading(true);
    try {
      const response = await axiosClient.get('/hotels/bookings/partner/');
      set_booking_list(response);
    } catch (error) {
      console.error("Lỗi fetch bookings:", error);
      message.error("Không thể tải danh sách đơn đặt phòng.");
    } finally {
      set_is_loading(false);
    }
  };

  useEffect(() => {
    fetch_partner_bookings();
  }, []);

  // 2. Hàm xử lý Update Status
  const handle_update_status = async (id, new_status) => {
    try {
      await axiosClient.patch(`/hotels/bookings/${id}/`, { status: new_status });
      
      message.success(`Đã ${new_status === 'Confirmed' ? 'xác nhận' : 'từ chối'} đơn hàng!`);
      // Reload lại danh sách sau khi update thành công
      fetch_partner_bookings();
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại.");
    }
  };

  const columns = [
    { 
      title: 'Khách hàng', 
      key: 'customer',
      render: (record) => (
        <Space direction="vertical" size={0}>
          <Text strong><UserOutlined /> {record.customer_name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}><PhoneOutlined /> {record.phone}</Text>
        </Space>
      )
    },
    { title: 'Phòng', dataIndex: 'room_number', key: 'room_number' },
    { 
      title: 'Thời gian', 
      key: 'dates',
      render: (record) => (
        <div style={{ fontSize: 12 }}>
          <div>{record.check_in}</div>
          <div style={{ color: '#bfbfbf' }}>đến</div>
          <div>{record.check_out}</div>
        </div>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        const colors = { 'Pending': 'orange', 'Confirmed': 'green', 'Cancelled': 'red' };
        return <Tag color={colors[status] || 'default'}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'Pending' && (
            <>
              <Button 
                type="primary" 
                size="small" 
                icon={<CheckOutlined />} 
                onClick={() => handle_update_status(record.id, 'Confirmed')}
              >
                Duyệt
              </Button>
              <Button 
                danger 
                size="small" 
                icon={<CloseOutlined />} 
                onClick={() => handle_update_status(record.id, 'Cancelled')}
              >
                Huỷ
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card 
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>Quản lý đặt phòng (Partner)</Title>
          <Badge count={booking_list.filter(b => b.status === 'Pending').length} />
        </Space>
      }
    >
      <Table 
        columns={columns} 
        dataSource={booking_list} 
        rowKey="id" 
        loading={is_loading} 
      />
    </Card>
  );
};

export default PartnerBookings;