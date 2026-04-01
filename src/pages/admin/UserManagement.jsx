import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Space, Button, Card, Typography, 
  message, Modal, Input, Badge, Select, Descriptions 
} from 'antd';
import { 
  DeleteOutlined, SearchOutlined, UserOutlined, 
  EyeOutlined, LockOutlined, UnlockOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const UserManagement = () => {
  const [users, set_users] = useState([]);
  const [search_text, set_search_text] = useState('');
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [selected_user, set_selected_user] = useState(null);

  // 1. Khởi tạo dữ liệu
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('users')) || [];
    if (data.length === 0) {
      const demo_data = [
        { 
          email: 'admin@hotel.com', 
          username: 'admin', 
          full_name: 'Admin Cấp 1 (Root)', 
          role: 'admin', 
          is_root: true,
          status: 'active', 
          created_at: new Date().toISOString(), 
          phone: '0123456789' 
        },
        { 
          email: 'doitac@gmail.com', 
          username: 'doitac', 
          full_name: 'Hotel A', 
          role: 'partner', 
          is_root: false, 
          status: 'active', 
          created_at: new Date().toISOString() 
        },
        { 
          email: 'khachhang@gmail.com', 
          username: 'khachhang', 
          full_name: 'Nguyễn Văn A', 
          role: 'customer', 
          is_root: false, 
          status: 'active', 
          created_at: new Date().toISOString() 
        },
      ];
      localStorage.setItem('users', JSON.stringify(demo_data));
      set_users(demo_data);
    } else {
      set_users(data);
    }
  }, []);

  const save_users = (new_users) => {
    localStorage.setItem('users', JSON.stringify(new_users));
    set_users(new_users);
  };

  // 2. Logic: Xóa người dùng (Bảo vệ Root)
  const handle_delete = (email) => {
    Modal.confirm({
      title: 'Xác nhận xóa?',
      content: `Bạn có chắc chắn muốn xóa tài khoản ${email}?`,
      okText: 'Xóa ngay',
      okType: 'danger',
      onOk: () => {
        const new_users = users.filter(u => u.email !== email);
        save_users(new_users);
        message.success('Đã xóa người dùng thành công!');
      }
    });
  };

  // 3. Logic: Khóa / Mở khóa
  const handle_toggle_status = (email) => {
    const new_users = users.map(u => {
      if (u.email === email) {
        const new_status = u.status === 'active' ? 'blocked' : 'active';
        return { ...u, status: new_status };
      }
      return u;
    });
    save_users(new_users);
    message.info('Đã cập nhật trạng thái tài khoản');
  };

  // 4. Logic: Thay đổi vai trò
  const handle_role_change = (email, new_role) => {
    const new_users = users.map(u => {
      if (u.email === email) {
        return { ...u, role: new_role, is_root: false };
      }
      return u;
    });
    save_users(new_users);
    message.success(`Đã chuyển thành ${new_role.toUpperCase()}`);
  };

  const table_columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text, record) => (
        <Space>
          <Text strong>{text}</Text>
          {record.is_root && <Tag color="gold">TỐI CAO</Tag>}
        </Space>
      ),
    },
    {
      title: 'Email/Tài khoản',
      key: 'account',
      render: (_, record) => (
        <div>
          <div>{record.email}</div>
          <Text type="secondary" style={sub_text_style}>User: {record.username}</Text>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => {
        if (record.is_root) return <Tag color="volcano">ADMIN CẤP 1</Tag>;

        return (
          <Select 
            value={role} 
            style={select_role_style}
            onChange={(value) => handle_role_change(record.email, value)}
            options={[
              { value: 'admin', label: 'ADMIN CẤP 2' },
              { value: 'partner', label: 'ĐỐI TÁC' },
              { value: 'customer', label: 'KHÁCH HÀNG' },
            ]}
          />
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'active' ? 'success' : 'error'} 
          text={status === 'active' ? 'Hoạt động' : 'Đã khóa'} 
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => { set_selected_user(record); set_is_modal_open(true); }}
          />
          {!record.is_root && (
            <>
              <Button 
                type="text"
                icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
                danger={record.status === 'active'}
                onClick={() => handle_toggle_status(record.email)}
              />
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => handle_delete(record.email)}
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  const filtered_data = users.filter(u => 
    u.full_name?.toLowerCase().includes(search_text.toLowerCase()) || 
    u.email?.toLowerCase().includes(search_text.toLowerCase())
  );

  return (
    <Card bordered={false}>
      <div style={header_container_style}>
        <Title level={3} style={no_margin_style}><UserOutlined /> Quản lý người dùng</Title>
        <Input
          placeholder="Tìm theo tên hoặc email..."
          prefix={<SearchOutlined />}
          style={search_input_style}
          onChange={e => set_search_text(e.target.value)}
        />
      </div>

      <Table 
        columns={table_columns} 
        dataSource={filtered_data} 
        rowKey="email"
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title="Chi tiết hồ sơ người dùng"
        open={is_modal_open}
        onCancel={() => set_is_modal_open(false)}
        footer={[<Button key="close" onClick={() => set_is_modal_open(false)}>Đóng</Button>]}
      >
        {selected_user && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Họ tên">{selected_user.full_name}</Descriptions.Item>
            <Descriptions.Item label="Quyền hạn">
              <Tag color={selected_user.is_root ? 'volcano' : 'blue'}>
                {selected_user.is_root ? 'ADMIN CẤP 1' : selected_user.role === 'admin' ? 'ADMIN CẤP 2' : selected_user.role.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Email">{selected_user.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selected_user.phone || 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label="Ngày tham gia">
                {new Date(selected_user.created_at).toLocaleString('vi-VN')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
};

const header_container_style = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  marginBottom: 24, 
  alignItems: 'center' 
};
const no_margin_style = { margin: 0 };
const search_input_style = { width: 300 };
const sub_text_style = { fontSize: '12px' };
const select_role_style = { width: 150 };

export default UserManagement;