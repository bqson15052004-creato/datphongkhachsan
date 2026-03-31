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
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Lấy thông tin Admin đang đăng nhập từ localStorage để kiểm tra quyền
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  // 1. Khởi tạo dữ liệu với phân cấp rõ ràng
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('users')) || [];
    if (data.length === 0) {
      const demoData = [
        { 
          email: 'admin@hotel.com', 
          username: 'admin', 
          fullName: 'Admin Cấp 1 (Root)', 
          role: 'admin', 
          isRoot: true,
          status: 'active', 
          createdAt: new Date().toISOString(), 
          phone: '0123456789' 
        },
        { 
          email: 'doitac@gmail.com', 
          username: 'doitac', 
          fullName: 'Hotel A', 
          role: 'partner', 
          isRoot: false, 
          status: 'active', 
          createdAt: new Date().toISOString() 
        },
        { 
          email: 'khachhang@gmail.com', 
          username: 'khachhang', 
          fullName: 'Nguyễn Văn A', 
          role: 'customer', 
          isRoot: false, 
          status: 'active', 
          createdAt: new Date().toISOString() 
        },
      ];
      localStorage.setItem('users', JSON.stringify(demoData));
      setUsers(demoData);
    } else {
      setUsers(data);
    }
  }, []);

  const saveUsers = (newUsers) => {
    localStorage.setItem('users', JSON.stringify(newUsers));
    setUsers(newUsers);
  };

  // 2. Logic: Xóa người dùng (Bảo vệ Root)
  const handleDelete = (email) => {
    Modal.confirm({
      title: 'Xác nhận xóa?',
      content: `Bạn có chắc chắn muốn xóa tài khoản ${email}?`,
      okText: 'Xóa ngay',
      okType: 'danger',
      onOk: () => {
        const newUsers = users.filter(u => u.email !== email);
        saveUsers(newUsers);
        message.success('Đã xóa người dùng thành công!');
      }
    });
  };

  // 3. Logic: Khóa / Mở khóa
  const handleToggleStatus = (email) => {
    const newUsers = users.map(u => {
      if (u.email === email) {
        const newStatus = u.status === 'active' ? 'blocked' : 'active';
        return { ...u, status: newStatus };
      }
      return u;
    });
    saveUsers(newUsers);
    message.info('Đã cập nhật trạng thái tài khoản');
  };

  // 4. Logic: Thay đổi vai trò (Quan trọng nhất)
  const handleRoleChange = (email, newRole) => {
    const newUsers = users.map(u => {
      if (u.email === email) {
        // Mọi thay đổi vai trò qua đây đều gán isRoot = false
        // Điều này biến họ thành Admin cấp 2 nếu chọn role 'admin'
        return { ...u, role: newRole, isRoot: false };
      }
      return u;
    });
    saveUsers(newUsers);
    message.success(`Đã chuyển thành ${newRole.toUpperCase()}`);
  };

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <Space>
          <Text strong>{text}</Text>
          {record.isRoot && <Tag color="gold">TỐI CAO</Tag>}
        </Space>
      ),
    },
    {
      title: 'Email/Tài khoản',
      key: 'account',
      render: (_, record) => (
        <div>
          <div>{record.email}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>User: {record.username}</Text>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => {
        // Nếu là Root Admin (Cấp 1) thì không được đổi quyền
        if (record.isRoot) return <Tag color="volcano">ADMIN CẤP 1</Tag>;

        return (
          <Select 
            value={role} 
            style={{ width: 150 }}
            onChange={(value) => handleRoleChange(record.email, value)}
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
            onClick={() => { setSelectedUser(record); setIsModalOpen(true); }}
          />
          {/* Chỉ hiển thị nút xóa/khóa nếu không phải là Root Admin */}
          {!record.isRoot && (
            <>
              <Button 
                type="text"
                icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
                danger={record.status === 'active'}
                onClick={() => handleToggleStatus(record.email)}
              />
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => handleDelete(record.email)}
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  const filteredData = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchText.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Card bordered={false}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}><UserOutlined /> Quản lý người dùng</Title>
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

      <Modal
        title="Chi tiết hồ sơ người dùng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[<Button key="close" onClick={() => setIsModalOpen(false)}>Đóng</Button>]}
      >
        {selectedUser && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Họ tên">{selectedUser.fullName}</Descriptions.Item>
            <Descriptions.Item label="Quyền hạn">
              <Tag color={selectedUser.isRoot ? 'volcano' : 'blue'}>
                {selectedUser.isRoot ? 'ADMIN CẤP 1' : selectedUser.role === 'admin' ? 'ADMIN CẤP 2' : selectedUser.role.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selectedUser.phone || 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label="Ngày tham gia">
               {new Date(selectedUser.createdAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
};

export default UserManagement;