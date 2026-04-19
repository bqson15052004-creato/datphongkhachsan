import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Layout, List, Avatar, Input, Button, Typography, Tag, Badge, Space, Empty, Tooltip } from 'antd';
import { SendOutlined, UserOutlined, CustomerServiceOutlined, MessageOutlined, CheckOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const PartnerMessages = () => {
  const [active_chat, set_active_chat] = useState(1);
  const [input_value, set_input_value] = useState('');
  const scroll_ref = useRef(null);

  // Dữ liệu mẫu (Sau này sẽ fetch từ API/Socket)
  const [messages, set_messages] = useState([
    { id: 1, sender: 'customer', text: 'Chào bạn, phòng Suite còn view biển không ạ?', time: '10:30 AM', chat_id: 2, status: 'seen' },
    { id: 2, sender: 'partner', text: 'Chào bạn, hiện tại bên mình vẫn còn 2 phòng Suite tầng cao view biển nhé!', time: '10:32 AM', chat_id: 2, status: 'seen' },
    { id: 3, sender: 'admin', text: 'Yêu cầu đối soát doanh thu tháng 3 đã hoàn tất.', time: '09:00 AM', chat_id: 1, status: 'seen' },
  ]);

  const chat_list = [
    { id: 1, name: 'Hỗ trợ Hệ thống', type: 'admin', lastMsg: 'Đã hoàn tất đối soát...', online: true, unread: 0 },
    { id: 2, name: 'Nguyễn Văn A', type: 'customer', lastMsg: 'View biển không shop?', online: true, unread: 1 },
    { id: 3, name: 'Trần Thị B', type: 'customer', lastMsg: 'Cảm ơn bạn nhiều!', online: false, unread: 0 },
  ];

  // Tối ưu hóa việc lọc tin nhắn
  const filtered_messages = useMemo(() => 
    messages.filter(m => m.chat_id === active_chat),
    [messages, active_chat]
  );

  const current_chat = chat_list.find(c => c.id === active_chat);

  useEffect(() => {
    if (scroll_ref.current) {
      scroll_ref.current.scrollTo({
        top: scroll_ref.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [filtered_messages]);

  const handle_send = () => {
    if (!input_value.trim()) return;

    const new_msg = {
      id: Date.now(),
      sender: 'partner',
      text: input_value,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chat_id: active_chat,
      status: 'sent'
    };

    set_messages(prev => [...prev, new_msg]);
    set_input_value('');
    // Logic Socket.io sẽ đặt ở đây
  };

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ padding: '20px 5%', height: 'calc(100vh - 80px)' }}>
        <Layout style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', height: '100%', boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}>
          
          {/* SIDEBAR - Danh sách hội thoại */}
          <Sider width={350} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
            <div style={{ padding: '24px', background: '#fff' }}>
              <Space orientation="vertical" style={{ width: '100%' }}>
                <Title level={4} style={{ margin: 0, color: '#1a3353' }}>
                  <MessageOutlined /> Tin nhắn
                </Title>
                <Input.Search placeholder="Tìm kiếm hội thoại..." variant="filled" style={{ marginTop: 10 }} />
              </Space>
            </div>
            <div style={{ overflowY: 'auto', height: 'calc(100% - 110px)' }}>
              <List
                dataSource={chat_list}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => set_active_chat(item.id)}
                    style={{
                      padding: '16px 20px',
                      cursor: 'pointer',
                      transition: '0.3s',
                      background: active_chat === item.id ? '#e6f7ff' : 'transparent',
                    }}
                    className="chat-item-hover"
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge dot status={item.online ? "success" : "default"} offset={[-2, 32]}>
                          <Avatar 
                            size={48} 
                            icon={item.type === 'admin' ? <CustomerServiceOutlined /> : <UserOutlined />} 
                            style={{ backgroundColor: item.type === 'admin' ? '#ff4d4f' : '#1890ff' }}
                          />
                        </Badge>
                      }
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text strong>{item.name}</Text>
                          {item.unread > 0 && <Badge count={item.unread} style={{ backgroundColor: '#52c41a' }} />}
                        </div>
                      }
                      description={<Text type="secondary" ellipsis style={{ maxWidth: 180 }}>{item.lastMsg}</Text>}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Sider>

          {/* CHAT CONTENT - Nội dung tin nhắn */}
          <Content style={{ display: 'flex', flexDirection: 'column', background: '#fcfcfc' }}>
            {current_chat ? (
              <>
                {/* Chat Header */}
                <div style={{ padding: '16px 30px', background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                  <Space size="middle">
                    <Avatar size={44} icon={current_chat.type === 'admin' ? <CustomerServiceOutlined /> : <UserOutlined />} />
                    <div>
                      <Text strong style={{ fontSize: 16 }}>{current_chat.name}</Text>
                      <br />
                      <Badge status={current_chat.online ? "success" : "default"} text={current_chat.online ? "Đang trực tuyến" : "Ngoại tuyến"} style={{ fontSize: 12 }} />
                    </div>
                  </Space>
                  <Tooltip title="Thông tin hội thoại">
                    <Button type="text" shape="circle" icon={<ClockCircleOutlined />} />
                  </Tooltip>
                </div>

                {/* Message Body */}
                <div 
                  ref={scroll_ref}
                  style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', scrollBehavior: 'smooth' }}
                >
                  {filtered_messages.map((msg) => {
                    const is_me = msg.sender === 'partner';
                    return (
                      <div key={msg.id} style={{ alignSelf: is_me ? 'flex-end' : 'flex-start', maxWidth: '65%' }}>
                        <div style={{
                          padding: '12px 18px',
                          borderRadius: is_me ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                          background: is_me ? '#1890ff' : '#fff',
                          color: is_me ? '#fff' : '#1a3353',
                          boxShadow: is_me ? '0 4px 12px rgba(24,144,255,0.25)' : '0 4px 12px rgba(0,0,0,0.03)',
                          fontSize: '14px',
                          lineHeight: '1.5'
                        }}>
                          {msg.text}
                        </div>
                        <div style={{ display: 'flex', justifyContent: is_me ? 'flex-end' : 'flex-start', alignItems: 'center', marginTop: 6, gap: 6 }}>
                          <Text type="secondary" style={{ fontSize: '10px' }}>{msg.time}</Text>
                          {is_me && <CheckOutlined style={{ fontSize: 10, color: '#1890ff' }} />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chat Input */}
                <div style={{ padding: '24px 30px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Input 
                      placeholder="Nhập nội dung tư vấn..." 
                      variant="filled"
                      size="large" 
                      style={{ borderRadius: 25, padding: '10px 20px' }}
                      value={input_value}
                      onChange={(e) => set_input_value(e.target.value)}
                      onPressEnter={handle_send}
                    />
                    <Button 
                      type="primary" 
                      shape="circle" 
                      size="large" 
                      icon={<SendOutlined />} 
                      onClick={handle_send}
                      style={{ height: 46, width: 46 }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  description={<Text type="secondary">Chọn một hội thoại bên trái để bắt đầu trao đổi</Text>} 
                />
              </div>
            )}
          </Content>
        </Layout>
      </div>
    </div>
  );
};

export default PartnerMessages;