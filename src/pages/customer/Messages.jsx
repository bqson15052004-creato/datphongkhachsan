import React, { useState, useEffect, useRef } from 'react';
import { Layout, List, Avatar, Input, Button, Typography, Badge, Card, Space, Empty } from 'antd';
import { SendOutlined, ShopOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { MOCK_USERS, MOCK_HOTELS } from '../../constants/mockData';

const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Nhận dữ liệu từ HotelDetail (id_hotel, hotel_name, hotel_avatar)
  const hotelFromState = location.state; 
  const scrollRef = useRef(null);

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

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
        time: '', unread: 0, isNewSearch: true
      }));
    }
    return filteredInternal;
  };

  const handleSelectChat = (chat) => {
    const isExisted = allChats.find(c => c.id === chat.id);
    if (!isExisted) {
      const newEntry = { 
        ...chat, 
        isNewSearch: false, 
        lastMsg: 'Bắt đầu trò chuyện...',
        time: 'Bây giờ'
      };
      setAllChats([newEntry, ...allChats]);
      setSelectedChat(newEntry);
      setChatHistory([]); // Reset lịch sử chat cho hotel mới
    } else {
      setSelectedChat(isExisted);
    }
  };

  // XỬ LÝ KHI CÓ DATA TỪ HOTEL DETAIL TRUYỀN SANG
  useEffect(() => {
    if (hotelFromState?.id_hotel) {
      const hotelId = hotelFromState.id_hotel;
      const existedInList = allChats.find(c => c.id === hotelId);

      if (existedInList) {
        setSelectedChat(existedInList);
      } else {
        // Nếu hotel chưa có trong danh sách chat thì tạo mới
        handleSelectChat({
          id: hotelId,
          name: hotelFromState.hotel_name,
          avatar: hotelFromState.hotel_avatar,
          lastMsg: 'Đang kết nối...',
          time: 'Bây giờ'
        });
      }
      
      // Xóa state trong location để tránh việc F5 lại trang nó lại tự chọn lại hotel này
      window.history.replaceState({}, document.title);
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
    <div style={{ height: 'calc(100vh - 140px)', width: '100%', padding: '0 20px 20px' }}>
      <Card 
        styles={{ body: { padding: 0, height: '100%' } }} 
        style={{ 
          height: '100%', 
          borderRadius: 20, 
          overflow: 'hidden', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          border: 'none'
        }}
      >
        <Layout style={{ height: '100%', background: '#fff' }}>
          
          {/* SIDEBAR */}
          <Sider width={320} theme="light" style={{ borderRight: '1px solid #f1f5f9' }}>
            <div style={{ padding: '24px 16px', borderBottom: '1px solid #f1f5f9' }}>
              <Title level={4} style={{ marginBottom: 16, marginTop: 0 }}>Tin nhắn</Title>
              <Input 
                placeholder="Tìm khách sạn..." 
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}
              />
            </div>

            <div style={{ height: 'calc(100% - 115px)', overflowY: 'auto' }}>
              {displayChats().length > 0 ? (
                <List
                  dataSource={displayChats()}
                  renderItem={(item) => (
                    <div 
                      onClick={() => handleSelectChat(item)}
                      style={{ 
                        padding: '16px', 
                        cursor: 'pointer', 
                        transition: 'all 0.3s',
                        backgroundColor: selectedChat?.id === item.id ? '#eff6ff' : 'transparent',
                        borderLeft: selectedChat?.id === item.id ? '4px solid #3b82f6' : '4px solid transparent'
                      }}
                    >
                      <Space size="middle" style={{ width: '100%' }}>
                        <Badge count={item.unread} dot>
                          <Avatar size={48} src={item.avatar} icon={<ShopOutlined />} />
                        </Badge>
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong style={{ fontSize: 14 }}>{item.name}</Text>
                            <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
                          </div>
                          <Text type="secondary" ellipsis style={{ fontSize: 13, display: 'block', width: 180 }}>
                            {item.lastMsg}
                          </Text>
                        </div>
                      </Space>
                    </div>
                  )}
                />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 50 }} />
              )}
            </div>
          </Sider>

          {/* MAIN CHAT AREA */}
          <Layout style={{ background: '#fff' }}>
            {selectedChat ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Space size="middle">
                    <Avatar src={selectedChat.avatar} size="large" />
                    <div>
                      <Text strong style={{ fontSize: 16 }}>{selectedChat.name}</Text>
                      <Text type="success" style={{ fontSize: 12, display: 'block' }}>● Trực tuyến</Text>
                    </div>
                  </Space>
                  <Button 
                    icon={<ShopOutlined />} 
                    shape="round"
                    onClick={() => navigate(`/hotel/${selectedChat.id}`)}
                  >
                    Xem khách sạn
                  </Button>
                </div>

                <div 
                  ref={scrollRef}
                  style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#f8fafc' }}
                >
                  {chatHistory.length > 0 ? chatHistory.map((msg) => (
                    <div key={msg.id} style={{ 
                      display: 'flex', 
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: 16 
                    }}>
                      <div style={{ maxWidth: '70%' }}>
                        <div style={{ 
                          padding: '10px 16px', 
                          borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          background: msg.sender === 'user' ? '#3b82f6' : '#fff',
                          color: msg.sender === 'user' ? '#fff' : '#1e293b',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          fontSize: 14
                        }}>
                          {msg.text}
                        </div>
                        <Text type="secondary" style={{ fontSize: 10, marginTop: 4, display: 'block', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                          {msg.time}
                        </Text>
                      </div>
                    </div>
                  )) : (
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                      <Text type="secondary">Bắt đầu câu chuyện với {selectedChat.name}</Text>
                    </div>
                  )}
                </div>

                <div style={{ padding: '20px 24px', borderTop: '1px solid #f1f5f9' }}>
                  <Space.Compact style={{ width: '100%' }}>
                    <Input 
                      placeholder="Nhập tin nhắn..." 
                      size="large" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onPressEnter={handleSend}
                      style={{ borderRadius: '12px 0 0 12px' }}
                    />
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<SendOutlined />} 
                      onClick={handleSend}
                      style={{ borderRadius: '0 12px 12px 0', width: 80 }}
                    />
                  </Space.Compact>
                </div>
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Empty description="Chọn một cuộc hội thoại để bắt đầu" />
              </div>
            )}
          </Layout>
        </Layout>
      </Card>
    </div>
  );
};

export default Messages;