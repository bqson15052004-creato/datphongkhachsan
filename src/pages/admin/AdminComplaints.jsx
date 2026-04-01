import React from 'react';
import { Card, Table, Tag, Button, Space, Typography, Tooltip, Avatar } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, MessageOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminComplaints = () => {
  const complaints = [];

  const table_columns = [
    { title: 'Ngày gửi', dataIndex: 'date', key: 'date' },
    { 
      title: 'Người khiếu nại', 
      dataIndex: 'user', 
      key: 'user', 
      render: (text) => (
        <Space>
          <Avatar size="small" icon={<MessageOutlined />} />
          {text}
        </Space>
      ) 
    },
    { title: 'Đối tượng bị khiếu nại', dataIndex: 'hotel', key: 'hotel' },
    { 
      title: 'Nội dung', 
      dataIndex: 'content', 
      key: 'content', 
      width: 300,
      render: (text) => (
        <Tooltip title={text}>
          <div style={ellipsis_style}>
            {text}
          </div>
        </Tooltip>
      )
    },
    { 
      title: 'Mức độ', 
      dataIndex: 'level', 
      key: 'level',
      render: (level) => (
        <Tag color={level === 'Khẩn cấp' ? 'volcano' : 'orange'}>{level}</Tag>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag 
          icon={status === 'Đang xử lý' ? <ExclamationCircleOutlined /> : null} 
          color={status === 'Chưa xử lý' ? 'red' : 'processing'}
        >
          {status}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      render: () => (
        <Space>
          <Button type="primary" size="small">Giải quyết</Button>
          <Button size="small">Liên hệ khách</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={container_style}>
      <Card title={<Title level={3}>Trung tâm Xử lý Khiếu nại</Title>}>
        <Table columns={table_columns} dataSource={complaints} />
      </Card>
    </div>
  );
};

const container_style = { 
  padding: '24px' 
};

const ellipsis_style = { 
  whiteSpace: 'nowrap', 
  overflow: 'hidden', 
  textOverflow: 'ellipsis', 
  width: 250 
};

export default AdminComplaints;