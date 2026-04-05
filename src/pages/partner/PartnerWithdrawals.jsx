import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Tag, Button, Typography, Row, Col, 
  Statistic, Form, Input, InputNumber, App as AntApp, 
  Space, Divider, Alert, Tooltip // ĐÃ THÊM TOOLTIP VÀO ĐÂY ĐỂ HẾT LỖI
} from 'antd';
import { 
  WalletOutlined, SendOutlined, HistoryOutlined, 
  BankOutlined, CheckCircleOutlined, InfoCircleOutlined 
} from '@ant-design/icons';
import axiosClient from '../../services/axiosClient';

const { Title, Text } = Typography;

const PartnerWithdrawals = () => {
  const { message: antd_message } = AntApp.useApp();
  const [form] = Form.useForm();
  
  const [withdrawal_history, set_withdrawal_history] = useState([]);
  const [balance, set_balance] = useState({ available: 12500000, pending: 4200000 });
  const [is_loading, set_is_loading] = useState(false);

  // Hàm lấy lịch sử - Có Mock Data dự phòng
  const fetch_history = async () => {
    set_is_loading(true);
    try {
      const response = await axiosClient.get('/partner/withdrawals/history');
      const data = response.data || response;
      set_withdrawal_history(Array.isArray(data) ? data : []);
    } catch (error) {
      console.warn("Backend đang offline, dùng dữ liệu mẫu để test UI");
      set_withdrawal_history([
        { id: '1', created_at: '2026-03-20', amount: 5000000, bank_info: 'VCB - 001100123456 - NGUYEN VAN A', status: 'Success' },
        { id: '2', created_at: '2026-03-24', amount: 2000000, bank_info: 'VCB - 001100123456 - NGUYEN VAN A', status: 'Pending' },
      ]);
    } finally {
      set_is_loading(false);
    }
  };

  useEffect(() => {
    fetch_history();
  }, []);

  const on_finish = async (values) => {
    if (values.amount > balance.available) {
      return antd_message?.error('Số dư khả dụng không đủ để rút!');
    }

    set_is_loading(true);
    try {
      await axiosClient.post('/partner/withdrawals/request', values);
      antd_message?.success('Yêu cầu rút tiền đã được gửi thành công!');
      set_balance(prev => ({ ...prev, available: prev.available - values.amount }));
      form.resetFields();
      fetch_history();
    } catch (error) {
      antd_message?.error('Lỗi hệ thống hoặc Server chưa bật!');
    } finally {
      set_is_loading(false);
    }
  };

  const columns = [
    { 
      title: 'Mã GD', 
      dataIndex: 'id', 
      key: 'id',
      render: (id) => <Text code>#{id}</Text>
    },
    { 
      title: 'Số tiền', 
      dataIndex: 'amount', 
      key: 'amount', 
      render: (val) => <Text strong style={{ color: '#1a3353' }}>{val.toLocaleString()}₫</Text> 
    },
    { 
      title: 'Tài khoản đích', 
      dataIndex: 'bank_info', 
      key: 'bank_info',
      render: (text) => (
        <Tooltip title={text}>
          <Text ellipsis style={{ maxWidth: 150 }}>{text}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'right',
      render: (status) => {
        const colors = { Success: 'green', Pending: 'orange', Failed: 'red' };
        const labels = { Success: 'Thành công', Pending: 'Chờ duyệt', Failed: 'Từ chối' };
        return <Tag bordered={false} color={colors[status]}>{labels[status] || status}</Tag>;
      }
    }
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ padding: '40px 5%', maxWidth: 1400, margin: '0 auto' }}>
        <Title level={2} style={{ color: '#1a3353' }}>Tài chính & Thanh toán</Title>
        <Text type="secondary">Yêu cầu rút doanh thu về tài khoản ngân hàng cá nhân</Text>
        
        <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
          {/* Form & Số dư */}
          <Col xs={24} lg={9}>
            <Card bordered={false} style={{ borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic 
                    title="Số dư khả dụng" 
                    value={balance.available} 
                    suffix="₫" 
                    valueStyle={{ color: '#52c41a', fontWeight: 800, fontSize: 22 }} 
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="Đang đóng băng" 
                    value={balance.pending} 
                    suffix="₫" 
                    valueStyle={{ color: '#faad14', fontWeight: 800, fontSize: 22 }} 
                  />
                </Col>
              </Row>

              <Divider style={{ margin: '20px 0' }} />
              
              <Alert
                message="Lưu ý rút tiền"
                description="Hạn mức tối thiểu 100.000₫. Xử lý trong 24h làm việc."
                type="info"
                showIcon
                style={{ marginBottom: 24, borderRadius: 12 }}
              />
              
              <Form form={form} layout="vertical" onFinish={on_finish}>
                <Form.Item 
                  name="amount" 
                  label={<Text strong>Số tiền muốn rút</Text>} 
                  rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    size="large"
                    min={100000}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\D/g, '')}
                    prefix={<BankOutlined />}
                    placeholder="Nhập số tiền..."
                  />
                </Form.Item>

                <Form.Item 
                  name="bank_info" 
                  label={<Text strong>Thông tin nhận tiền</Text>} 
                  rules={[{ required: true, message: 'Nhập STK và tên ngân hàng' }]}
                >
                  <Input.TextArea 
                    placeholder="Ví dụ: VCB - 001100... - NGUYEN VAN A" 
                    rows={3} 
                    style={{ borderRadius: 12 }}
                  />
                </Form.Item>

                <Button 
                  type="primary" block size="large" icon={<SendOutlined />} 
                  htmlType="submit" loading={is_loading}
                  style={{ borderRadius: 12, height: 50, fontWeight: 600, marginTop: 10 }}
                >
                  Xác nhận gửi yêu cầu
                </Button>
              </Form>
            </Card>
          </Col>

          {/* Bảng lịch sử */}
          <Col xs={24} lg={15}>
            <Card 
              bordered={false}
              style={{ borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}
              title={
                <Space>
                  <HistoryOutlined style={{ color: '#1890ff' }} />
                  <span style={{ fontWeight: 700 }}>Lịch sử giao dịch</span>
                </Space>
              }
            >
              <Table
                dataSource={withdrawal_history}
                columns={columns}
                rowKey="id"
                loading={is_loading}
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PartnerWithdrawals;