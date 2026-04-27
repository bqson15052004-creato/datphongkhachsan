import React from 'react';
import { Layout, Divider, Row, Col, Typography, Space } from 'antd';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';

const { Content, Footer } = Layout;
const { Text, Title, Link } = Typography;

const CustomerLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar /> 

      {/* 1. CONTENT */}
      <Content style={{ 
        marginTop: 64, 
        background: '#f0f2f5', 
        minHeight: 'calc(100vh - 64px)' 
      }}>
        <div style={{ 
          padding: '24px 2%', 
          maxWidth: '1600px',
          margin: '0 auto' 
        }}>
            <Outlet /> 
        </div>
      </Content>

      {/* 2. FOOTER (Phiên bản mở rộng) */}
      <Footer style={{ background: '#f5f5f5', padding: '40px 0 20px', borderTop: '1px solid #e8e8e8' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2%' }}>
          
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
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Tìm chuyến bay</Link>
              </Space>
            </Col>

            <Col xs={24} sm={12} md={5}>
              <Title level={5} style={{ fontSize: '14px', marginBottom: '16px' }}>Điều khoản và cài đặt</Title>
              <Space direction="vertical" size="xs" style={{ width: '100%' }}>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Chính sách Bảo mật</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Điều khoản dịch vụ</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Chính sách về Khả năng tiếp cận</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Tranh chấp đối tác</Link>
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
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Về STAYVN</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Cách hoạt động</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Du lịch bền vững</Link>
                <Link href="#" style={{ color: '#006CE4', fontSize: '13px' }}>Cơ hội việc làm</Link>
              </Space>
            </Col>
          </Row>

          <Divider style={{ margin: '30px 0' }} />

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '15px' }}>
              STAYVN là một phần của hệ thống du lịch trực tuyến hàng đầu thế giới.
            </Text>
            <Row justify="center" align="middle" gutter={[24, 16]}>
              {['Booking.com', 'Agoda', 'KAYAK', 'Priceline'].map(brand => (
                <Col key={brand}>
                  <Text strong style={{ color: '#bfbfbf', fontSize: '16px' }}>{brand}</Text>
                </Col>
              ))}
            </Row>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Text style={{ color: '#595959', fontSize: '12px' }}>
              Bản quyền © 1996 - 2026 STAYVN™. Bảo lưu mọi quyền.
            </Text>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default CustomerLayout;