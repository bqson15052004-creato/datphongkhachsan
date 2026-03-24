import React from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography } from 'antd';
import { ShopOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';

const { Title } = Typography;

const PartnerDashboard = () => {
  // 1. Dữ liệu thống kê
  const stats = [
    { title: 'Tổng phòng', value: 0, icon: <ShopOutlined />, color: '#1890ff' },
    { title: 'Đơn mới', value: 0, icon: <SyncOutlined spin />, color: '#faad14' },
    { title: 'Hoàn tất', value: 0, icon: <CheckCircleOutlined />, color: '#52c41a' },
  ];

  // 2. Cấu trúc bảng
  const columns = [
    { title: 'Mã đơn', dataIndex: 'id', key: 'id' },
    { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
    { title: 'Ngày đặt', dataIndex: 'date', key: 'date' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => (
        <Tag color={status === 'Pending' ? 'gold' : 'green'}>
          {status === 'Pending' ? 'Chờ duyệt' : 'Đã xác nhận'}
        </Tag>
      )
    },
  ];

  const data = [];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Bảng điều khiển đối tác</Title>
      
      {/* Thống kê nhanh */}
      <Row gutter={[16, 16]}>
        {stats.map((item, index) => (
          <Col xs={24} sm={8} key={index}>
            <Card bordered={false} hoverable>
              <Statistic
                title={item.title}
                value={item.value}
                valueStyle={{ color: item.color }}
                prefix={item.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Danh sách đơn đặt phòng mới nhất */}
      <Card title="Đơn đặt phòng gần đây" style={{ marginTop: 24 }} bordered={false}>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
  );
};

export default PartnerDashboard;