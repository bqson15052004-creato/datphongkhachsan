import React, { useState } from 'react';
import { Card, Table, Typography, Tag, Space, Select } from 'antd'; 
import { PercentageOutlined, ShopOutlined } from '@ant-design/icons';
// Import đúng các hằng số từ file mockData.js của ông
import { MOCK_HOTELS, MOCK_USERS, DEFAULT_COMMISSION_RATE } from '../../constants/mockData';

const { Title, Text } = Typography;

const AdminDiscounts = () => {
  // 1. Tự động tạo dữ liệu chiết khấu dựa trên danh sách khách sạn thực tế từ mockData
  // Việc này giúp dữ liệu luôn đồng bộ khi ông thêm khách sạn mới vào mockData
  const [discounts] = useState(MOCK_HOTELS.map((hotel, index) => ({
    id_discount: `COMM_0${index + 1}`,
    // Tìm một đối tác mẫu hoặc gán mặc định
    partner_name: MOCK_USERS.find(u => u.role === 'partner')?.full_name || 'Đối Tác Hệ Thống',
    hotel_name: hotel.hotel_name,
    // Giả lập mức chiết khấu: khách sạn đầu tiên lấy mặc định, các khách sạn sau ngẫu nhiên tí cho đẹp
    commission: index === 0 ? DEFAULT_COMMISSION_RATE : (10 + (index * 2)), 
    status: 'active'
  })));

  // State lưu giá trị lọc (gõ hoặc chọn)
  const [filterText, setFilterText] = useState('');

  const columns = [
    {
      title: 'Tên đối tác',
      dataIndex: 'partner_name',
      key: 'partner_name',
      width: '30%',
      render: (text) => (
        <Space>
          <Text strong>{text}</Text>
          <Tag color="blue">Partner</Tag>
        </Space>
      )
    },
    {
      title: 'Khách sạn quản lý',
      dataIndex: 'hotel_name',
      key: 'hotel_name',
      width: '40%',
      render: (text) => (
        <Space>
          <ShopOutlined style={{ color: '#1890ff' }} />
          <Text type="secondary">{text}</Text>
        </Space>
      )
    },
    {
      title: 'Chiết khấu (%)',
      dataIndex: 'commission',
      key: 'commission',
      width: '20%',
      align: 'center',
      render: (val) => (
        <Tag color="volcano" style={{ fontSize: '14px', fontWeight: 'bold', padding: '2px 12px' }}>
          <PercentageOutlined /> {val}%
        </Tag>
      )
    },
  ];

  // Logic lọc: So sánh chính xác (Exact Match)
  const filteredData = filterText
    ? discounts.filter(item => 
        item.hotel_name.toLowerCase() === filterText.toLowerCase()
      )
    : discounts;

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <PercentageOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />
            <Title level={4} style={{ margin: 0 }}>Quản lý chiết khấu đối tác</Title>
          </Space>
        }
        extra={
          <Space size="middle">
            <Select
              showSearch
              allowClear
              placeholder="🔍 Gõ hoặc chọn khách sạn..."
              style={{ width: 320 }}
              value={filterText || undefined} 
              onSelect={(value) => setFilterText(value)}
              onSearch={(value) => setFilterText(value)}
              onChange={(value) => { if (!value) setFilterText(''); }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              // Map trực tiếp từ mảng MOCK_HOTELS ông vừa cập nhật
              options={MOCK_HOTELS.map(h => ({ label: h.hotel_name, value: h.hotel_name }))}
            />
          </Space>
        }
        style={{ borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}
      >
        <Table 
          columns={columns} 
          dataSource={filteredData}
          rowKey="id_discount" 
          bordered 
          locale={{ emptyText: 'Không tìm thấy dữ liệu chiết khấu cho khách sạn này' }}
          pagination={{ pageSize: 6 }}
        />
        
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffffffff', border: '1px solid #ffffffff', borderRadius: '8px' }}>
          <Text italic type="warning" style={{ color: '#00a2ffff' }}>
            Lưu ý: Mọi thay đổi về chiết khấu sẽ áp dụng ngay lập tức cho các hóa đơn phát sinh kể từ thời điểm cập nhật.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default AdminDiscounts;