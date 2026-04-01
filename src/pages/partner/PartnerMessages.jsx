import React, { useState, useEffect } from 'react';
import { Layout, List, Avatar, Input, Button, Typography, Tag, Badge, Space } from 'antd';
import { SendOutlined, UserOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import axiosClient from '../../services/axiosClient';

const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const PartnerMessages = () => {
  // 1. Quản lý trạng thái
  const [active_chat, set_active_chat] = useState(null);
  const [chat_list, set_chat_list] = useState([]);
  const [message_list, set_message_list] = useState([]);
  const [input_value, set_input_value] = useState('');

  // 2. Mock data hoặc Fetch từ Node.js
  useEffect(() => {
    const fetch_conversations = async () => {
      const mock_conversations = [
        { id: 1, full_name: 'Admin Hệ Thống', user_type: 'admin', last_msg: 'Đã duyệt yêu cầu', is_online: true },
        { id: 2, full_name: 'Nguyễn Văn A', user_type: 'customer', last_msg: 'Phòng còn không?', is_online: true },
      ];
      set_chat_list(mock_conversations);
      set_active_chat(mock_conversations[0]);
    };
    fetch_conversations();
  }, []);

  const handle_send_message = () => {
    if (!input_value.trim()) return;
    
    // Logic gửi tin nhắn ở đây
    console.log("Gửi tin nhắn tới ID:", active_chat?.id, "Nội dung:", input_value);
    set_input_value('');
  };

  return (
    <div style={{ padding: '24px', height: '85vh' }}>
      <Layout style={container_style}>
        
        {/* SIDEBAR DANH SÁCH CHAT */}
        <Sider width={320} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
          <div style={header_style}>
            <Title level={4} style={{ margin: 0 }}>Tin nhắn</Title>
          </div>
          <List
            dataSource={chat_list}
            renderItem={(item) => (
              <List.Item 
                onClick={() => set_active_chat(item)}
                style={{ 
                  ...list_item_style,
                  background: active_chat?.id === item.id ? '#e6f7ff' : 'transparent',
                  borderLeft: active_chat?.id === item.id ? '4px solid #1890ff' : '4px solid transparent'
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot status={item.is_online ? "success" : "default"}>
                      <Avatar 
                        icon={item.user_type === 'admin' ? <CustomerServiceOutlined /> : <UserOutlined />} 
                        style={{ backgroundColor: item.user_type === 'admin' ? '#ff4d4f' : '#1890ff' }}
                      />
                    </Badge>
                  }
                  title={
                    <Space>
                      {item.full_name}
                      {item.user_type === 'admin' && <Tag color="red" size="small">Support</Tag>}
                    </Space>
                  }
                  description={<Text type="secondary" ellipsis style={{ width: 180 }}>{item.last_msg}</Text>}
                />
              </List.Item>
            )}
          />
        </Sider>

        {/* NỘI DUNG CHAT */}
        <Content style={{ display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
          {/* Header */}
          <div style={chat_header_style}>
            <Space>
              <Avatar icon={active_chat?.user_type === 'admin' ? <CustomerServiceOutlined /> : <UserOutlined />} />
              <Text strong style={{ fontSize: '16px' }}>{active_chat?.full_name}</Text>
            </Space>
            <Tag color={active_chat?.is_online ? "green" : "default"}>
              {active_chat?.is_online ? "Trực tuyến" : "Ngoại tuyến"}
            </Tag>
          </div>

          {/* Vùng tin nhắn (Body) */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            <div style={msg_receive_style}>
              <div style={bubble_receive_style}>Chào bạn, mình cần hỗ trợ!</div>
              <div style={time_style}>10:30 AM</div>
            </div>
            
            <div style={msg_send_style}>
              <div style={bubble_send_style}>Dạ, bạn cần giúp gì ạ?</div>
              <div style={time_style}>10:32 AM</div>
            </div>
          </div>

          {/* Ô nhập liệu */}
          <div style={{ padding: '20px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
            <Input
              placeholder="Nhập tin nhắn..."
              size="large"
              value={input_value}
              onChange={(e) => set_input_value(e.target.value)}
              onPressEnter={handle_send_message}
              suffix={
                <Button type="primary" icon={<SendOutlined />} onClick={handle_send_message}>Gửi</Button>
              }
            />
          </div>
        </Content>
      </Layout>
    </div>
  );
};

// Hệ thống Style Constants
const container_style = { background: '#fff', borderRadius: '12px', overflow: 'hidden', height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const header_style = { padding: '20px', borderBottom: '1px solid #f0f0f0' };
const list_item_style = { padding: '12px 16px', cursor: 'pointer', transition: '0.3s' };
const chat_header_style = { padding: '16px 24px', background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' };
const msg_receive_style = { marginBottom: '20px', textAlign: 'left' };
const msg_send_style = { marginBottom: '20px', textAlign: 'right' };
const bubble_receive_style = { display: 'inline-block', padding: '12px 16px', background: '#fff', borderRadius: '0 15px 15px 15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', maxWidth: '70%' };
const bubble_send_style = { display: 'inline-block', padding: '12px 16px', background: '#1890ff', color: '#fff', borderRadius: '15px 15px 0 15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', maxWidth: '70%' };
const time_style = { fontSize: '11px', color: '#999', marginTop: '4px' };

export default PartnerMessages;