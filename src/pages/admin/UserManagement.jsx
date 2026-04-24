import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Space, Button, Card, Typography,
  message, Modal, Input, Badge, Select, Descriptions, Avatar, Tooltip, Form
} from 'antd';
import {
  SearchOutlined, UserOutlined,
  EyeOutlined, LockOutlined, UnlockOutlined, CrownOutlined, PlusOutlined
} from '@ant-design/icons';

// FIX: Import dữ liệu từ file mockData
import { MOCK_USERS } from '../../constants/mockData.jsx';

const { Title, Text } = Typography;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search_text, setSearchText] = useState('');
  
  // State cho modal xem chi tiết
  const [is_modal_open, setIsModalOpen] = useState(false);
  const [selected_user, setSelectedUser] = useState(null);

  // State cho modal thêm admin
  const [is_add_modal_open, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Khởi tạo dữ liệu từ "Database" (localStorage)
  useEffect(() => {
    const database_data = JSON.parse(localStorage.getItem('SYSTEM_USERS'));
    
    if (database_data && database_data.length > 0) {
      setUsers(database_data);
    } else {
      const initial_data = MOCK_USERS.map(user => ({
        email_address: user.email,
        user_name: user.id,
        full_name: user.full_name,
        user_role: user.role || 'customer',
        is_root: user.role === 'admin',
        account_status: 'active',
        created_at: new Date().toISOString(),
        phone_number: user.phone || '0900 000 000',
        avatar_url: user.avatar
      }));

      save_users_to_db(initial_data);
    }
  }, []);

  // Hàm lưu dữ liệu vào "Database"
  const save_users_to_db = (new_users) => {
    localStorage.setItem('SYSTEM_USERS', JSON.stringify(new_users));
    setUsers(new_users);
  };

  // Hàm xử lý khóa/mở khóa tài khoản
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
    // Kiểm tra trùng email
    if (users.some(u => u.email_address === values.email)) {
      message.error('Email này đã tồn tại trong hệ thống!');
      return;
    }

    const new_admin = {
      email_address: values.email,
      user_name: `admin_${Date.now().toString().slice(-6)}`, // Tạo username ngẫu nhiên
      full_name: values.full_name,
      user_role: 'admin', // Cố định quyền là admin cấp 2
      is_root: false,     // Không phải root
      account_status: 'active',
      created_at: new Date().toISOString(),
      phone_number: values.phone || 'N/A',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.full_name}` // Tạo avatar ngẫu nhiên theo tên
    };

    const updated_users = [...users, new_admin];
    save_users_to_db(updated_users);
    
    message.success('Đã thêm Admin Cấp 2 thành công!');
    setIsAddModalOpen(false);
    form.resetFields(); // Xóa form sau khi thêm thành công
  };

  const columns = [
    {
      title: 'Người dùng',
      key: 'user_info',
      render: (_, record) => (
        <Space>
          <Avatar 
            icon={<UserOutlined />} 
            src={record.avatar_url} 
            style={{ backgroundColor: record.is_root ? '#f5222d' : '#1890ff' }}
          />
          <div>
            <Text strong>{record.full_name}</Text>
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
        if (record.is_root) return <Tag color="gold" icon={<CrownOutlined />}>ADMIN CẤP 1 (ROOT)</Tag>;

        return (
          <Select
            value={role}
            size="small"
            style={{ width: 140 }}
            onChange={(val) => {
              const new_users = users.map(u => u.email_address === record.email_address ? { ...u, user_role: val } : u);
              save_users_to_db(new_users);
              message.success('Đã cập nhật quyền hạn');
            }}
            options={[
              { value: 'admin', label: 'Admin Cấp 2' },
              { value: 'partner', label: 'Đối tác' },
              { value: 'customer', label: 'Khách hàng' },
            ]}
          />
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'account_status',
      key: 'account_status',
      render: (status) => (
        <Badge 
          status={status === 'active' ? 'success' : 'error'} 
          text={<Tag color={status === 'active' ? 'green' : 'red'}>{status === 'active' ? 'Hoạt động' : 'Đã khóa'}</Tag>} 
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
                icon={record.account_status === 'active' ? <LockOutlined /> : <UnlockOutlined />} 
                danger={record.account_status === 'active'}
                type={record.account_status !== 'active' ? 'primary' : 'default'}
                onClick={() => handle_toggle_status(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card variant={false} style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <Title level={4} style={{ margin: 0 }}><UserOutlined /> Quản lý danh sách tài khoản</Title>
        <Space>
          <Input
            placeholder="Tìm theo tên hoặc email..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 300, borderRadius: 8 }}
            onChange={e => setSearchText(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsAddModalOpen(true)}
            style={{ borderRadius: 8 }}
          >
            Thêm Admin
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={users.filter(u => 
          u.full_name?.toLowerCase().includes(search_text.toLowerCase()) || 
          u.email_address?.toLowerCase().includes(search_text.toLowerCase())
        )}
        rowKey="email_address"
        pagination={{ pageSize: 7, showTotal: (total) => `Tổng cộng ${total} tài khoản` }}
      />

      {/* Modal xem chi tiết người dùng */}
      <Modal
        title={<Space><UserOutlined /> Hồ sơ chi tiết</Space>}
        open={is_modal_open}
        onCancel={() => setIsModalOpen(false)}
        footer={[<Button key="ok" type="primary" onClick={() => setIsModalOpen(false)}>Đóng</Button>]}
        width={600}
      >
        {selected_user && (
          <Descriptions bordered column={2} size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="Họ tên" span={2}>{selected_user.full_name}</Descriptions.Item>
            <Descriptions.Item label="Email">{selected_user.email_address}</Descriptions.Item>
            <Descriptions.Item label="Username">{selected_user.user_name}</Descriptions.Item>
            <Descriptions.Item label="Vai trò" span={2}>
              <Tag color={selected_user.is_root ? 'volcano' : 'blue'}>
                {selected_user.is_root ? 'ADMIN TỐI CAO' : selected_user.user_role.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
               {new Date(selected_user.created_at).toLocaleDateString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selected_user.phone_number}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal Thêm Admin Cấp 2 */}
      <Modal
        title="Thêm Admin Cấp 2 Mới"
        open={is_add_modal_open}
        onCancel={() => { setIsAddModalOpen(false); form.resetFields(); }}
        onOk={() => form.submit()} // Kích hoạt submit form khi bấm nút OK của Modal
        okText="Tạo tài khoản"
        cancelText="Hủy bỏ"
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handle_add_admin}
          style={{ marginTop: 16 }}
        >
          <Form.Item 
            name="full_name" 
            label="Họ và tên" 
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input placeholder="Nhập họ và tên admin" />
          </Form.Item>

          <Form.Item 
            name="email" 
            label="Địa chỉ Email" 
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email đăng nhập" />
          </Form.Item>

          <Form.Item 
            name="phone" 
            label="Số điện thoại"
          >
            <Input placeholder="Nhập số điện thoại (Không bắt buộc)" />
          </Form.Item>

          <Form.Item 
            name="password" 
            label="Mật khẩu" 
            rules={[{ required: true, message: 'Vui lòng thiết lập mật khẩu!' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserManagement;