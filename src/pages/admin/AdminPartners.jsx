import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Button, Space, Card, Typography, 
  Modal, Descriptions, Badge, Tabs, App as AntApp 
} from 'antd';
import { 
  CheckCircleOutlined, EyeOutlined, SafetyOutlined 
} from '@ant-design/icons';

const { Title } = Typography;

const AdminPartners = () => {
  const { message } = AntApp.useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [requests, setRequests] = useState([]);

  // 1. Lấy dữ liệu từ localStorage khi vào trang
  const loadData = () => {
    const allHotels = JSON.parse(localStorage.getItem('all_hotels')) || [];
    setRequests(allHotels);
  };

  useEffect(() => {
    loadData();
    // Lắng nghe nếu có thay đổi từ tab khác
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  // 2. Logic: Phê duyệt đối tác
  const handleApprove = (id) => {
    Modal.confirm({
      title: 'Xác nhận phê duyệt?',
      content: 'Bạn có chắc chắn muốn duyệt hồ sơ đối tác này? Khách sạn sẽ được hiển thị trên hệ thống ngay lập tức.',
      okText: 'Duyệt ngay',
      cancelText: 'Hủy',
      onOk: () => {
        const allHotels = JSON.parse(localStorage.getItem('all_hotels')) || [];
        const updated = allHotels.map(req => 
          req.id === id ? { ...req, status: 'Đã duyệt' } : req
        );
        
        // Lưu lại vào localStorage
        localStorage.setItem('all_hotels', JSON.stringify(updated));
        
        // KÍCH HOẠT SỰ KIỆN STORAGE THỦ CÔNG ĐỂ SIDEBAR CẬP NHẬT CON SỐ
        window.dispatchEvent(new Event('storage'));
        
        // Cập nhật lại giao diện tại chỗ
        setRequests(updated);
        message.success('Đã phê duyệt đối tác thành công!');
        setIsModalOpen(false); 
      }
    });
  };

  // 3. Logic: Từ chối đối tác
  const handleReject = (id) => {
    Modal.confirm({
      title: 'Xác nhận từ chối?',
      content: 'Bạn có chắc chắn muốn từ chối yêu cầu đăng ký này?',
      okText: 'Từ chối',
      okType: 'danger',
      onOk: () => {
        const allHotels = JSON.parse(localStorage.getItem('all_hotels')) || [];
        const updated = allHotels.filter(req => req.id !== id);
        
        localStorage.setItem('all_hotels', JSON.stringify(updated));

        // KÍCH HOẠT SỰ KIỆN STORAGE THỦ CÔNG
        window.dispatchEvent(new Event('storage'));

        setRequests(updated);
        message.warning('Đã từ chối yêu cầu đăng ký.');
        setIsModalOpen(false);
      }
    });
  };

  const columns = [
    { title: 'Mã yêu cầu', dataIndex: 'id', key: 'id' },
    { title: 'Tên Khách sạn/Đối tác', dataIndex: 'name', key: 'name' }, 
    { title: 'Người đại diện', dataIndex: 'owner', key: 'owner' },
    { title: 'Ngày gửi', dataIndex: 'date', key: 'date' }, 
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
              Duyệt
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title={<Title level={3} style={{margin:0}}><SafetyOutlined /> Phê duyệt Đối tác & Khách sạn</Title>}>
        <Tabs defaultActiveKey="1" items={[
          { 
            key: '1', 
            label: 'Yêu cầu chờ duyệt', 
            children: <Table columns={columns} dataSource={requests.filter(r => r.status === 'Đang chờ')} rowKey="id" /> 
          },
          { 
            key: '2', 
            label: 'Tất cả đối tác', 
            children: <Table columns={columns} dataSource={requests} rowKey="id" /> 
          },
        ]} />
      </Card>

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
            <Descriptions.Item label="Tên cơ sở">{selectedPartner.name}</Descriptions.Item>
            <Descriptions.Item label="Chủ sở hữu">{selectedPartner.owner || 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ kinh doanh">{selectedPartner.address}</Descriptions.Item>
            <Descriptions.Item label="Mô tả">{selectedPartner.description || 'Không có mô tả'}</Descriptions.Item>
            <Descriptions.Item label="Giấy phép kinh doanh">
              <Badge status="processing" text="Đã xác thực thông tin" />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default AdminPartners;