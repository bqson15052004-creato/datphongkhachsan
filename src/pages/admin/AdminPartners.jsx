import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Button, Space, Card, Typography,
  Modal, Descriptions, Badge, Tabs, App as AntApp, Empty, Image, Row, Col
} from 'antd';
import {
  CheckCircleOutlined, EyeOutlined, SafetyOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminPartners = () => {
  const { message: antd_message } = AntApp.useApp();
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [selected_partner, set_selected_partner] = useState(null);
  const [partner_list, set_partner_list] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Số dòng mỗi trang
  // 1. Đồng bộ dữ liệu từ localStorage
  const load_partners_data = () => {
    const all_hotels = JSON.parse(localStorage.getItem('ALL_HOTELS')) || [];
    set_partner_list(all_hotels);
  };

  // SỬA LỖI TẠI ĐÂY: Bỏ selected_partner khỏi dependency để tránh vòng lặp re-render
  useEffect(() => {
    load_partners_data();
    window.addEventListener('storage', load_partners_data);
    return () => window.removeEventListener('storage', load_partners_data);
  }, []); 

  // Cập nhật lại thông tin hiển thị trong Modal nếu danh sách tổng thay đổi
  useEffect(() => {
    if (selected_partner && is_modal_open) {
      const updated = partner_list.find(h => h.id_hotel === selected_partner.id_hotel);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selected_partner)) {
        set_selected_partner(updated);
      }
    }
  }, [partner_list, is_modal_open, selected_partner]);

  // 2. Logic: Phê duyệt
  const handle_approve_partner = (hotel_id) => {
    Modal.confirm({
      title: 'Xác nhận phê duyệt đối tác?',
      content: 'Sau khi duyệt, khách sạn này sẽ chính thức hiển thị và hoạt động trên hệ thống.',
      okText: 'Xác nhận duyệt',
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
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center',
      render: (_, __, index) => (
        <Text strong>{(currentPage - 1) * pageSize + index + 1}</Text>
      ),
    },
    { 
      title: 'Mã khách sạn', 
      dataIndex: 'id_hotel', 
      key: 'id_hotel',
      width: 100,
      align: 'center',
      render: (id) => <Text code>{id}</Text>
    },
    { 
      title: 'Tên cơ sở', 
      dataIndex: 'hotel_name', 
      key: 'hotel_name',
      width: 200,
      align: 'center',
      render: (text) => <Text strong>{text}</Text>
    },
    { 
      title: 'Loại hình', 
      dataIndex: 'type', 
      key: 'type',
      width: 120,
      align: 'center',
      render: (type) => <Tag color="blue">{type?.toUpperCase()}</Tag>
    },
    { 
      title: 'Ngày gửi đơn', 
      dataIndex: 'created_at', 
      key: 'created_at',
      width: 150,
      align: 'center',
      render: (date) => date || '12/04/2026'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 180,
      align: 'center',
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
      width: 220,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => { 
              set_selected_partner(record); 
              set_is_modal_open(true); 
            }}
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
    <div style={{ padding: '20px', background: '#f5f7fa', minHeight: '100vh' }}>
      <Card variant={false} style={{ marginBottom: 20, borderRadius: 12 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}><SafetyOutlined /> Phê duyệt yêu cầu đối tác</Title>
          </Col>
        </Row>
      </Card>
      <Card 
        bordered={false}
        style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
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
        width={750}
        centered
        footer={[
          <Button key="close" onClick={() => set_is_modal_open(false)}>Đóng</Button>,
        ]}
      >
        {selected_partner ? (
          <div style={{ marginTop: 10 }}>
            <div style={{ marginBottom: 20, textAlign: 'center' }}>
              <Image
                src={selected_partner.image_url}
                alt="hotel"
                style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 12 }}
                fallback="https://via.placeholder.com/800x400?text=No+Hotel+Image"
              />
            </div>

            <Row gutter={[16, 16]}>
              <Col span={14}>
                <Descriptions 
                  bordered column={1}
                  size="small" 
                  labelStyle={{ width: '30%' }} 
                  contentStyle={{ width: '70%' }}
                >
                  <Descriptions.Item label="Tên khách sạn">{selected_partner.hotel_name}</Descriptions.Item>
                  <Descriptions.Item label="Loại hình">
                    <Tag color="blue">{selected_partner.type?.toUpperCase()}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Hạng sao">{selected_partner.rate_star} ⭐</Descriptions.Item>
                  <Descriptions.Item label="Chiết khấu">{selected_partner.discount || '0'}%</Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">{selected_partner.address}</Descriptions.Item>
                  <Descriptions.Item label="Mô tả khách sạn" span={3}>
                    <div style={{ minHeight: 60 }}>{selected_partner.description || 'Không có mô tả.'}</div>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </div>
        ) : <Empty />}
      </Modal>
    </div>
  );
};

export default AdminPartners;