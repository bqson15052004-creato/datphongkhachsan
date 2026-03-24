import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Card, Typography, message, Modal, Input } from 'antd';
import { DeleteOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');

  // 1. Lấy dữ liệu từ localStorage khi vào trang
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(data);
  }, []);

  // 2. Hàm xóa người dùng
  const handleDelete = (email) => {
    Modal.confirm({
      title: 'Xác nhận xóa?',
      content: `Bạn có chắc chắn muốn xóa tài khoản ${email}?`,
      okText: 'Xóa ngay',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        const newUsers = users.filter(u => u.email !== email);
        localStorage.setItem('users', JSON.stringify(newUsers));
        setUsers(newUsers);
        message.success('Đã xóa người dùng thành công!');
      }
    });
  };

  // 3. Định nghĩa cột cho bảng
  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => <b>{text}</b>,
    },
    {
      title: 'Email/Tài khoản',
      key: 'account',
      render: (_, record) => (
        <div>
          <div>{record.email}</div>
          <small style={{ color: '#999' }}>User: {record.username}</small>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Đối tác', value: 'partner' },
        { text: 'Khách hàng', value: 'customer' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => {
        let color = 'blue';
        let label = 'Khách hàng';
        if (role === 'admin') { color = 'volcano'; label = 'Admin'; }
        if (role === 'partner') { color = 'green'; label = 'Đối tác'; }
        return <Tag color={color}>{label.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '---',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        record.role !== 'admin' ? (
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.email)}
          >
            Xóa
          </Button>
        ) : null
      ),
    },
  ];

  // Lọc tìm kiếm
  const filteredData = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchText.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Card bordered={false}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>Quản lý người dùng</Title>
        <Input
          placeholder="Tìm theo tên hoặc email..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="email"
        pagination={{ pageSize: 8 }}
      />
    </Card>
  );
};

export default UserManagement;