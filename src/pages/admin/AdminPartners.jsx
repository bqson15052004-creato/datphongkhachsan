import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Button, Space, Card, Typography,
  Modal, Descriptions, Badge, Tabs, App as AntApp, Empty
} from 'antd';
import {
  CheckCircleOutlined, EyeOutlined, SafetyOutlined, CloseCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminPartners = () => {
  const { message: antd_message } = AntApp.useApp();
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [selected_partner, set_selected_partner] = useState(null);
  const [partner_list, set_partner_list] = useState([]);

  // 1. Đồng bộ dữ liệu từ LocalStorage
  const load_partners_data = () => {
    const all_hotels = JSON.parse(localStorage.getItem('all_hotels')) || [];
    set_partner_list(all_hotels);
  };

  useEffect(() => {
    load_partners_data();
    // Lắng nghe thay đổi từ các tab khác (nếu có)
    window.addEventListener('storage', load_partners_data);
    return () => window.removeEventListener('storage', load_partners_data);
  }, []);

  // 2. Logic: Phê duyệt (Cập nhật status sang 'approved')
  const handle_approve_partner = (partner_id) => {
    Modal.confirm({
      title: 'Xác nhận phê duyệt đối tác?',
      content: 'Sau khi duyệt, khách sạn này sẽ chính thức hoạt động trên hệ thống.',
      okText: 'Phê duyệt',
      cancelText: 'Hủy',
      onOk: () => {
        const all_hotels = JSON.parse(localStorage.getItem('all_hotels')) || [];
        const updated_data = all_hotels.map(item =>
          item.id === partner_id ? { ...item, status: 'approved' } : item
        );
        
        save_and_sync(updated_data, 'Đã kích hoạt trạng thái hoạt động cho đối tác!');
      }
    });
  };

  // 3. Logic: Từ chối (Cập nhật status sang 'rejected' hoặc xóa)
  const handle_reject_partner = (partner_id) => {
    Modal.confirm({
      title: 'Từ chối hồ sơ?',
      content: 'Bạn có chắc chắn muốn từ chối yêu cầu đăng ký này?',
      okText: 'Từ chối',
      okType: 'danger',
      onOk: () => {
        const all_hotels = JSON.parse(localStorage.getItem('all_hotels')) || [];
        // Thay vì xóa hẳn, ta nên chuyển status sang 'rejected' để lưu vết
        const updated_data = all_hotels.map(item => 
          item.id === partner_id ? { ...item, status: 'rejected' } : item
        );
        
        save_and_sync(updated_data, 'Đã từ chối hồ sơ đối tác.');
      }
    });
  };

  const save_and_sync = (data, success_msg) => {
    localStorage.setItem('all_hotels', JSON.stringify(data));
    set_partner_list(data);
    set_is_modal_open(false);
    antd_message.success(success_msg);
    // Bắn event để Header (AdminLayout) cập nhật lại số lượng badge
    window.dispatchEvent(new Event('storage'));
  };

  const columns = [
    { 
      title: 'Mã đối tác', 
      dataIndex: 'id', 
      key: 'id',
      render: (id) => <Text code>{id}</Text>
    },
    { 
      title: 'Tên cơ sở', 
      dataIndex: 'name', 
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    { title: 'Chủ sở hữu', dataIndex: 'owner', key: 'owner' },
    { 
      title: 'Ngày đăng ký', 
      dataIndex: 'date', 
      key: 'date',
      render: (date) => date || 'N/A'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = {
          'approved': { color: 'green', text: 'HOẠT ĐỘNG' },
          'pending': { color: 'orange', text: 'CHỜ DUYỆT' },
          'rejected': { color: 'red', text: 'TỪ CHỐI' },
        };
        const current = config[status] || { color: 'default', text: status };
        return <Tag color={current.color} style={{fontWeight: 500}}>{current.text}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => { set_selected_partner(record); set_is_modal_open(true); }}
          >
            Chi tiết
          </Button>
          {record.status === 'pending' && (
            <Button
              size="small"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handle_approve_partner(record.id)}
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
      <Card 
        variant={false}
        style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
        title={<Title level={4} style={{margin:0}}><SafetyOutlined /> Quản lý Đối tác & Khách sạn</Title>}
      >
        <Tabs 
          defaultActiveKey="1" 
          items={[
            {
              key: '1',
              label: (
                <span>
                  Yêu cầu chờ duyệt 
                  <Badge 
                    count={partner_list.filter(p => p.status === 'pending').length} 
                    style={{ marginLeft: 8, backgroundColor: '#faad14' }} 
                  />
                </span>
              ),
              children: <Table columns={columns} dataSource={partner_list.filter(p => p.status === 'pending')} rowKey="id" />
            },
            {
              key: '2',
              label: 'Tất cả đối tác',
              children: <Table columns={columns} dataSource={partner_list} rowKey="id" />
            },
          ]} 
        />
      </Card>

      <Modal
        title={<Space><EyeOutlined /> Chi tiết hồ sơ đối tác</Space>}
        open={is_modal_open}
        onCancel={() => set_is_modal_open(false)}
        width={700}
        footer={[
          <Button key="close" onClick={() => set_is_modal_open(false)}>Đóng</Button>,
          selected_partner?.status === 'pending' && (
            <Button key="reject" danger icon={<CloseCircleOutlined />} onClick={() => handle_reject_partner(selected_partner.id)}>
              Từ chối hồ sơ
            </Button>
          ),
          selected_partner?.status === 'pending' && (
            <Button key="approve" type="primary" icon={<CheckCircleOutlined />} onClick={() => handle_approve_partner(selected_partner.id)}>
              Phê duyệt ngay
            </Button>
          ),
        ]}
      >
        {selected_partner ? (
          <Descriptions bordered column={2} size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="Tên cơ sở" span={2}>{selected_partner.name}</Descriptions.Item>
            <Descriptions.Item label="Mã đối tác">{selected_partner.id}</Descriptions.Item>
            <Descriptions.Item label="Chủ sở hữu">{selected_partner.owner}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={2}>{selected_partner.address}</Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>{selected_partner.description || 'Chưa có mô tả'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Badge 
                status={selected_partner.status === 'approved' ? 'success' : (selected_partner.status === 'rejected' ? 'error' : 'warning')} 
                text={selected_partner.status === 'approved' ? 'Đã kích hoạt' : (selected_partner.status === 'rejected' ? 'Đã từ chối' : 'Đang chờ')} 
              />
            </Descriptions.Item>
            <Descriptions.Item label="Hồ sơ pháp lý">
              <Tag color="cyan">HỢP LỆ</Tag>
            </Descriptions.Item>
          </Descriptions>
        ) : <Empty />}
      </Modal>
    </div>
  );
};

export default AdminPartners;