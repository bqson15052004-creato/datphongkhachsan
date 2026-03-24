import React, { useState } from 'react';
import { Layout, List, Avatar, Input, Button, Card, Typography, Tag, Badge, Space } from 'antd';
import { SendOutlined, UserOutlined, CustomerServiceOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const PartnerMessages = () => {
  const [activeChat, setActiveChat] = useState(1); // Mặc định chat với Admin

  // Danh sách hội thoại gộp chung
  const chatList = [
    { id: 1, name: 'Admin Hệ Thống', type: 'admin', lastMsg: 'Yêu cầu rút tiền của bạn đã duyệt', online: true },
    { id: 2, name: 'Nguyễn Văn A (Khách)', type: 'customer', lastMsg: 'Phòng có view biển không shop?', online: true },
    { id: 3, name: 'Trần Thị B (Khách)', type: 'customer', lastMsg: 'Cho mình check-in sớm 2 tiếng nhé', online: false },
  ];

  const currentChat = chatList.find(c => c.id === activeChat);

  return (
    <div style={{ padding: '24px', height: '85vh' }}>
      <Layout style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        
        {/* SIDEBAR DANH SÁCH CHAT */}
        <Sider width={320} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
            <Title level={4} style={{ margin: 0 }}>Tin nhắn</Title>
          </div>
          <List
            dataSource={chatList}
            renderItem={(item) => (
              <List.Item 
                onClick={() => setActiveChat(item.id)}
                style={{ 
                  padding: '12px 16px', 
                  cursor: 'pointer', 
                  transition: '0.3s',
                  background: activeChat === item.id ? '#e6f7ff' : 'transparent',
                  borderLeft: activeChat === item.id ? '4px solid #1890ff' : '4px solid transparent'
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot status={item.online ? "success" : "default"}>
                      <Avatar 
                        icon={item.type === 'admin' ? <CustomerServiceOutlined /> : <UserOutlined />} 
                        style={{ backgroundColor: item.type === 'admin' ? '#ff4d4f' : '#1890ff' }}
                      />
                    </Badge>
                  }
                  title={
                    <Space>
                      {item.name}
                      {item.type === 'admin' && <Tag color="red" size="small">Support</Tag>}
                    </Space>
                  }
                  description={<Text type="secondary" ellipsis style={{ width: 180 }}>{item.lastMsg}</Text>}
                />
              </List.Item>
            )}
          />
        </Sider>

        {/* NỘI DUNG CHAT */}
        <Content style={{ display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
          {/* Header khung chat */}
          <div style={{ padding: '16px 24px', background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <Avatar icon={currentChat?.type === 'admin' ? <CustomerServiceOutlined /> : <UserOutlined />} />
              <Text strong style={{ fontSize: '16px' }}>{currentChat?.name}</Text>
            </Space>
            <Tag color={currentChat?.online ? "green" : "default"}>{currentChat?.online ? "Đang trực tuyến" : "Ngoại tuyến"}</Tag>
          </div>

          {/* Vùng hiển thị tin nhắn */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            {/* Tin nhắn nhận */}
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <div style={{ display: 'inline-block', padding: '12px 16px', background: '#fff', borderRadius: '0 15px 15px 15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', maxWidth: '70%' }}>
                Chào bạn, mình muốn hỏi chút về dịch vụ bên mình.
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>10:30 AM</div>
            </div>

            {/* Tin nhắn gửi */}
            <div style={{ marginBottom: '20px', textAlign: 'right' }}>
              <div style={{ display: 'inline-block', padding: '12px 16px', background: '#1890ff', color: '#fff', borderRadius: '15px 15px 0 15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', maxWidth: '70%' }}>
                Dạ chào bạn, bạn cần hỗ trợ thông tin gì ạ?
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>10:32 AM</div>
            </div>
          </div>

          {/* Ô nhập tin nhắn */}
          <div style={{ padding: '20px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
            <Input.Search
              placeholder="Nhập nội dung tin nhắn..."
              size="large"
              enterButton={<SendOutlined />}
              onSearch={(value) => console.log('Gửi tin nhắn:', value)}
            />
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default PartnerMessages;