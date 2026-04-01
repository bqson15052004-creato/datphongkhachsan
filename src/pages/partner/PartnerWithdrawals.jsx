import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Tag, Button, Typography, Row, Col, 
  Statistic, Form, Input, InputNumber, message, Space, Spin 
} from 'antd';
import { WalletOutlined, SendOutlined, HistoryOutlined } from '@ant-design/icons';
import axiosClient from '../../services/axiosClient';

const { Title, Text } = Typography;

const PartnerWithdrawals = () => {
  const [form] = Form.useForm();
  const [is_loading, set_is_loading] = useState(false);
  const [available_balance, set_available_balance] = useState(0);
  const [withdrawal_history, set_withdrawal_history] = useState([]);

  // 1. Lấy số dư và lịch sử từ Node.js
  const fetch_withdrawal_data = async () => {
    try {
      set_is_loading(true);
      const response = await axios_client.get('/partners/withdrawals');
      set_available_balance(response.data.data.balance);
      set_withdrawal_history(response.data.data.history);
    } catch (error) {
      const error_msg = error.response?.data?.message || "Không thể tải dữ arrows liệu";
      message.error(error_msg);
    } finally {
      set_is_loading(false);
    }
  };

  useEffect(() => {
    fetch_withdrawal_data();
  }, []);

  // 2. Gửi yêu cầu rút tiền
  const on_finish = async (values) => {
    try {
      if (values.amount > available_balance) {
        return message.error("Số dư không đủ để thực hiện giao dịch!");
      }

      const payload = {
        amount: values.amount,
        bank_info: values.bank_info,
        requested_at: new Date()
      };

      await axios_client.post('/partners/withdrawals/request', payload);
      
      message.success('Yêu cầu rút tiền đã được gửi tới hệ thống!');
      form.resetFields();
      fetch_withdrawal_data();
    } catch (error) {
      message.error("Gửi yêu cầu thất bại. Vui lòng thử lại sau.");
    }
  };

  const columns = [
    { 
      title: 'Ngày yêu cầu', 
      data_index: 'created_at', 
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    { 
      title: 'Số tiền', 
      data_index: 'amount', 
      key: 'amount', 
      render: (val) => <Text strong>{val?.toLocaleString()}đ</Text> 
    },
    { 
      title: 'Tài khoản nhận', 
      data_index: 'bank_info', 
      key: 'bank_info',
      render: (info) => <Text type="secondary" style={{ fontSize: 12 }}>{info}</Text>
    },
    { 
      title: 'Trạng thái', 
      data_index: 'status', 
      key: 'status',
      render: (status) => {
        const status_map = {
          'Pending': { color: 'orange', text: 'Chờ duyệt' },
          'Success': { color: 'green', text: 'Thành công' },
          'Rejected': { color: 'red', text: 'Bị từ chối' }
        };
        const current = status_map[status] || { color: 'default', text: status };
        return <Tag color={current.color}>{current.text.toUpperCase()}</Tag>;
      }
    }
  ];

  return (
    <div style={container_style}>
      <Title level={3} style={{ marginBottom: 24 }}>Quản lý tài chính</Title>
      
      <Row gutter={24}>
        {/* Cột trái: Form yêu cầu */}
        <Col xs={24} lg={10}>
          <Card 
            bordered={false} 
            style={card_style}
            title={<Space><WalletOutlined style={{ color: '#1890ff' }} /> Gửi yêu cầu rút tiền</Space>}
          >
            <Statistic 
              title="Số dư khả dụng" 
              value={available_balance} 
              suffix="VNĐ" 
              valueStyle={{ color: '#3f8600', fontWeight: 'bold' }} 
            />
            
            <hr style={divider_style} />
            
            <Form form={form} layout="vertical" onFinish={on_finish}>
              <Form.Item 
                name="amount" 
                label="Số tiền rút" 
                rules={[{ required: true, message: 'Nhập số tiền cần rút!' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  size="large"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="Tối thiểu 100,000đ"
                  min={100000}
                />
              </Form.Item>

              <Form.Item 
                name="bank_info" 
                label="Thông tin ngân hàng" 
                rules={[{ required: true, message: 'Nhập STK, Tên chủ thẻ và Ngân hàng!' }]}
              >
                <Input.TextArea 
                  placeholder="Ví dụ: 001100123456 - VCB - NGUYEN VAN A" 
                  rows={3} 
                />
              </Form.Item>

              <Button 
                type="primary" 
                block 
                size="large"
                icon={<SendOutlined />} 
                htmlType="submit"
                style={{ borderRadius: 8, height: 45 }}
              >
                Gửi yêu cầu rút tiền
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Cột phải: Lịch sử */}
        <Col xs={24} lg={14}>
          <Card 
            bordered={false} 
            style={card_style}
            title={<Space><HistoryOutlined style={{ color: '#1890ff' }} /> Lịch sử giao dịch</Space>}
          >
            <Table 
              dataSource={withdrawal_history} 
              columns={columns}
              rowKey="_id"
              loading={is_loading}
              pagination={{ pageSize: 6 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Hệ thống Style Constants
const container_style = { padding: '24px', background: '#f5f7fa', minHeight: '100vh' };
const card_style = { borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const divider_style = { border: '0.5px solid #f0f0f0', margin: '20px 0' };

export default PartnerWithdrawals;