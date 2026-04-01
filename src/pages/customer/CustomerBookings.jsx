import React from 'react';
import { Table, Tag, Card, Typography, Button, Space } from 'antd';
import Navbar from '../../components/common/Navbar';

const { Title, Text } = Typography;

const CustomerBookings = () => {
  // 1. Dữ liệu mẫu
  const booking_list = [
    {
      key: '1',
      hotel_name: 'Vinpearl Luxury Nha Trang',
      room_type: 'Deluxe Ocean View',
      stay_period: '20/03/2026 - 22/03/2026',
      total_amount: '5.000.000đ',
      status: 'completed',
    },
    {
      key: '2',
      hotel_name: 'InterContinental Da Nang',
      room_type: 'Classic Room',
      stay_period: '01/04/2026 - 03/04/2026',
      total_amount: '7.200.000đ',
      status: 'upcoming',
    },
  ];

  // 2. Định nghĩa cột Table
  const table_columns = [
    { 
      title: 'Khách sạn', 
      dataIndex: 'hotel_name', 
      key: 'hotel_name',
      render: (text) => <Text strong>{text}</Text>
    },
    { title: 'Hạng phòng', dataIndex: 'room_type', key: 'room_type' },
    { title: 'Thời gian', dataIndex: 'stay_period', key: 'stay_period' },
    { 
      title: 'Tổng tiền', 
      dataIndex: 'total_amount', 
      key: 'total_amount',
      render: (amount) => <Text style={price_text_style}>{amount}</Text>
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        let color = 'blue';
        let text = 'Sắp đến';
        
        if (status === 'completed') {
          color = 'green';
          text = 'Đã hoàn thành';
        } else if (status === 'cancelled') {
          color = 'red';
          text = 'Đã hủy';
        }
        
        return <Tag color={color}>{text.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => (
        <Button type="link" size="small">Xem chi tiết</Button>
      )
    }
  ];

  return (
    <>
      <Navbar />
      <div style={container_style}>
        <Card 
          bordered={false} 
          style={card_style}
          title={
            <Space>
              <Title level={3} style={no_margin_style}>Lịch sử chuyến đi của bạn</Title>
            </Space>
          }
        >
          <Table 
            dataSource={booking_list} 
            columns={table_columns} 
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: 'Bạn chưa có chuyến đi nào' }}
          />
        </Card>
      </div>
    </>
  );
};

// STYLE CONSTANTS
const container_style = { padding: '30px 50px', background: '#f0f2f5', minHeight: '100vh' };
const card_style = { borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const no_margin_style = { margin: 0 };
const price_text_style = { color: '#ff4d4f', fontWeight: 'bold' };

export default CustomerBookings;