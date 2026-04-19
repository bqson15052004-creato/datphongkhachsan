import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Space, Button, Card, Typography,
  message, Modal, Input, Badge, Select, Descriptions, Avatar, Tooltip
} from 'antd';
import {
  DeleteOutlined, SearchOutlined, UserOutlined,
  EyeOutlined, LockOutlined, UnlockOutlined, CrownOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search_text, setSearchText] = useState('');
  const [is_modal_open, setIsModalOpen] = useState(false);
  const [selected_user, setSelectedUser] = useState(null);

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('users_list')) || [];
    if (data.length === 0) {
      const demo_data = [
        {
          email_address: 'admin@hotel.com',
          user_name: 'admin_root',
          full_name: 'Sơn Admin (Root)',
          user_role: 'admin',
          is_root: true,
          account_status: 'active',
          created_at: new Date().toISOString(),
          phone_number: '0987654321'
        },
        {
          email_address: 'partner01@gmail.com',
          user_name: 'p_vinpearl',
          full_name: 'Vinpearl Manager',
          user_role: 'partner',
          is_root: false,
          account_status: 'active',
          created_at: new Date().toISOString()
        },
        {
          email_address: 'customer01@gmail.com',
          user_name: 'guest_vn',
          full_name: 'Trần Văn A',
          user_role: 'customer',
          is_root: false,
          account_status: 'blocked',
          created_at: new Date().toISOString()
        },
      ];
      sessionStorage.setItem('users_list', JSON.stringify(demo_data));
      setUsers(demo_data);
    } else {
      setUsers(data);
    }
  }, []);

  const save_users_data = (new_users) => {
    sessionStorage.setItem('users_list', JSON.stringify(new_users));
    setUsers(new_users);
    window.dispatchEvent(new Event('storage'));
  };
/*
  const handle_delete_user = (email) => {
    Modal.confirm({
      title: 'Xoá tài khoản vĩnh viễn?',
      icon: <DeleteOutlined style={{ color: 'red' }} />,
      content: `Dữ liệu của tài khoản ${email} sẽ bị gỡ bỏ hoàn toàn.`,
      okText: 'Xác nhận xoá',
      okType: 'danger',
      onOk: () => {
        const new_users = users.filter(u => u.email_address !== email);
        save_users_data(new_users);
        message.success('Đã gỡ bỏ người dùng khỏi hệ thống!');
      }
    });
  };
*/
  const handle_toggle_status = (user) => {
    const action = user.account_status === 'active' ? 'KHÓA' : 'MỞ KHÓA';
    Modal.confirm({
      title: `Xác nhận ${action} tài khoản?`,
      content: `Người dùng ${user.full_name} sẽ ${user.account_status === 'active' ? 'không thể' : 'có thể'} đăng nhập vào hệ thống.`,
      onOk: () => {
        const new_users = users.map(u => {
          if (u.email_address === user.email_address) {
            return { ...u, account_status: u.account_status === 'active' ? 'blocked' : 'active' };
          }
          return u;
        });
        save_users_data(new_users);
        message.info(`Đã ${action} thành công.`);
      }
    });
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
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>@{record.user_name}</div>
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
              save_users_data(new_users);
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
      render: (status) => {
        const config = status === 'active' ? { color: 'green', text: 'Hoạt động' } : { color: 'red', text: 'Đã khóa' };
        return <Badge status={status === 'active' ? 'success' : 'error'} text={<Tag color={config.color}>{config.text}</Tag>} />;
      },
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
            <>
              <Tooltip title={record.account_status === 'active' ? "Khóa tài khoản" : "Mở khóa"}>
                <Button 
                  size="small" 
                  icon={record.account_status === 'active' ? <LockOutlined /> : <UnlockOutlined />} 
                  danger={record.account_status === 'active'}
                  type={record.account_status !== 'active' ? 'primary' : 'default'}
                  onClick={() => handle_toggle_status(record)}
                />
              </Tooltip>
              {/*
              <Tooltip title="Xoá tài khoản">
                <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handle_delete_user(record.email_address)} />
              </Tooltip>
              */}
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card variant={false} style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <Title level={4} style={{ margin: 0 }}><UserOutlined /> Quản lý danh sách tài khoản</Title>
        <Input
          placeholder="Tìm theo tên hoặc email..."
          prefix={<SearchOutlined />}
          allowClear
          style={{ width: 320, borderRadius: 8 }}
          onChange={e => setSearchText(e.target.value)}
        />
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

      <Modal
        title={<Space><UserOutlined /> Hồ sơ chi tiết</Space>}
        open={is_modal_open}
        onCancel={() => setIsModalOpen(false)}
        footer={[<Button key="ok" type="primary" onClick={() => setIsModalOpen(false)}>Xác nhận</Button>]}
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
            <Descriptions.Item label="Số điện thoại">{selected_user.phone_number || 'N/A'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
};

export default UserManagement;