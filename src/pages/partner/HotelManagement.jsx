import React, { useState, useEffect } from 'react';
import {
  Table, Button, Card, Tag, Space, Modal,
  Form, Input, Select, Typography, Row, Col, App as AntApp, Avatar, InputNumber, Upload
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  LockOutlined, 
  UnlockOutlined,
  ShopOutlined, 
  EnvironmentOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// ĐÃ CẬP NHẬT: Chỉ giữ lại các import cần thiết
import { MOCK_HOTELS, HOTEL_TYPES as MOCK_CATEGORIES } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;
const { TextArea } = Input;

const HotelManagement = () => {
  const navigate = useNavigate();
  const { message: antdMessage, modal: antdModal } = AntApp.useApp();
  const [form] = Form.useForm();
  
  const [hotels, setHotels] = useState([]);
  const [categories] = useState(MOCK_CATEGORIES); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const fetchMyHotels = () => {
    setLoading(true);
    setTimeout(() => {
      const user = JSON.parse(sessionStorage.getItem('user')) || {};
      let localData = JSON.parse(localStorage.getItem('ALL_HOTELS'));
      if (!localData) {
        localData = MOCK_HOTELS;
        localStorage.setItem('ALL_HOTELS', JSON.stringify(MOCK_HOTELS));
      }

      let displayData = localData;
      if (user.role === 'partner') {
        displayData = localData.filter(h => h.id_hotel === user.hotel_id || h.owner_id === user.id);
      }
      setHotels(displayData);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchMyHotels();
  }, []);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleToggleLock = (record) => {
    const isCurrentlyLocked = record.status === 'locked';
    const actionText = isCurrentlyLocked ? 'mở khóa' : 'khóa';

    antdModal.confirm({
      title: `Xác nhận ${actionText} khách sạn?`,
      icon: isCurrentlyLocked ? <UnlockOutlined style={{ color: '#52c41a' }} /> : <LockOutlined style={{ color: '#ff4d4f' }} />,
      content: `Bạn chắc chắn muốn ${actionText} "${record.hotel_name}" chứ?`,
      okText: `Xác nhận ${actionText}`,
      okType: isCurrentlyLocked ? 'primary' : 'danger',
      onOk: () => {
        const allHotels = JSON.parse(localStorage.getItem('ALL_HOTELS')) || [];
        const newStatus = isCurrentlyLocked ? 'active' : 'locked';
        
        const updatedList = allHotels.map(item => 
          item.id_hotel === record.id_hotel ? { ...item, status: newStatus } : item
        );
        
        localStorage.setItem('ALL_HOTELS', JSON.stringify(updatedList));
        setHotels(prev => prev.map(item => 
          item.id_hotel === record.id_hotel ? { ...item, status: newStatus } : item
        ));
        
        antdMessage.success(`Đã ${actionText} khách sạn thành công!`);
      },
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      let finalImageUrl = '';
      if (fileList.length > 0 && fileList[0].originFileObj) {
        finalImageUrl = await getBase64(fileList[0].originFileObj);
      } else if (fileList.length > 0 && fileList[0].url) {
        finalImageUrl = fileList[0].url; 
      } else {
        finalImageUrl = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'; 
      }

      setTimeout(() => {
        const allHotels = JSON.parse(localStorage.getItem('ALL_HOTELS')) || [];
        const user = JSON.parse(sessionStorage.getItem('user')) || {};

        if (editingId) {
          const updatedList = allHotels.map(h => 
            h.id_hotel === editingId ? { ...h, ...values, image_url: finalImageUrl } : h
          );
          localStorage.setItem('ALL_HOTELS', JSON.stringify(updatedList));
          setHotels(prev => prev.map(h => 
            h.id_hotel === editingId ? { ...h, ...values, image_url: finalImageUrl } : h
          ));
          antdMessage.success('Cập nhật thông tin thành công!');
        } else {
          const newHotel = {
            ...values,
            id_hotel: `H-${Date.now()}`,
            owner_id: user.id,
            status: 'pending',
            price_per_night: 0,
            image_url: finalImageUrl
          };
          const updatedList = [newHotel, ...allHotels];
          localStorage.setItem('ALL_HOTELS', JSON.stringify(updatedList));
          setHotels(prev => [newHotel, ...prev]);
          antdMessage.success('Đã gửi yêu cầu đăng ký mới cho Admin phê duyệt!');
        }
        setIsModalOpen(false);
        setEditingId(null);
        form.resetFields();
        setFileList([]); 
        setLoading(false);
      }, 500);
    } catch (error) {
      antdMessage.error("Có lỗi xảy ra khi xử lý ảnh!");
      setLoading(false);
    }
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
      dataIndex: 'image_url', 
      width: 100,
      render: (src) => <Avatar shape="square" size={64} src={src} icon={<ShopOutlined />} />
    },
    { 
      title: 'Thông tin khách sạn', 
      width: 300,
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: 15, display: 'block' }}>{record.hotel_name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <EnvironmentOutlined /> {record.address}
          </Text>
        </div>
      )
    },
    // ĐÃ XÓA: Cột Tiện nghi
    {
      title: 'Chiết khấu',
      dataIndex: 'discount',
      width: 100,
      align: 'center',
      render: (discount) => (
        <Tag color="cyan" style={{ fontSize: 14, padding: '2px 8px' }}>
          {discount ? `${discount}%` : '0%'}
        </Tag>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      width: 150,
      render: (status) => {
        const configs = {
          active: { color: 'success', text: 'ĐANG HOẠT ĐỘNG' },
          pending: { color: 'warning', text: 'CHỜ DUYỆT' },
          rejected: { color: 'error', text: 'BỊ TỪ CHỐI' },
          locked: { color: 'default', text: 'ĐÃ KHÓA' }, 
        };
        const config = configs[status] || configs.pending;
        return <Tag color={config.color} style={{ fontWeight: 'bold' }}>{config.text}</Tag>;
      }
    },
    {
      title: 'Hành động',
      align: 'right',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            type="text"
            icon={<EditOutlined style={{ color: record.status === 'locked' ? '#d9d9d9' : 'blue' }} />} 
            disabled={record.status === 'locked'} 
            onClick={() => {
              setEditingId(record.id_hotel);
              form.setFieldsValue({ 
                ...record, 
                type: record.type || 'hotel',
                discount: record.discount || 0
              });
              if (record.image_url) {
                setFileList([{ uid: '-1', name: 'image.png', status: 'done', url: record.image_url }]);
              } else {
                setFileList([]);
              }
              setIsModalOpen(true);
            }} 
          />
          <Button 
            size="small"
            type="text"
            icon={record.status === 'locked' ? <LockOutlined style={{ color: 'red' }} /> : <UnlockOutlined style={{ color: 'blue' }} />} 
            onClick={() => handleToggleLock(record)} 
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Frame trên: Tiêu đề */}
        <Card variant={false} style={{ marginBottom: 20, borderRadius: 12 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                <ShopOutlined /> Quản lý khách sạn
              </Title>
              <Text type="secondary">Quản lý thông tin và trạng thái các khách sạn</Text>
            </Col>
          </Row>
        </Card>

        {/* Frame dưới: Nút thêm mới nằm TRONG Card của bảng */}
        <Card 
          variant={false} 
          style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          title={<Text strong>Danh sách khách sạn</Text>}
          extra={
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => { 
                setEditingId(null); 
                form.resetFields(); 
                setFileList([]); 
                setIsModalOpen(true); 
              }}
              style={{ borderRadius: 8, height: 40 }}
            >
              Đăng ký khách sạn mới
            </Button>
          }
        >
          <Table 
            columns={columns} 
            dataSource={hotels}
            rowKey="id_hotel" 
            pagination={{ 
              current: currentPage,
              pageSize: pageSize,
              onChange: (page) => setCurrentPage(page),
              showTotal: (total) => `Tổng cộng ${total} khách sạn`,
            }}
          />
        </Card>

        {/* Modal Thêm/Sửa */}
        <Modal
          title={editingId ? 'Cập nhật thông tin khách sạn' : 'Đăng ký khách sạn mới'}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={() => form.submit()}
          confirmLoading={loading}
          okText={editingId ? "Cập nhật" : "Đăng ký"}
          cancelText="Hủy"
          width={700}
          centered
        >
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={onFinish} 
            style={{ marginTop: 20 }}
          >
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item name="hotel_name" label="Tên khách sạn" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                  <Input placeholder="Ví dụ: Vinpearl Luxury..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="type" label="Loại hình" rules={[{ required: true }]}>
                  <Select 
                    placeholder="Chọn loại hình"
                    options={categories.map(cat => ({ value: cat.category_name, label: cat.category_name }))} 
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
              <Input prefix={<EnvironmentOutlined />} placeholder="Số nhà, đường, thành phố..." />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="rate_star" label="Hạng sao" initialValue={5}>
                  <Select options={[1, 2, 3, 4, 5].map(s => ({ value: s, label: `${s} Sao` }))} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="discount" label="Chiết khấu (%)" initialValue={0}>
                  <InputNumber 
                    min={0} max={100} 
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    style={{ width: '100%' }} 
                    disabled={!!editingId}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Hình ảnh khách sạn">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                beforeUpload={() => false} 
                maxCount={1}
                accept="image/*"
              >
                {fileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải ảnh</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về khách sạn..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default HotelManagement;