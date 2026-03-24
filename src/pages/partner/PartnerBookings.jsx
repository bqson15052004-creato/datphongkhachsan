import React from 'react';
import { Table, Tag, Button, Space, Card, Typography } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;

const PartnerBookings = () => {
  const data = [
    {
      key: '1',
      customer: 'Nguyễn Văn A',
      phone: '0901234567',
      room: 'Deluxe Room #102',
      checkIn: '25/03/2026',
      status: 'Chờ xác nhận',
    },
  ];

  const columns = [
    { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
    { title: 'Loại phòng', dataIndex: 'room', key: 'room' },
    { title: 'Ngày nhận phòng', dataIndex: 'checkIn', key: 'checkIn' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => <Tag color="orange">{status}</Tag>
    },
    {
      title: 'Xử lý đơn',
      render: () => (
        <Space>
          <Button type="primary" size="small" icon={<CheckOutlined />}>Xác nhận</Button>
          <Button danger size="small" icon={<CloseOutlined />}>Từ chối</Button>
        </Space>
      )
    }
  ];

  return (
    <Card title={<Title level={4}>Danh sách khách đặt phòng</Title>}>
      <Table columns={columns} dataSource={data} />
    </Card>
  );
};

export default PartnerBookings;