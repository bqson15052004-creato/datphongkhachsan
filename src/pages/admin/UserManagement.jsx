import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Space, Button, Card, Typography, Alert, Row, Col,
  message, Modal, Input, Badge, Descriptions, Avatar, Tooltip, Form
} from 'antd';
import {
  SearchOutlined, UserOutlined,
  EyeOutlined, LockOutlined, UnlockOutlined, CrownOutlined, PlusOutlined,
  MailOutlined, PhoneOutlined, KeyOutlined, IdcardOutlined
} from '@ant-design/icons';

// IMPORT MOCK DATA
import { MOCK_USERS } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search_text, setSearchText] = useState('');
  
  // State cho modal
  const [is_modal_open, setIsModalOpen] = useState(false);
  const [selected_user, setSelectedUser] = useState(null);
  const [is_add_modal_open, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Số dòng mỗi trang
  // Khởi tạo dữ liệu
  useEffect(() => {
    const database_data = JSON.parse(localStorage.getItem('SYSTEM_USERS'));
    
    if (database_data && database_data.length > 0) {
      setUsers(database_data);
    } else {
      const initial_data = MOCK_USERS.map(user => ({
        email_address: user.email,
        user_name: user.id || `user_${Math.random().toString(36).substr(2, 5)}`,
        full_name: user.full_name,
        user_role: user.role || 'customer',
        is_root: user.role === 'admin' && user.email === 'admin@gmail.com', // Giả định admin gốc
        account_status: 'active',
        created_at: new Date().toISOString(),
        phone_number: user.phone || '0900 000 000',
        avatar_url: user.avatar
      }));
      save_users_to_db(initial_data);
    }
  }, []);

  const save_users_to_db = (new_users) => {
    localStorage.setItem('SYSTEM_USERS', JSON.stringify(new_users));
    setUsers(new_users);
  };

  const handle_toggle_status = (user) => {
    const action = user.account_status === 'active' ? 'KHÓA' : 'MỞ KHÓA';
    Modal.confirm({
      title: `Xác nhận ${action} tài khoản?`,
      content: `Người dùng ${user.full_name} sẽ ${user.account_status === 'active' ? 'không thể' : 'có thể'} đăng nhập.`,
      onOk: () => {
        const new_users = users.map(u => {
          if (u.email_address === user.email_address) {
            return { ...u, account_status: u.account_status === 'active' ? 'blocked' : 'active' };
          }
          return u;
        });
        save_users_to_db(new_users);
        message.info(`Đã ${action} thành công.`);
      }
    });
  };

  // Hàm xử lý thêm Admin Cấp 2 mới
  const handle_add_admin = (values) => {
    if (users.some(u => u.email_address === values.email)) {
      message.error('Email này đã tồn tại!');
      return;
    }
    if (users.some(u => u.user_name === values.user_name)) {
      message.error('Tên tài khoản đã tồn tại!');
      return;
    }

    const new_admin = {
      email_address: values.email,
      user_name: values.user_name,
      full_name: values.full_name,
      user_role: 'admin',
      is_root: false,
      account_status: 'active',
      created_at: new Date().toISOString(),
      phone_number: values.phone || 'N/A',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.user_name}`,
      password: values.password
    };

    const updated_users = [new_admin, ...users];
    save_users_to_db(updated_users);
    
    message.success('Đã tạo tài khoản Admin Cấp 2 thành công!');
    setIsAddModalOpen(false);
    form.resetFields();
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
      title: 'Người dùng',
      key: 'user_info',
      render: (_, record) => (
        <Space>
          <Avatar 
            src={record.avatar_url} 
            icon={<UserOutlined />}
            style={{ backgroundColor: record.is_root ? '#f5222d' : '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.full_name}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email_address',
      key: 'email_address',
    },
    {
      title: 'Vai trò',
      dataIndex: 'user_role',
      key: 'user_role',
      render: (role, record) => {
        if (record.is_root) return <Tag color="volcano" icon={<CrownOutlined />}>ADMIN CẤP 1</Tag>;
        if (role === 'admin') return <Tag color="blue">ADMIN CẤP 2</Tag>;
        if (role === 'partner') return <Tag color="purple">ĐỐI TÁC</Tag>;
        return <Tag color="default">KHÁCH HÀNG</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'account_status',
      key: 'account_status',
      render: (status) => (
        <Badge 
          status={status === 'active' ? 'success' : 'error'} 
          text={<Tag color={status === 'active' ? 'blue' : 'red'}>{status === 'active' ? 'Hoạt động' : 'Đã khóa'}</Tag>} 
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button size="small" icon={<EyeOutlined />} onClick={() => { setSelectedUser(record); setIsModalOpen(true); }} />
          </Tooltip>
          
          {!record.is_root && (
            <Tooltip title={record.account_status === 'active' ? "Khóa tài khoản" : "Mở khóa"}>
              <Button 
                size="small" 
                icon={record.account_status === 'active' ? <UnlockOutlined /> : <LockOutlined />} 
                type={record.account_status === 'active' ? 'primary' : 'default'}
                danger={record.account_status !== 'active'} 
                onClick={() => handle_toggle_status(record)}
              />
            </Tooltip>
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
            <Title level={4} style={{ margin: 0 }}><UserOutlined /> Quản lý người dùng</Title>
          </Col>
        </Row>
      </Card>
      <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <Space>
            <Input
              placeholder="Tìm tên, email hoặc tài khoản..."
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 280, borderRadius: 8 }}
              onChange={e => setSearchText(e.target.value)}
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setIsAddModalOpen(true)}
              style={{ borderRadius: 8, fontWeight: 500 }}
            >
              Thêm Admin
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={users.filter(u => 
            u.full_name?.toLowerCase().includes(search_text.toLowerCase()) || 
            u.email_address?.toLowerCase().includes(search_text.toLowerCase()) ||
            u.user_name?.toLowerCase().includes(search_text.toLowerCase())
          )}
          rowKey="email_address"
          pagination={{ pageSize: 8 }}
        />

        {/* MODAL XEM CHI TIẾT */}
        <Modal
          title="Thông tin người dùng"
          open={is_modal_open}
          onCancel={() => setIsModalOpen(false)}
          footer={[<Button key="close" onClick={() => setIsModalOpen(false)}>Đóng</Button>]}
        >
          {selected_user && (
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Tên tài khoản">{selected_user.user_name}</Descriptions.Item>
              <Descriptions.Item label="Họ và tên">{selected_user.full_name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selected_user.email_address}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selected_user.phone_number}</Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                  <Tag color="blue">{selected_user.user_role.toUpperCase()}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tham gia">
                  {new Date(selected_user.created_at).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>

        {/* MODAL THÊM ADMIN CẤP 2 */}
        <Modal
          title={<Title level={4} style={{ margin: 0 }}>Tạo tài khoản Admin Cấp 2</Title>}
          open={is_add_modal_open}
          onCancel={() => { setIsAddModalOpen(false); form.resetFields(); }}
          onOk={() => form.submit()}
          okText="Xác nhận tạo"
          cancelText="Hủy"
          width={500}
        >
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={handle_add_admin}
            style={{ marginTop: 20 }}
          >
            <Form.Item 
              name="user_name" 
              label="Tên tài khoản (Username)" 
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input prefix={<IdcardOutlined />} placeholder="Ví dụ: admin_phong" />
            </Form.Item>

            <Form.Item 
              name="full_name" 
              label="Họ và tên" 
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập tên đầy đủ" />
            </Form.Item>

            <Space style={{ display: 'flex' }} align="baseline">
              <Form.Item 
                  name="email" 
                  label="Email" 
                  rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}
              >
                  <Input prefix={<MailOutlined />} placeholder="Email liên lạc" />
              </Form.Item>
              <Form.Item 
                  name="phone" 
                  label="Số điện thoại"
                  rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}
              >
                  <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
              </Form.Item>
            </Space>

            <Form.Item 
              name="password" 
              label="Mật khẩu" 
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password prefix={<KeyOutlined />} placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item 
              name="confirm" 
              label="Nhập lại mật khẩu" 
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<KeyOutlined />} placeholder="Xác nhận mật khẩu" />
            </Form.Item>
            
            <Alert 
              message="Tài khoản này sẽ được cấp quyền Admin Cấp 2 theo mặc định hệ thống." 
              type="info" 
              showIcon 
            />
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default UserManagement;