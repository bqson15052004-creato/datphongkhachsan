import React from 'react';
import { Table, Tag, Card, Typography, Button } from 'antd';
import Navbar from '../../components/common/Navbar';
const { Title } = Typography;

const CustomerBookings = () => {
  const data = [
    {
      key: '1',
      hotel: 'Vinpearl Luxury Nha Trang',
      room: 'Deluxe Ocean View',
      date: '20/03/2026 - 22/03/2026',
      total: '5.000.000đ',
      status: 'Đã hoàn thành',
    },
  ];

  const columns = [
    { title: 'Khách sạn', dataIndex: 'hotel', key: 'hotel' },
    { title: 'Phòng', dataIndex: 'room', key: 'room' },
    { title: 'Thời gian', dataIndex: 'date', key: 'date' },
    { title: 'Tổng tiền', dataIndex: 'total', key: 'total' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => <Tag color="green">{status}</Tag>
    },
    {
      title: 'Thao tác',
      render: () => <Button size="small">Xem hóa đơn</Button>
    }
  ];

  return (
    <>
      <Navbar />
      <div style={{ padding: '30px 50px' }}>
        <Card title={<Typography.Title level={3}>Lịch sử chuyến đi của bạn</Typography.Title>}>
          <Table 
            dataSource={[]}
            columns={[
              { title: 'Khách sạn', dataIndex: 'hotelName' },
              { title: 'Ngày đặt', dataIndex: 'date' },
              { title: 'Trạng thái', render: () => <Tag color="blue">Sắp đến</Tag> }
            ]} 
          />
        </Card>
      </div>
    </>
  );
};

export default CustomerBookings;