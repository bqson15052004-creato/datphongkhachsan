import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Layout, List, Avatar, Input, Button, Typography, Badge, Space, Empty, Tooltip } from 'antd';
import { SendOutlined, UserOutlined, MessageOutlined, CheckOutlined, ClockCircleOutlined, SearchOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const PartnerMessages = () => {
  const [active_chat, set_active_chat] = useState(2);
  const [input_value, set_input_value] = useState('');
  const [searchText, setSearchText] = useState('');
  const scroll_ref = useRef(null);

  // Thêm field 'updatedAt' để quản lý thời gian nhắn tin mới nhất
  const [chats, set_chats] = useState([
    { id: 2, name: 'Nguyễn Văn A', lastMsg: 'View biển không shop?', online: true, unread: 1, updatedAt: 1714000000000 },
    { id: 3, name: 'Trần Thị B', lastMsg: 'Cảm ơn bạn nhiều!', online: false, unread: 2, updatedAt: 1714000080000 },
    { id: 4, name: 'Anh Tuấn', lastMsg: 'Phòng đơn giá sao bạn?', online: true, unread: 0, updatedAt: 1714000050000 },
  ]);

  const [messages, set_messages] = useState([
    { id: 1, sender: 'customer', text: 'Chào bạn, phòng Suite còn view biển không ạ?', time: '10:30 AM', chat_id: 2 },
    { id: 2, sender: 'partner', text: 'Chào bạn, hiện tại bên mình vẫn còn 2 phòng Suite tầng cao view biển nhé!', time: '10:32 AM', chat_id: 2 },
  ]);

  // --- LOGIC ĐỒNG BỘ BADGE THÔNG BÁO ---
  
  // 1. Mỗi khi danh sách chats thay đổi, tính lại tổng unread và lưu vào localStorage
  useEffect(() => {
    const totalUnread = chats.reduce((acc, cur) => acc + (cur.unread || 0), 0);
    localStorage.setItem('unread_messages_count', totalUnread);
    // Phát event để PartnerLayout cập nhật Badge ngay lập tức
    window.dispatchEvent(new Event('storage'));
  }, [chats]);

  // 2. Khi chọn một chat mới, reset unread của chat đó về 0
  useEffect(() => {
    if (active_chat) {
      set_chats(prev => prev.map(chat => 
        chat.id === active_chat ? { ...chat, unread: 0 } : chat
      ));
    }
  }, [active_chat]);

  // --- LOGIC LỌC VÀ SẮP XẾP ---
  const displayChats = useMemo(() => {
    const filtered = chats.filter(customer => 
      customer.name.toLowerCase().includes(searchText.toLowerCase())
    );
    return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [chats, searchText]);

  const current_chat = chats.find(c => c.id === active_chat);

  useEffect(() => {
    if (scroll_ref.current) {
      scroll_ref.current.scrollTo({ top: scroll_ref.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, active_chat]);

  const handle_send = () => {
    if (!input_value.trim()) return;

    const now = Date.now();
    const time_string = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const new_msg = {
      id: now,
      sender: 'partner',
      text: input_value,
      time: time_string,
      chat_id: active_chat
    };

    set_messages(prev => [...prev, new_msg]);
    
    set_chats(prev_chats => {
      return prev_chats.map(chat => 
        chat.id === active_chat 
          ? { ...chat, lastMsg: input_value, updatedAt: now, unread: 0 } 
          : chat
      );
    });

    set_input_value('');
  };

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ padding: '20px 5%', height: 'calc(100vh - 80px)' }}>
        <Layout style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', height: '100%', boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}>
          
          <Sider width={350} theme="light" style={{ borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', background: '#fff', flexShrink: 0 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={4} style={{ margin: 0, color: '#1a3353' }}>
                  <MessageOutlined /> Khách hàng
                </Title>
                <Input 
                  placeholder="Tìm tên khách hàng..." 
                  variant="filled" 
                  style={{ marginTop: 10, borderRadius: 8 }} 
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                  prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                />
              </Space>
            </div>
            
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {displayChats.length > 0 ? (
                <List
                  dataSource={displayChats}
                  renderItem={(item) => (
                    <List.Item
                      onClick={() => set_active_chat(item.id)}
                      style={{
                        padding: '16px 20px',
                        cursor: 'pointer',
                        transition: '0.3s',
                        background: active_chat === item.id ? '#e6f7ff' : 'transparent',
                        borderBottom: '1px solid #f9f9f9'
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          <Badge dot status={item.online ? "success" : "default"} offset={[-2, 32]}>
                            <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
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
              ) : (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy kết quả" />
                </div>
              )}
            </div>
          </Sider>

          <Content style={{ display: 'flex', flexDirection: 'column', background: '#fcfcfc' }}>
            {current_chat ? (
              <>
                <div style={{ padding: '16px 30px', background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                  <Space size="middle">
                    <Avatar size={44} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                    <div>
                      <Text strong style={{ fontSize: 16 }}>{current_chat.name}</Text>
                      <br />
                      <Badge status={current_chat.online ? "success" : "default"} text={current_chat.online ? "Đang trực tuyến" : "Ngoại tuyến"} style={{ fontSize: 12 }} />
                    </div>
                  </Space>
                </div>

                <div ref={scroll_ref} style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {messages.filter(m => m.chat_id === active_chat).map((msg) => {
                    const is_me = msg.sender === 'partner';
                    return (
                      <div key={msg.id} style={{ alignSelf: is_me ? 'flex-end' : 'flex-start', maxWidth: '65%' }}>
                        <div style={{
                          padding: '12px 18px',
                          borderRadius: is_me ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                          background: is_me ? '#1890ff' : '#fff',
                          color: is_me ? '#fff' : '#1a3353',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                        }}>
                          {msg.text}
                        </div>
                        <Text type="secondary" style={{ fontSize: '10px', marginTop: 4, display: 'block', textAlign: is_me ? 'right' : 'left' }}>{msg.time}</Text>
                      </div>
                    );
                  })}
                </div>

                <div style={{ padding: '24px 30px', background: '#fff', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Input 
                      placeholder="Nhập nội dung tư vấn..." 
                      variant="filled" size="large" 
                      style={{ borderRadius: 25, padding: '10px 20px' }}
                      value={input_value}
                      onChange={(e) => set_input_value(e.target.value)}
                      onPressEnter={handle_send}
                    />
                    <Button type="primary" shape="circle" size="large" icon={<SendOutlined />} onClick={handle_send} style={{ height: 46, width: 46 }} />
                  </div>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Empty description="Chọn hội thoại để bắt đầu" />
              </div>
            )}
          </Content>
        </Layout>
      </div>
    </div>
  );
};

export default PartnerMessages;