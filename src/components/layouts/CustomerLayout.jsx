import React from 'react';
import { Layout, Menu, Avatar, Space, Typography, Button, Dropdown, Divider, Row, Col } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  UserOutlined, 
  HomeOutlined, 
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons'

const { Header, Content, Footer } = Layout;
const { Text, Title, Link } = Typography;

const CustomerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = location.pathname.startsWith('/customer');

  const userMenu = {
    items: [
      { key: '1', label: 'Hồ sơ cá nhân', icon: <UserOutlined />, onClick: () => navigate('/customer/profile') },
      { key: '2', label: 'Cài đặt', icon: <SettingOutlined /> },
      { type: 'divider' },
      { key: '3', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true, onClick: () => navigate('/') },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* --- HEADER --- */}
      <Header style={{ 
        position: 'fixed', zIndex: 1000, width: '100%', background: '#fff', 
        display: 'flex', alignItems: 'center', 
        padding: '0 2%', // Giảm padding header để thanh điều hướng rộng hơn
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: '64px', top: 0, left: 0 
      }}>
        <div 
          style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff', cursor: 'pointer', display: 'flex', alignItems: 'center', flex: 1 }} 
          onClick={() => navigate(isLoggedIn ? '/customer/home' : '/')}
        >
          <HomeOutlined style={{ marginRight: 8 }} />
          HOTEL BOOKING
        </div>

        <Space size="large">
          {!isLoggedIn ? (
            <Space>
              <Button type="text" onClick={() => navigate('/login')}>Đăng nhập</Button>
              <Button type="primary" style={{ borderRadius: '6px' }} onClick={() => navigate('/register')}>Đăng ký</Button>
            </Space>
          ) : (
            <Dropdown menu={userMenu} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer', marginLeft: 8 }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              </Space>
            </Dropdown>
          )}
        </Space>
      </Header>

      {/* --- CONTENT (PHẦN NÀY ĐÃ ĐƯỢC MỞ RỘNG) --- */}
      <Content style={{ marginTop: 64, background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ 
          padding: '24px 2%', // Giảm từ 5% xuống 2% để file con rộng ra
          maxWidth: '1600px', // Cho phép mở rộng tối đa lên tới 1600px thay vì bó hẹp
          margin: '0 auto'    // Căn giữa nội dung nếu màn hình quá lớn
        }}>
            <Outlet /> 
        </div>
      </Content>

      {/* --- FOOTER (PHIÊN BẢN MỞ RỘNG) --- */}
      <Footer style={{ background: '#f5f5f5', padding: '40px 0 20px', borderTop: '1px solid #e8e8e8' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2%' }}>
          
          {/* Danh sách link mở rộng */}
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={5}>
              <Title level={5} style={{ fontSize: '14px', marginBottom: '16px' }}>Hỗ trợ</Title>
              <Space direction="vertical" size="xs" style={{ width: '100%' }}>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Quản lý các chuyến đi</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Liên hệ Dịch vụ Khách hàng</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Trung tâm thông tin bảo mật</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Hướng dẫn và báo cáo nội dung</Link>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Title level={5} style={{ fontSize: '14px', marginBottom: '16px' }}>Khám phá thêm</Title>
              <Space direction="vertical" size="xs" style={{ width: '100%' }}>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Chương trình khách hàng thân thiết</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Ưu đãi theo mùa và dịp lễ</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Bài viết về du lịch</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Booking.com dành cho Doanh Nghiệp</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Traveller Review Awards</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Tìm chuyến bay</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Đặt nhà hàng</Link>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Title level={5} style={{ fontSize: '14px', marginBottom: '16px' }}>Điều khoản và cài đặt</Title>
              <Space direction="vertical" size="xs" style={{ width: '100%' }}>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Chính sách Bảo mật</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Điều khoản dịch vụ</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Chính sách về Khả năng tiếp cận</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Tranh chấp đối tác</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Chính sách chống Nô lệ Hiện đại</Link>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Title level={5} style={{ fontSize: '14px', marginBottom: '16px' }}>Dành cho đối tác</Title>
              <Space direction="vertical" size="xs" style={{ width: '100%' }}>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Đăng nhập vào trang Extranet</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Trợ giúp đối tác</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Đăng chỗ nghỉ của Quý vị</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Trở thành đối tác phân phối</Link>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Title level={5} style={{ fontSize: '14px', marginBottom: '16px' }}>Về chúng tôi</Title>
              <Space direction="vertical" size="xs" style={{ width: '100%' }}>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Về Booking.com</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Cách hoạt động</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Du lịch bền vững</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Truyền thông</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Cơ hội việc làm</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Liên hệ công ty</Link>
              </Space>
            </Col>
          </Row>

          <Divider style={{ margin: '30px 0' }} />

          {/* Phần Quốc gia & Tiền tệ */}
          <div style={{ marginBottom: '30px' }}>
            <Space size="large">
              <Space><img src="https://flagcdn.com/w20/vn.png" alt="VN" /> <Text strong>VND</Text></Space>
              <Text style={{ fontSize: '13px', color: '#595959' }}>Tiếng Việt</Text>
            </Space>
          </div>

          {/* Phần Logo các thương hiệu liên kết */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '15px' }}>
              Booking.com là một phần của Booking Holdings Inc., tập đoàn đứng đầu thế giới về du lịch trực tuyến và các dịch vụ liên quan.
            </Text>
            <Row justify="center" align="middle" gutter={[24, 16]}>
              {['Booking.com', 'Priceline', 'KAYAK', 'Agoda', 'OpenTable'].map(brand => (
                <Col key={brand}>
                  <Text strong style={{ color: '#bfbfbf', fontSize: '16px' }}>{brand}</Text>
                </Col>
              ))}
            </Row>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Text style={{ color: '#595959', fontSize: '12px' }}>
              Bản quyền © 1996 - 2026 Booking.com™. Bảo lưu mọi quyền.
            </Text>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default CustomerLayout;