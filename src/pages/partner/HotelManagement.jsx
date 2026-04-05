import React, { useState, useEffect } from 'react';
import {
  Table, Button, Card, Tag, Space, Modal,
  Form, Input, Select, Typography, Row, Col, App as AntApp, Popconfirm, Avatar, Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ShopOutlined, 
  EnvironmentOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';

const { Title, Text } = Typography;
const { TextArea } = Input;

const HotelManagement = () => {
  const navigate = useNavigate();
  const { message: antdMessage } = AntApp.useApp();
  const [form] = Form.useForm();
  
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // 1. Lấy danh sách khách sạn (Xử lý cả lỗi kết nối BE)
  const fetchMyHotels = async () => {
    setLoading(true);
    try {
      // Gọi API thật từ Backend
      const response = await axiosClient.get('/hotels/my-hotels/');
      setHotels(response);
    } catch (error) {
      console.error("Lỗi kết nối Backend, đang dùng dữ liệu mẫu để hiển thị UI:", error);
      
      // MOCK DATA: Giúp ông vẫn thấy giao diện khi chưa bật Server Backend
      const mockData = [
        {
          id_hotel: 1,
          name: 'Vinpearl Luxury Nha Trang',
          address: 'Đảo Hòn Tre, Nha Trang, Khánh Hòa',
          type: 'resort',
          status: 'approved',
          image: 'https://img.freepik.com/free-photo/luxury-pool-villa-spectacular-contemporary-design-digital-art-real-estate-home-house-property-ge_1258-150749.jpg',
          description: 'Khu nghỉ dưỡng cao cấp ven biển.'
        },
        {
          id_hotel: 2,
          name: 'Hôtel des Arts Saigon',
          address: '76-78 Nguyễn Thị Minh Khai, Quận 3, TP.HCM',
          type: 'hotel',
          status: 'pending',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
          description: 'Khách sạn phong cách nghệ thuật Indochine.'
        }
      ];
      setHotels(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyHotels();
  }, []);

  // 2. Mở Modal Sửa
  const handleEdit = (record) => {
    setEditingId(record.id_hotel);
    form.setFieldsValue({
      name: record.name,
      type: record.type || 'hotel',
      address: record.address,
      description: record.description,
      image: record.image
    });
    setIsModalOpen(true);
  };

  // 3. Xử lý Xóa
  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/hotels/manage/${id}/`);
      antdMessage.success('Đã xóa cơ sở thành công');
      fetchMyHotels();
    } catch (error) {
      antdMessage.error('Không thể xóa (Lỗi kết nối server)');
    }
  };

  // 4. Xử lý Submit (Thêm/Sửa)
  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (editingId) {
        await axiosClient.put(`/hotels/manage/${editingId}/`, values);
        antdMessage.success('Cập nhật thành công!');
      } else {
        await axiosClient.post('/hotels/manage/', { ...values, status: 'pending' });
        antdMessage.success('Đã gửi yêu cầu đăng ký mới!');
      }
      setIsModalOpen(false);
      setEditingId(null);
      form.resetFields();
      fetchMyHotels();
    } catch (error) {
      antdMessage.error('Thao tác thất bại (Vui lòng kiểm tra Backend)');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      title: 'Hình ảnh', 
      dataIndex: 'image', 
      key: 'image',
      width: 100,
      render: (src) => <Avatar shape="square" size={64} src={src} icon={<ShopOutlined />} />
    },
    { 
      title: 'Thông tin cơ sở', 
      key: 'hotel_info',
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: 15, display: 'block' }}>{record.name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <EnvironmentOutlined /> {record.address}
          </Text>
        </div>
      )
    },
    { 
      title: 'Loại', 
      dataIndex: 'type', 
      key: 'type',
      render: (type) => <Tag color="blue">{type?.toUpperCase()}</Tag>
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        const configs = {
          approved: { color: 'success', text: 'ĐÃ DUYỆT' },
          pending: { color: 'warning', text: 'ĐANG CHỜ' },
          rejected: { color: 'error', text: 'BỊ TỪ CHỐI' }
        };
        const config = configs[status] || configs.pending;
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Quản lý',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" ghost size="small"
            icon={<ShopOutlined />} 
            onClick={() => navigate(`/partner/hotels/${record.id_hotel}/rooms`)}
          >
            Phòng
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Xóa khách sạn?" onConfirm={() => handleDelete(record.id_hotel)}>
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0px' }}>
      <Card
        bordered={false}
        title={<Title level={4} style={{ margin: 0 }}>Cơ sở lưu trú của tôi</Title>}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { setEditingId(null); form.resetFields(); setIsModalOpen(true); }}
          >
            Đăng ký thêm
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={hotels} 
          rowKey="id_hotel" 
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title={editingId ? 'Cập nhật thông tin' : 'Đăng ký cơ sở mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
        okText="Xác nhận"
        cancelText="Hủy"
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="name" label="Tên khách sạn" rules={[{ required: true }]}>
                <Input placeholder="Tên cơ sở..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label="Loại hình" initialValue="hotel">
                <Select options={[{value:'hotel', label:'Khách sạn'}, {value:'resort', label:'Resort'}, {value:'homestay', label:'Homestay'}]} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
            <Input prefix={<EnvironmentOutlined />} placeholder="Địa chỉ chi tiết..." />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="image" label="Link ảnh">
            <Input placeholder="https://..." />
          </Form.Item>
          <div style={{ background: '#fff7e6', padding: '8px', borderRadius: '4px' }}>
            <Text type="warning" style={{ fontSize: '12px' }}>
              <InfoCircleOutlined /> Yêu cầu mới sẽ được Admin kiểm duyệt trong 24h.
            </Text>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default HotelManagement;