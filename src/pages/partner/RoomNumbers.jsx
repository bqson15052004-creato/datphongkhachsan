import React, { useState } from 'react';
import { 
  Table, Card, Select, Button, Tag, Space, 
  Typography, Input, Modal, Form, InputNumber, 
  Switch, message, Row, Col, Upload, Avatar
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, HomeOutlined, 
  EditOutlined, LockOutlined, UnlockOutlined,
  PictureOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';

// Import Cloudinary
import CloudinaryUpload from '../../components/common/CloudinaryUpload';
// Data mẫu
import { MOCK_HOTELS, MOCK_ROOMS, ALL_AMENITIES } from '../../constants/mockData.jsx'; 

const { Title, Text } = Typography;
const { Option } = Select;

const RoomNumbers = () => {
  const [form] = Form.useForm();
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [selectedHotel, setSelectedHotel] = useState(MOCK_HOTELS[0]?.id_hotel);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // State hứng link từ Cloudinary
  const [imageUrl, setImageUrl] = useState('');

  // --- HELPER BIẾN FILE THÀNH BASE64 ---
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // --- LOGIC XỬ LÝ KHÓA / MỞ KHÓA (CÓ ALERT) ---
  const handleToggleStatus = (record) => {
    const isAvailable = record.status === 'available';
    const actionText = isAvailable ? 'KHÓA' : 'MỞ KHÓA';
    const color = isAvailable ? '#ff4d4f' : '#52c41a';

    Modal.confirm({
      title: `Xác nhận ${actionText} phòng?`,
      icon: <ExclamationCircleOutlined style={{ color }} />,
      content: `Bạn chắc chắn muốn ${actionText} phòng số ${record.room_number} không?`,
      okText: 'Đồng ý',
      okType: isAvailable ? 'danger' : 'primary',
      cancelText: 'Hủy bỏ',
      centered: true,
      onOk() {
        const nextStatus = isAvailable ? 'booked' : 'available';
        setRooms(prev => prev.map(r => 
          r.id_room === record.id_room ? { ...r, status: nextStatus } : r
        ));
        message.success(`Đã ${actionText} phòng ${record.room_number} thành công!`);
      },
    });
  };

  // --- XỬ LÝ FORM SUBMIT ---
  const handleSubmit = async (values) => {
    // Ưu tiên link từ Cloudinary trước
    let finalImage = imageUrl || values.image_url;

    if (!imageUrl && fileList.length > 0 && fileList[0].originFileObj) {
      finalImage = await getBase64(fileList[0].originFileObj);
    }

    if (editingId) {
      setRooms(prev => prev.map(r => r.id_room === editingId ? { ...r, ...values, image_url: finalImage } : r));
      message.success(`Đã cập nhật phòng ${values.room_number}`);
    } else {
      const newRoom = {
        ...values,
        id_room: Date.now(),
        id_hotel: selectedHotel,
        image_url: finalImage || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
        status: values.status ? 'available' : 'booked'
      };
      setRooms([newRoom, ...rooms]);
      message.success(`Đã thêm phòng ${values.room_number} mới!`);
    }
    handleCancel();
  };

  const handleEdit = (record) => {
    setEditingId(record.id_room);
    form.setFieldsValue({
      ...record,
      status: record.status === 'available'
    });
    setFileList(record.image_url ? [{ uid: '-1', url: record.image_url, status: 'done' }] : []);
    setImageUrl(record.image_url || '');
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
    setFileList([]);
    setImageUrl('');
  };

  const filteredRooms = rooms.filter(room => 
    room.id_hotel === selectedHotel && 
    room.room_number.toString().toLowerCase().includes(searchText.toLowerCase())
  );

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
      dataIndex: 'image_url', 
      width: 80,
      render: (src) => <Avatar shape="square" size={60} src={src} icon={<PictureOutlined />} />
    },
    {
      title: 'Số phòng',
      dataIndex: 'room_number',
      key: 'room_number',
      render: (text) => <Text strong style={{ color: '#1890ff' }}>{text}</Text>,
    },
    { title: 'Loại phòng', dataIndex: 'room_type', key: 'room_type' },
    {
      title: 'Tiện nghi',
      dataIndex: 'amenities',
      key: 'amenities',
      width: 200,
      render: (amenityIds) => (
        <Space size={[0, 4]} wrap>
          {amenityIds?.map(id => {
            const info = ALL_AMENITIES.find(a => a.id === id);
            return (
              <Tag color="blue" key={id}>
                {info ? info.name : id}
              </Tag>
            );
          })}
        </Space>
      )
    },
    {
      title: 'Giá/Đêm',
      dataIndex: 'price_per_night',
      key: 'price_per_night',
      align: 'right',
      render: (price) => <Text strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => (
        <Tag color={status === 'available' ? 'green' : 'red'} style={{ borderRadius: '10px' }}>
          {status === 'available' ? 'SẴN SÀNG' : 'ĐÃ KHÓA'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: 'blue', fontSize: '18px' }} />} 
            onClick={() => handleEdit(record)} 
          />
          <Button 
            type="text" 
            icon={
              record.status === 'available' 
                ? <UnlockOutlined style={{ color: 'blue', fontSize: '18px' }} />
                : <LockOutlined style={{ color: 'red', fontSize: '18px' }} />
            } 
            onClick={() => handleToggleStatus(record)} 
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
      <Card variant={false} style={{ marginBottom: 20, borderRadius: 12 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}><HomeOutlined /> Quản lý phòng</Title>
            <Text type="secondary">Cấu hình danh sách phòng cho khách sạn đã chọn</Text>
          </Col>
        </Row>
      </Card>

      <Card variant={false} style={{ borderRadius: 12 }}>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Select style={{ width: '100%' }} value={selectedHotel} onChange={setSelectedHotel}>
              {MOCK_HOTELS.map(h => <Option key={h.id_hotel} value={h.id_hotel}>{h.hotel_name}</Option>)}
            </Select>
          </Col>
          <Col span={8}>
            <Input placeholder="Tìm số phòng..." prefix={<SearchOutlined />} onChange={e => setSearchText(e.target.value)} />
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Thêm phòng mới</Button>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={filteredRooms} 
          rowKey="id_room" 
          pagination={{ 
            current: currentPage,
            pageSize: pageSize,
            onChange: (page) => setCurrentPage(page),
            showTotal: (total) => `Tổng cộng ${total} phòng`,
          }}
        />
      </Card>

      <Modal 
        title={editingId ? "Cập nhật thông tin phòng" : "Thêm phòng mới"} 
        open={isModalOpen} 
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingId ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        centered
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: true, amenities: [] }} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="room_number" label="Số phòng" rules={[{ required: true, message: 'Nhập số phòng!' }]}>
                <Input placeholder="VD: 101" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="room_type" label="Loại phòng" rules={[{ required: true, message: 'Chọn loại phòng!' }]}>
                <Select placeholder="Chọn loại">
                  <Option value="Deluxe Ocean View">Deluxe Ocean View</Option>
                  <Option value="Suite Family">Suite Family</Option>
                  <Option value="Presidential Villa">Presidential Villa</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="price_per_night" label="Giá mỗi đêm (VNĐ)" rules={[{ required: true, message: 'Nhập giá phòng!' }]}>
            <InputNumber 
              style={{ width: '100%' }} 
              formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={v => v.replace(/\D/g, '')}
            />
          </Form.Item>

          <Form.Item name="amenities" label="Tiện nghi phòng">
            <Select mode="multiple" placeholder="Chọn tiện nghi" allowClear>
              {ALL_AMENITIES.map(opt => (
                <Option key={opt.id} value={opt.id}>{opt.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Hình ảnh phòng">
            {/* Tích hợp Cloudinary */}
            <CloudinaryUpload onUploadSuccess={(url) => setImageUrl(url)} />
            {imageUrl && <img src={imageUrl} alt="preview" style={{ width: 100, marginTop: 10, display: 'block' }} />}

            <div style={{ marginTop: 10 }}>
              <Text type="secondary">Hoặc tải trực tiếp (Base64):</Text>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                beforeUpload={() => false}
                maxCount={1}
              >
                {fileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải ảnh</div>
                  </div>
                )}
              </Upload>
            </div>
          </Form.Item>

          <Form.Item name="status" label="Trạng thái sẵn sàng" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Khóa" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomNumbers;