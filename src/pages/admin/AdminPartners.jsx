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

  // 1. Đồng bộ dữ liệu từ localStorage (Dùng chung key 'ALL_HOTELS' với trang Partner)
  const load_partners_data = () => {
    // Đọc từ localStorage để lấy dữ liệu mới nhất mà Partner vừa đăng ký
    const all_hotels = JSON.parse(localStorage.getItem('ALL_HOTELS')) || [];
    set_partner_list(all_hotels);
    
    // Cập nhật lại thông tin trong Modal nếu đang mở để tránh lệch data
    if (selected_partner) {
      const updated_selected = all_hotels.find(h => h.id_hotel === selected_partner.id_hotel);
      if (updated_selected) set_selected_partner(updated_selected);
    }
  };

  useEffect(() => {
    load_partners_data();
    // Lắng nghe sự kiện storage để cập nhật UI ngay lập tức khi tab khác (Partner) thêm data
    window.addEventListener('storage', load_partners_data);
    return () => window.removeEventListener('storage', load_partners_data);
  }, [selected_partner]);

  // 2. Logic: Phê duyệt (Cập nhật status sang 'active')
  const handle_approve_partner = (hotel_id) => {
    Modal.confirm({
      title: 'Xác nhận phê duyệt đối tác?',
      content: 'Sau khi duyệt, khách sạn này sẽ chính thức hiển thị và hoạt động trên hệ thống.',
      okText: 'Phê duyệt',
      cancelText: 'Hủy',
      centered: true,
      onOk: () => {
        const all_hotels = JSON.parse(localStorage.getItem('ALL_HOTELS')) || [];
        const updated_data = all_hotels.map(item =>
          item.id_hotel === hotel_id ? { ...item, status: 'active' } : item
        );
        
        save_and_sync(updated_data, 'Đã phê duyệt khách sạn thành công!');
      }
    });
  };

  // 3. Logic: Từ chối
  const handle_reject_partner = (hotel_id) => {
    Modal.confirm({
      title: 'Từ chối hồ sơ?',
      content: 'Bạn có chắc chắn muốn từ chối yêu cầu đăng ký này?',
      okText: 'Từ chối',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      onOk: () => {
        const all_hotels = JSON.parse(localStorage.getItem('ALL_HOTELS')) || [];
        const updated_data = all_hotels.map(item => 
          item.id_hotel === hotel_id ? { ...item, status: 'rejected' } : item
        );
        
        save_and_sync(updated_data, 'Đã từ chối hồ sơ đối tác.');
      }
    });
  };

  const save_and_sync = (data, success_msg) => {
    localStorage.setItem('ALL_HOTELS', JSON.stringify(data));
    set_partner_list(data);
    set_is_modal_open(false);
    antd_message.success(success_msg);
    window.dispatchEvent(new Event('storage'));
  };

  const columns = [
    { 
      title: 'Mã khách sạn', 
      dataIndex: 'id_hotel', 
      key: 'id_hotel',
      render: (id) => <Text code>{id}</Text>
    },
    { 
      title: 'Tên cơ sở', 
      dataIndex: 'hotel_name', 
      key: 'hotel_name',
      render: (text) => <Text strong>{text}</Text>
    },
    { 
      title: 'Loại hình', 
      dataIndex: 'type', 
      key: 'type',
      render: (type) => <Tag color="blue">{type?.toUpperCase()}</Tag>
    },
    { 
      title: 'Ngày gửi đơn', 
      dataIndex: 'created_at', 
      key: 'created_at',
      render: (date) => date || '12/04/2026'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = {
          'active': { color: 'green', text: 'ĐANG HOẠT ĐỘNG' }, 
          'pending': { color: 'orange', text: 'CHỜ DUYỆT' },
          'rejected': { color: 'red', text: 'TỪ CHỐI' },
        };
        const current = config[status] || { color: 'default', text: 'CHỜ DUYỆT' };
        return <Tag color={current.color} style={{fontWeight: 600}}>{current.text}</Tag>;
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
              onClick={() => handle_approve_partner(record.id_hotel)}
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
        bordered={false}
        style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
        title={<Title level={4} style={{margin:0}}><SafetyOutlined /> Phê duyệt yêu cầu đối tác</Title>}
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
              children: <Table columns={columns} dataSource={partner_list.filter(p => p.status === 'pending')} rowKey="id_hotel" />
            },
            {
              key: '2',
              label: 'Tất cả đối tác',
              children: <Table columns={columns} dataSource={partner_list} rowKey="id_hotel" />
            },
          ]} 
        />
      </Card>

      <Modal
        title={<Space><EyeOutlined /> Chi tiết hồ sơ đăng ký</Space>}
        open={is_modal_open}
        onCancel={() => set_is_modal_open(false)}
        width={700}
        centered
        footer={[
          <Button key="close" onClick={() => set_is_modal_open(false)}>Đóng</Button>,
          selected_partner?.status === 'pending' && (
            <Button key="reject" danger icon={<CloseCircleOutlined />} onClick={() => handle_reject_partner(selected_partner.id_hotel)}>
              Từ chối
            </Button>
          ),
          selected_partner?.status === 'pending' && (
            <Button key="approve" type="primary" icon={<CheckCircleOutlined />} onClick={() => handle_approve_partner(selected_partner.id_hotel)}>
              Duyệt yêu cầu
            </Button>
          ),
        ]}
      >
        {selected_partner ? (
          <Descriptions bordered column={2} size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="Tên khách sạn" span={2}>{selected_partner.hotel_name}</Descriptions.Item>
            <Descriptions.Item label="Mã định danh">{selected_partner.id_hotel}</Descriptions.Item>
            <Descriptions.Item label="Hạng sao">{selected_partner.rate_star} ⭐</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={2}>{selected_partner.address}</Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>{selected_partner.description || 'Không có mô tả chi tiết.'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Badge 
                status={selected_partner.status === 'active' ? 'success' : (selected_partner.status === 'rejected' ? 'error' : 'warning')} 
                text={selected_partner.status === 'active' ? 'Đã hoạt động' : (selected_partner.status === 'rejected' ? 'Đã từ chối' : 'Chờ phê duyệt')} 
              />
            </Descriptions.Item>
            <Descriptions.Item label="Xác minh">
              <Tag color="cyan">Hồ sơ hợp lệ</Tag>
            </Descriptions.Item>
          </Descriptions>
        ) : <Empty />}
      </Modal>
    </div>
  );
};

export default AdminPartners;