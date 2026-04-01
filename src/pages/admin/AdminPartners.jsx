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
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [selected_partner, set_selected_partner] = useState(null);
  const [requests, set_requests] = useState([]);

  // 1. Lấy dữ liệu từ localStorage
  const load_data = () => {
    const all_hotels = JSON.parse(localStorage.getItem('all_hotels')) || [];
    set_requests(all_hotels);
  };

  useEffect(() => {
    load_data();
    window.addEventListener('storage', load_data);
    return () => window.removeEventListener('storage', load_data);
  }, []);

  // 2. Logic: Phê duyệt đối tác
  const handle_approve = (id) => {
    Modal.confirm({
      title: 'Xác nhận phê duyệt?',
      content: 'Bạn có chắc chắn muốn duyệt hồ sơ đối tác này? Khách sạn sẽ được hiển thị trên hệ thống ngay lập tức.',
      okText: 'Duyệt ngay',
      cancelText: 'Hủy',
      onOk: () => {
        const all_hotels = JSON.parse(localStorage.getItem('all_hotels')) || [];
        const updated = all_hotels.map(req => 
          req.id === id ? { ...req, status: 'Đã duyệt' } : req
        );
        
        localStorage.setItem('all_hotels', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        
        set_requests(updated);
        message.success('Đã phê duyệt đối tác thành công!');
        set_is_modal_open(false); 
      }
    });
  };

  // 3. Logic: Từ chối đối tác
  const handle_reject = (id) => {
    Modal.confirm({
      title: 'Xác nhận từ chối?',
      content: 'Bạn có chắc chắn muốn từ chối yêu cầu đăng ký này?',
      okText: 'Từ chối',
      okType: 'danger',
      onOk: () => {
        const all_hotels = JSON.parse(localStorage.getItem('all_hotels')) || [];
        const updated = all_hotels.filter(req => req.id !== id);
        
        localStorage.setItem('all_hotels', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));

        set_requests(updated);
        message.warning('Đã từ chối yêu cầu đăng ký.');
        set_is_modal_open(false);
      }
    });
  };

  const table_columns = [
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
            onClick={() => { set_selected_partner(record); set_is_modal_open(true); }}
          >
            Xem chi tiết
          </Button>
          {record.status === 'Đang chờ' && (
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />} 
              onClick={() => handle_approve(record.id)}
            >
              Duyệt
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={container_style}>
      <Card title={<Title level={3} style={title_style}><SafetyOutlined /> Phê duyệt Đối tác & Khách sạn</Title>}>
        <Tabs defaultActiveKey="1" items={[
          { 
            key: '1', 
            label: 'Yêu cầu chờ duyệt', 
            children: <Table columns={table_columns} dataSource={requests.filter(r => r.status === 'Đang chờ')} rowKey="id" /> 
          },
          { 
            key: '2', 
            label: 'Tất cả đối tác', 
            children: <Table columns={table_columns} dataSource={requests} rowKey="id" /> 
          },
        ]} />
      </Card>

      <Modal
        title="Chi tiết hồ sơ đăng ký"
        open={is_modal_open}
        onCancel={() => set_is_modal_open(false)}
        footer={[
          <Button key="back" onClick={() => set_is_modal_open(false)}>Đóng</Button>,
          selected_partner?.status === 'Đang chờ' && (
            <Button key="reject" danger onClick={() => handle_reject(selected_partner.id)}>Từ chối</Button>
          ),
          selected_partner?.status === 'Đang chờ' && (
            <Button key="approve" type="primary" onClick={() => handle_approve(selected_partner.id)}>Duyệt hồ sơ</Button>
          ),
        ]}
        width={700}
      >
        {selected_partner && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên cơ sở">{selected_partner.name}</Descriptions.Item>
            <Descriptions.Item label="Chủ sở hữu">{selected_partner.owner || 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ kinh doanh">{selected_partner.address}</Descriptions.Item>
            <Descriptions.Item label="Mô tả">{selected_partner.description || 'Không có mô tả'}</Descriptions.Item>
            <Descriptions.Item label="Giấy phép kinh doanh">
              <Badge status="processing" text="Đã xác thực thông tin" />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

const container_style = { padding: '24px' };
const title_style = { margin: 0 };

export default AdminPartners;