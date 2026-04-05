import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Tooltip, Avatar, message, Modal } from 'antd';
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  MessageOutlined, 
  CustomerServiceOutlined,
  AlertOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminComplaints = () => {
  // 1. Dữ liệu mẫu chuẩn snake_case
  const [complaint_list, setComplaintList] = useState([
    {
      key: '1',
      complaint_id: 'CP-10023',
      created_at: '2026-04-01 09:15',
      reporter_name: 'Nguyễn Văn A',
      target_hotel: 'Vinpearl Luxury Nha Trang',
      content_detail: 'Phòng không giống như ảnh mô tả, máy lạnh hỏng nhưng nhân viên không hỗ trợ đổi phòng.',
      urgency_level: 'high', // high, medium, low
      handling_status: 'pending' // pending, processing, resolved
    },
    {
      key: '2',
      complaint_id: 'CP-10025',
      created_at: '2026-04-02 14:30',
      reporter_name: 'Trần Thị B',
      target_hotel: 'Pullman Vũng Tàu',
      content_detail: 'Khách sạn tự ý hủy phòng mà không thông báo trước 24h.',
      urgency_level: 'critical',
      handling_status: 'processing'
    },
    {
      key: '3',
      complaint_id: 'CP-10028',
      created_at: '2026-04-03 08:00',
      reporter_name: 'Lê Văn C',
      target_hotel: 'InterContinental Da Nang',
      content_detail: 'Thái độ nhân viên lễ tân thiếu chuyên nghiệp khi làm thủ tục check-in.',
      urgency_level: 'medium',
      handling_status: 'resolved'
    }
  ]);

  // 2. Logic: Cập nhật trạng thái khiếu nại
  const handle_resolve = (id) => {
    Modal.confirm({
      title: 'Xác nhận giải quyết',
      content: 'Bạn đã liên hệ và xử lý xong khiếu nại này cho khách hàng?',
      onOk: () => {
        setComplaintList(prev => prev.map(item => 
          item.complaint_id === id ? { ...item, handling_status: 'resolved' } : item
        ));
        message.success(`Đã đánh dấu khiếu nại ${id} là đã giải quyết!`);
      }
    });
  };

  const columns = [
    { 
      title: 'Mã số', 
      dataIndex: 'complaint_id', 
      key: 'complaint_id',
      render: (id) => <Text code>{id}</Text>
    },
    { 
      title: 'Ngày gửi', 
      dataIndex: 'created_at', 
      key: 'created_at',
      width: 150 
    },
    { 
      title: 'Người khiếu nại', 
      dataIndex: 'reporter_name', 
      key: 'reporter_name', 
      render: (text) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#1890ff' }} icon={<MessageOutlined />} />
          <Text strong>{text}</Text>
        </Space>
      ) 
    },
    { 
      title: 'Khách sạn bị tố cáo', 
      dataIndex: 'target_hotel', 
      key: 'target_hotel',
      render: (hotel) => <Text type="danger">{hotel}</Text>
    },
    {
      title: 'Nội dung',
      dataIndex: 'content_detail',
      key: 'content_detail',
      width: 250,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 220 }}>
            {text}
          </div>
        </Tooltip>
      )
    },
    {
      title: 'Mức độ',
      dataIndex: 'urgency_level',
      key: 'urgency_level',
      render: (level) => {
        const levels = {
          critical: { label: 'KHẨN CẤP', color: 'volcano', icon: <AlertOutlined /> },
          high: { label: 'CAO', color: 'orange', icon: <ExclamationCircleOutlined /> },
          medium: { label: 'TRUNG BÌNH', color: 'blue', icon: <ClockCircleOutlined /> }
        };
        const config = levels[level] || levels.medium;
        return <Tag icon={config.icon} color={config.color}>{config.label}</Tag>;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'handling_status',
      key: 'handling_status',
      render: (status) => {
        if (status === 'resolved') return <Tag color="green" icon={<CheckCircleOutlined />}>ĐÃ XỬ LÝ</Tag>;
        if (status === 'processing') return <Tag color="processing" icon={<ClockCircleOutlined />}>ĐANG XỬ LÝ</Tag>;
        return <Tag color="error">CHƯA XỬ LÝ</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            disabled={record.handling_status === 'resolved'}
            onClick={() => handle_resolve(record.complaint_id)}
          >
            Giải quyết
          </Button>
          <Button size="small" icon={<CustomerServiceOutlined />}>Liên hệ</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        variant={false}
        style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        title={
          <Title level={3} style={{ margin: 0 }}>
            <AlertOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
            Trung tâm Xử lý Khiếu nại
          </Title>
        }
      >
        <Table 
          columns={columns} 
          dataSource={complaint_list} 
          pagination={{ pageSize: 5 }}
          rowKey="complaint_id"
        />
      </Card>
    </div>
  );
};

export default AdminComplaints;