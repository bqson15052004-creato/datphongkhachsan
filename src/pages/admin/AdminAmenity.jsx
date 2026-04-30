import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Button, Tag, Space, 
  Typography, Input, Modal, Form, Switch, message, Row, Col 
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, AppstoreOutlined, 
  EditOutlined, LockOutlined, UnlockOutlined
} from '@ant-design/icons';
import { ALL_AMENITIES } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;

const AdminAmenity = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  
  const [amenities, setAmenities] = useState([]);
  const [searchText, setSearchText] = useState('');

  // Khởi tạo dữ liệu
  useEffect(() => {
    const localData = localStorage.getItem('SYSTEM_AMENITIES');
    if (localData) {
      setAmenities(JSON.parse(localData));
    } else {
      setAmenities(ALL_AMENITIES);
      localStorage.setItem('SYSTEM_AMENITIES', JSON.stringify(ALL_AMENITIES));
    }
  }, []);

  const saveToLocal = (newData) => {
    setAmenities(newData);
    localStorage.setItem('SYSTEM_AMENITIES', JSON.stringify(newData));
  };

  const handleSubmit = (values) => {
    if (editingId) {
      const newData = amenities.map(item => item.id === editingId ? { ...item, ...values } : item);
      saveToLocal(newData);
      message.success(`Đã cập nhật tiện nghi: ${values.name}`);
    } else {
      const newAmenity = {
        id: `AM${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        ...values,
      };
      saveToLocal([...amenities, newAmenity]);
      message.success(`Đã thêm tiện nghi mới: ${values.name}`);
    }
    handleCancel();
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleToggleStatus = (record) => {
    const isLocking = record.status === true;
    const actionText = isLocking ? 'khóa' : 'mở khóa';

    Modal.confirm({
      title: `Xác nhận ${actionText} tiện nghi?`,
      icon: isLocking ? <LockOutlined style={{ color: '#ff4d4f' }} /> : <UnlockOutlined style={{ color: '#52c41a' }} />,
      content: `Bạn chắc chắn muốn ${actionText} "${record.name}"?`,
      onOk: () => {
        const newData = amenities.map(item => 
          item.id === record.id ? { ...item, status: !record.status } : item
        );
        saveToLocal(newData);
        message.success(`Đã ${actionText} tiện nghi thành công!`);
      },
    });
  };

  // Chỉ lọc theo tên tiện nghi
  const filteredAmenities = amenities.filter(item => 
    item?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Mã tiện nghi',
      dataIndex: 'id',
      width: 150,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Tên tiện nghi',
      dataIndex: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 200,
      render: (status) => (
        <Tag color={status ? 'green' : 'red'} style={{ fontWeight: 500 }}>
          {status ? 'ĐANG HOẠT ĐỘNG' : 'ĐANG KHÓA'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          
          <Button 
            type="link" 
            onClick={() => handleToggleStatus(record)}
            style={{ padding: 0 }}
          >
            <Space size={4}>
              {record.status ? (
                <>
                  <UnlockOutlined style={{ color: '#006efeff' }} />
                  <span style={{ color: '#006efeff' }}>Mở</span>
                </>
              ) : (
                <>
                  <LockOutlined style={{ color: '#f5222d' }} />
                  <span style={{ color: '#f5222d' }}>Khóa</span>
                </>
              )}
            </Space>
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', background: '#f5f7fa', minHeight: '100vh' }}>
      <Card variant={false} style={{ marginBottom: 20, borderRadius: 12 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}><AppstoreOutlined /> Quản lý tiện nghi phòng</Title>
          </Col>
        </Row>
      </Card>

      <Card variant={false} style={{ borderRadius: 12 }}>
        <Row gutter={16} style={{ marginBottom: 20 }} justify="space-between">
          <Col span={12}>
            <Input 
              placeholder="Tìm tên tiện nghi..." 
              prefix={<SearchOutlined />} 
              onChange={e => setSearchText(e.target.value)} 
              allowClear
              size="large"
            />
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} size="large">
              Thêm tiện nghi mới
            </Button>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={filteredAmenities} 
          rowKey="id" 
          pagination={{ pageSize: 8 }} 
        />
      </Card>

      <Modal 
        title={editingId ? "Cập nhật tiện nghi" : "Thêm tiện nghi mới"} 
        open={isModalOpen} 
        onCancel={handleCancel}
        onOk={() => form.submit()}
        centered
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmit} 
          initialValues={{ status: true }}
          style={{ marginTop: 10 }}
        >
          <Form.Item 
            name="name" 
            label="Tên tiện nghi phòng" 
            rules={[{ required: true, message: 'Vui lòng nhập tên tiện nghi!' }]}
          >
            <Input placeholder="VD: Máy sấy tóc, Bồn tắm, Mini bar..." />
          </Form.Item>
          
          <Form.Item name="status" label="Trạng thái hoạt động" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminAmenity;