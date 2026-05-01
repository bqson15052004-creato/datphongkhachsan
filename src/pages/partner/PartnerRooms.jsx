import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Card, Space, Modal, 
  Form, Input, Typography, Row, Col, 
  App as AntApp, Empty, Tag, Upload, Switch 
} from 'antd';
import { 
  HomeOutlined,
  PlusOutlined, 
  EditOutlined, 
  LockOutlined, 
  UnlockOutlined,
  FileTextOutlined,
  SearchOutlined
} from '@ant-design/icons';
import axiosClient from '../../services/axiosClient';
import CloudinaryUpload from '../../components/common/CloudinaryUpload';

const { Title, Text } = Typography;

const PartnerRooms = () => {
  // Sửa lại cú pháp useState và lỗi chính tả inageUrl -> imageUrl
  const [imageUrl, setImageUrl] = useState(''); 
  const { message: antdMessage, modal: antdModal } = AntApp.useApp();
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [editing_room, set_editing_room] = useState(null);
  const [form] = Form.useForm();
  
  const [selected_hotel_id, set_selected_hotel_id] = useState('H001');
  const [room_list, set_room_list] = useState([]);
  const [is_loading, set_is_loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetch_rooms = async (hotel_id) => {
    set_is_loading(true);
    try {
      const response = await axiosClient.get(`/rooms?hotel_id=${hotel_id}`);
      const data = response.data || response;
      set_room_list(Array.isArray(data) ? data : []);
    } catch (error) {
      const mock_rooms = [
        {
          _id: 'R001',
          room_type: 'Deluxe Ocean View',
          description: 'Phòng hướng biển cực đẹp, đầy đủ tiện nghi, phù hợp cho cặp đôi.',
          image: 'https://via.placeholder.com/150',
          status: 'active' 
        },
        {
          _id: 'R002',
          room_type: 'Presidential Suite',
          description: 'Hạng sang nhất khách sạn, bồn tắm dát vàng, view toàn thành phố.',
          image: 'https://via.placeholder.com/150',
          status: 'locked' 
        }
      ];
      set_room_list(mock_rooms);
    } finally {
      set_is_loading(false);
    }
  };

  useEffect(() => {
    if (selected_hotel_id) fetch_rooms(selected_hotel_id);
  }, [selected_hotel_id]);

  const handle_toggle_lock = (record) => {
    const is_currently_locked = record.status === 'locked';
    const action_text = is_currently_locked ? 'mở khóa' : 'khóa';

    antdModal.confirm({
      title: `Xác nhận ${action_text} loại phòng?`,
      icon: is_currently_locked ? <UnlockOutlined style={{ color: '#52c41a' }} /> : <LockOutlined style={{ color: '#ff4d4f' }} />,
      content: `Bạn chắc chắn muốn ${action_text} loại phòng "${record.room_type}" chứ?`,
      okText: `Xác nhận ${action_text}`,
      okType: is_currently_locked ? 'primary' : 'danger',
      onOk: async () => {
        try {
          const new_status = is_currently_locked ? 'active' : 'locked';
          set_room_list(prev => prev.map(item => 
            item._id === record._id ? { ...item, status: new_status } : item
          ));
          antdMessage.success(`Đã ${action_text} loại phòng thành công!`);
        } catch (error) {
          antdMessage.error("Không thể thực hiện thao tác");
        }
      },
    });
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
      title: 'Hình ảnh', 
      dataIndex: 'image', 
      key: 'image',
      width: 100,
      render: (url) => url ? <img src={url} alt="room" style={{ width: 60, height: 40, borderRadius: 4, objectFit: 'cover' }} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} style={{ margin: 0 }} />
    },
    { 
      title: 'Loại Phòng', 
      dataIndex: 'room_type', 
      key: 'room_type', 
      width: '20%',
      render: (text) => <Text strong style={{ color: '#1890ff' }}>{text}</Text>
    },
    { 
      title: 'Mô tả chi tiết', 
      dataIndex: 'description', 
      key: 'description',
      render: (text) => <Text type="secondary" ellipsis={{ tooltip: text }}>{text || 'Chưa có mô tả'}</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 'locked' ? 'error' : 'success'} style={{ fontWeight: 500 }}>
          {status === 'locked' ? 'ĐÃ KHÓA' : 'HOẠT ĐỘNG'}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button 
            type="text"
            icon={<EditOutlined style={{ color: record.status === 'locked' ? '#d9d9d9' : 'blue' }} />} 
            disabled={record.status === 'locked'}
            onClick={() => {
              set_editing_room(record);
              form.setFieldsValue(record);
              setImageUrl(record.image || ''); // Đưa ảnh cũ lên preview khi sửa
              set_is_modal_open(true);
            }} 
          />
          <Button 
            type="text"
            icon={record.status === 'locked' ? <LockOutlined style={{ color: 'red' }} /> : <UnlockOutlined style={{ color: 'blue' }} />} 
            onClick={() => handle_toggle_lock(record)}
          />
        </Space>
      ),
    },
  ];

  const on_finish = async (values) => {
    set_is_loading(true);
    try {
      // Gộp link ảnh từ Cloudinary vào payload gửi xuống DB
      const payload = { 
        ...values, 
        image: imageUrl, 
        hotel_id: selected_hotel_id 
      };

      if (editing_room) {
        // await axiosClient.put(`/rooms/${editing_room._id}`, payload);
        antdMessage.success("Cập nhật thành công!");
      } else {
        // await axiosClient.post('/rooms', payload);
        antdMessage.success("Thêm mới thành công!");
      }
      fetch_rooms(selected_hotel_id);
      set_is_modal_open(false);
      setImageUrl(''); // Reset ảnh sau khi xong
    } catch (error) {
      antdMessage.error("Lỗi: Không thể lưu");
    } finally {
      set_is_loading(false);
    }
  };

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Card variant={false} style={{ marginBottom: 20, borderRadius: 12 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                <HomeOutlined /> Quản lý loại phòng
              </Title>
              <Text type="secondary">Cập nhật danh mục và mô tả chi tiết các loại phòng hiện có</Text>
            </Col>
          </Row>
        </Card>

        <Card 
          variant={false} 
          style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          {/* Phần điều khiển: Tìm kiếm và Thêm mới */}
          <Row gutter={16} style={{ marginBottom: 20 }} justify="space-between">
            <Col span={12}>
              <Input 
                placeholder="Tìm kiếm loại phòng..." 
                prefix={<SearchOutlined />} 
                onChange={e => setSearchText(e.target.value)} 
                allowClear
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Col>
            <Col>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => { 
                  set_editing_room(null); 
                  form.resetFields(); 
                  setImageUrl(''); // Reset ảnh khi thêm mới
                  set_is_modal_open(true); 
                }} 
                size="large"
                style={{ borderRadius: 8, fontWeight: 500 }}
              >
                Thêm loại phòng mới
              </Button>
            </Col>
          </Row>
          <Table 
            columns={columns} 
            dataSource={room_list}
            loading={is_loading}
            rowKey="_id" 
            pagination={{ 
              current: currentPage,
              pageSize: pageSize,
              onChange: (page) => setCurrentPage(page),
              showTotal: (total) => `Tổng cộng ${total} loại phòng`,
            }}
          />
        </Card>

        <Modal 
          title={editing_room ? "Cập nhật loại phòng" : "Tạo loại phòng mới"}
          open={is_modal_open} 
          onCancel={() => set_is_modal_open(false)}
          onOk={() => form.submit()} 
          confirmLoading={is_loading}
          width={600} 
          centered
        >
          <Form form={form} layout="vertical" onFinish={on_finish} style={{ marginTop: 16 }}>
            <Form.Item name="room_type" label="Tên loại phòng" rules={[{ required: true, message: 'Nhập tên!' }]}>
              <Input placeholder="Ví dụ: Deluxe King Room" prefix={<FileTextOutlined />} />
            </Form.Item>

            {/* PHẦN CLOUDINARY UPDATE Ở ĐÂY */}
            <Form.Item label="Hình ảnh minh họa">
              <CloudinaryUpload onUploadSuccess={(url) => setImageUrl(url)} />
            </Form.Item>

            <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Nhập mô tả!' }]}>
              <Input.TextArea rows={4} placeholder="Mô tả chi tiết..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default PartnerRooms;