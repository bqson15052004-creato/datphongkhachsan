import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Button, Space, Card, Typography, 
  Modal, Descriptions, Badge, Tabs, App as AntApp 
} from 'antd';
import { 
  CheckCircleOutlined, CloseCircleOutlined, 
  EyeOutlined, SafetyOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminPartners = () => {
  const { message } = AntApp.useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Giả lập dữ liệu các yêu cầu đăng ký từ Đối tác gửi lên
  const [requests, setRequests] = useState([
    {
      id: 'REQ001',
      hotelName: 'Vinpearl Luxury Nha Trang',
      owner: 'Nguyễn Văn A',
      email: 'partner.a@gmail.com',
      address: 'Đảo Hòn Tre, Nha Trang',
      status: 'Đang chờ',
      joinDate: '12/03/2026'
    },
    {
      id: 'REQ002',
      hotelName: 'Homestay Hội An Old Town',
      owner: 'Trần Thị B',
      email: 'hoian.homestay@gmail.com',
      address: 'Phan Chu Trinh, Hội An',
      status: 'Đã duyệt',
      joinDate: '10/03/2026'
    }
  ]);

  // Logic: Phê duyệt đối tác
  const handleApprove = (id) => {
    const updated = requests.map(req => 
      req.id === id ? { ...req, status: 'Đã duyệt' } : req
    );
    setRequests(updated);
    message.success('Đã phê duyệt đối tác thành công!');
    setIsModalOpen(false);
  };

  // Logic: Từ chối đối tác
  const handleReject = (id) => {
    Modal.confirm({
      title: 'Xác nhận từ chối?',
      content: 'Bạn có chắc chắn muốn từ chối yêu cầu đăng ký này?',
      okText: 'Từ chối',
      okType: 'danger',
      onOk: () => {
        const updated = requests.filter(req => req.id !== id);
        setRequests(updated);
        message.warning('Đã từ chối yêu cầu đăng ký.');
        setIsModalOpen(false);
      }
    });
  };

  const columns = [
    { title: 'Mã yêu cầu', dataIndex: 'id', key: 'id' },
    { title: 'Tên Khách sạn/Đối tác', dataIndex: 'hotelName', key: 'hotelName' },
    { title: 'Người đại diện', dataIndex: 'owner', key: 'owner' },
    { title: 'Ngày gửi', dataIndex: 'joinDate', key: 'joinDate' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Đã duyệt' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => { setSelectedPartner(record); setIsModalOpen(true); }}
          >
            Xem chi tiết
          </Button>
          {record.status === 'Đang chờ' && (
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />} 
              onClick={() => handleApprove(record.id)}
            >
              Duyệt ngay
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title={<Title level={3}><SafetyOutlined /> Phê duyệt Đối tác & Khách sạn</Title>}>
        <Tabs defaultActiveKey="1" items={[
          { key: '1', label: 'Yêu cầu chờ duyệt', children: <Table columns={columns} dataSource={requests.filter(r => r.status === 'Đang chờ')} /> },
          { key: '2', label: 'Tất cả đối tác', children: <Table columns={columns} dataSource={requests} /> },
        ]} />
      </Card>

      {/* Modal chi tiết hồ sơ đối tác */}
      <Modal
        title="Chi tiết hồ sơ đăng ký"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>Đóng</Button>,
          selectedPartner?.status === 'Đang chờ' && (
            <Button key="reject" danger onClick={() => handleReject(selectedPartner.id)}>Từ chối</Button>
          ),
          selectedPartner?.status === 'Đang chờ' && (
            <Button key="approve" type="primary" onClick={() => handleApprove(selectedPartner.id)}>Duyệt hồ sơ</Button>
          ),
        ]}
        width={700}
      >
        {selectedPartner && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên cơ sở">{selectedPartner.hotelName}</Descriptions.Item>
            <Descriptions.Item label="Chủ sở hữu">{selectedPartner.owner}</Descriptions.Item>
            <Descriptions.Item label="Email liên hệ">{selectedPartner.email}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ kinh doanh">{selectedPartner.address}</Descriptions.Item>
            <Descriptions.Item label="Giấy phép kinh doanh">
              <Badge status="processing" text="Đã xác thực thông tin giấy phép" />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default AdminPartners;