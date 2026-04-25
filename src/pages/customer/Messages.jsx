import React, { useState, useEffect, useRef } from 'react';
import { Layout, List, Avatar, Input, Button, Typography, Badge, Card, Space, Empty } from 'antd';
import { SendOutlined, ShopOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { MOCK_USERS, MOCK_HOTELS } from '../../constants/mockData';

const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hotelFromState = location.state;
  const scrollRef = useRef(null);

  // 1. KẾT NỐI DỮ LIỆU: Khởi tạo từ kho khách sạn
  const [allChats, setAllChats] = useState(() => {
    return MOCK_HOTELS.filter(h => h.id_hotel <= 2).map(hotel => {
      const partner = MOCK_USERS.find(u => u.id === hotel.owner_id);
      return {
        id: hotel.id_hotel,
        name: hotel.hotel_name,
        partnerName: partner?.full_name,
        avatar: hotel.image_url,
        lastMsg: 'Chúng tôi có thể giúp gì cho bạn?',
        time: '10:30',
        unread: 0
      };
    });
  });

  const [searchText, setSearchText] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'hotel', text: 'Chào bạn, chúng tôi có thể giúp gì cho bạn?', time: '10:25' },
  ]);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // 2. LOGIC TÌM KIẾM (Chỉ cần 1 từ là ra)
  const displayChats = () => {
    if (!searchText) return allChats;

    const filteredInternal = allChats.filter(c => 
      c.name.toLowerCase().includes(searchText.toLowerCase())
    );

    if (filteredInternal.length === 0) {
      return MOCK_HOTELS.filter(h => 
        h.hotel_name.toLowerCase().includes(searchText.toLowerCase())
      ).map(h => ({
        id: h.id_hotel,
        name: h.hotel_name,
        avatar: h.image_url,
        lastMsg: 'Bấm để bắt đầu nhắn tin...',
        time: '',
        unread: 0,
        isNewSearch: true
      }));
    }
    return filteredInternal;
  };

  // 3. XỬ LÝ CHỌN CHAT
  const handleSelectChat = (chat) => {
    const isExisted = allChats.find(c => c.id === chat.id);
    if (!isExisted) {
      const newEntry = { ...chat, isNewSearch: false, lastMsg: 'Bắt đầu trò chuyện...' };
      setAllChats([newEntry, ...allChats]);
      setSelectedChat(newEntry);
      setChatHistory([]); 
    } else {
      setSelectedChat(chat);
    }
  };

  useEffect(() => {
    if (hotelFromState && hotelFromState.hotelId) {
      const hotel = MOCK_HOTELS.find(h => h.id_hotel === hotelFromState.hotelId);
      if (hotel) {
        handleSelectChat({
          id: hotel.id_hotel,
          name: hotel.hotel_name,
          avatar: hotel.image_url,
          lastMsg: 'Bạn vừa chọn khách sạn này từ trang chủ',
          time: 'Bây giờ'
        });
      }
    } else if (!selectedChat && allChats.length > 0) {
      setSelectedChat(allChats[0]);
    }
  }, [hotelFromState]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory([...chatHistory, newMessage]);
    
    setAllChats(allChats.map(c => 
      c.id === selectedChat.id ? { ...c, lastMsg: message, time: 'Vừa xong' } : c
    ));
    setMessage('');
  };

  return (
    <Layout style={{ height: '100vh', backgroundColor: '#f0f2f5', overflow: 'hidden' }}>
      <Navbar />
      <Content style={{ padding: '24px', height: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center' }}>
        <Card 
          styles={{ body: { padding: 0, height: '100%' } }} 
          style={{ width: '100%', maxWidth: 1200, height: '80vh', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
        >
          <Layout style={{ height: '100%', background: '#fff' }}>
            
            {/* SIDEBAR TRÁI: Cố định chiều cao, tự cuộn danh sách khách sạn */}
            <Sider width={350} theme="light" style={{ borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
                <Title level={4} style={{ marginBottom: 16 }}>Tin nhắn</Title>
                <Input 
                  placeholder="Tìm tên khách sạn..." 
                  prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                  style={{ borderRadius: 8, backgroundColor: '#f5f5f5', border: 'none' }}
                />
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {displayChats().length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={displayChats()}
                    renderItem={(item) => (
                      <List.Item 
                        onClick={() => handleSelectChat(item)}
                        style={{ 
                          padding: '15px 20px', 
                          cursor: 'pointer', 
                          backgroundColor: selectedChat?.id === item.id ? '#e6f7ff' : 'transparent',
                        }}
                      >
                        <List.Item.Meta
                          avatar={<Badge count={item.unread}><Avatar size={48} src={item.avatar} icon={<ShopOutlined />} /></Badge>}
                          title={<Text strong>{item.name}</Text>}
                          description={<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 180 }}>{item.lastMsg}</div>}
                        />
                        <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không thấy khách sạn" />
                )}
              </div>
            </Sider>

            {/* KHUNG CHAT PHẢI: Flexbox để ghim Footer */}
            <Layout style={{ background: '#fff', display: 'flex', flexDirection: 'column', height: '100%' }}>
              {selectedChat ? (
                <>
                  {/* Header - Luôn nằm trên cùng */}
                  <div style={{ padding: '15px 25px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <Space size="middle">
                      <Avatar src={selectedChat.avatar} size="large" icon={<ShopOutlined />} />
                      <div>
                        <Text strong style={{ display: 'block' }}>{selectedChat.name}</Text>
                        <Text type="success" style={{ fontSize: 12 }}>● Đang hoạt động</Text>
                      </div>
                    </Space>
                    <Button icon={<ShopOutlined />} onClick={() => navigate(`/hotel/${selectedChat.id}`)}>Xem khách sạn</Button>
                  </div>

                  {/* Vùng tin nhắn - Quan trọng nhất: flex: 1 và overflowY: 'auto' */}
                  <Content 
                    ref={scrollRef}
                    style={{ 
                      flex: 1, 
                      padding: '20px', 
                      overflowY: 'auto', // Chỉ cuộn bên trong vùng này
                      background: '#f9fafb', 
                      display: 'flex', 
                      flexDirection: 'column' 
                    }}
                  >
                    {chatHistory.map((msg) => (
                      <div key={msg.id} style={{ 
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        marginBottom: '15px'
                      }}>
                        <div style={{ 
                          padding: '10px 16px', 
                          borderRadius: msg.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                          backgroundColor: msg.sender === 'user' ? '#1890ff' : '#fff',
                          color: msg.sender === 'user' ? '#fff' : '#000',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}>
                          {msg.text}
                        </div>
                        <Text type="secondary" style={{ fontSize: 10, display: 'block', textAlign: msg.sender === 'user' ? 'right' : 'left', marginTop: 4 }}>
                          {msg.time}
                        </Text>
                      </div>
                    ))}
                  </Content>

                  {/* Footer (Ô nhập liệu) - Luôn nằm sát đáy Card */}
                  <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', background: '#fff', flexShrink: 0 }}>
                    <Space.Compact style={{ width: '100%' }}>
                      <Input 
                        placeholder="Nhập tin nhắn..." 
                        size="large" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onPressEnter={handleSend}
                      />
                      <Button type="primary" size="large" icon={<SendOutlined />} onClick={handleSend}>Gửi</Button>
                    </Space.Compact>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Text type="secondary">Chọn một khách sạn để nhắn tin</Text>
                </div>
              )}
            </Layout>
          </Layout>
        </Card>
      </Content>
    </Layout>
  );
};

export default Messages;