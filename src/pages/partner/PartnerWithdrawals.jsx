import React, { useState } from 'react';
import { Card, Table, Tag, Button, Typography, Row, Col, Statistic, Form, Input, InputNumber, message, Space } from 'antd';
import { WalletOutlined, BankOutlined, SendOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PartnerWithdrawals = () => {
  const [form] = Form.useForm();
  
  // Dữ liệu mẫu lịch sử rút tiền của riêng đối tác này
  const [history, setHistory] = useState([
    { key: '1', date: '2026-03-20', amount: 5000000, bank: 'VCB - 0011xxx', status: 'Thành công' },
    { key: '2', date: '2026-03-24', amount: 2000000, bank: 'VCB - 0011xxx', status: 'Chờ duyệt' },
  ]);

  const onFinish = (values) => {
    const newRequest = {
      key: Date.now().toString(),
      date: new Date().toLocaleDateString('sv-SE'),
      amount: values.amount,
      bank: values.bank,
      status: 'Chờ duyệt'
    };
    setHistory([newRequest, ...history]);
    message.success('Yêu cầu rút tiền đã được gửi tới Admin!');
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={16}>
        {/* Cột trái: Form yêu cầu */}
        <Col span={10}>
          <Card title={<Space><WalletOutlined /> Gửi yêu cầu rút tiền</Space>}>
            <Statistic title="Số dư có thể rút" value={12500000} suffix="đ" valueStyle={{ color: '#3f8600' }} />
            <hr style={{ border: '0.5px solid #f0f0f0', margin: '20px 0' }} />
            
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item name="amount" label="Số tiền muốn rút" rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}>
                <InputNumber 
                  style={{ width: '100%' }} 
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="Nhập số tiền..."
                  min={100000}
                />
              </Form.Item>
              <Form.Item name="bank" label="Thông tin tài khoản nhận tiền" rules={[{ required: true, message: 'Vui lòng nhập STK và Ngân hàng!' }]}>
                <Input.TextArea placeholder="Ví dụ: VCB - 001100123456 - NGUYEN VAN A" rows={2} />
              </Form.Item>
              <Button type="primary" block icon={<SendOutlined />} htmlType="submit">Gửi yêu cầu</Button>
            </Form>
          </Card>
        </Col>

        {/* Cột phải: Lịch sử */}
        <Col span={14}>
          <Card title="Lịch sử rút tiền">
            <Table 
              dataSource={history} 
              pagination={{ pageSize: 5 }}
              columns={[
                { title: 'Ngày rút', dataIndex: 'date', key: 'date' },
                { title: 'Số tiền', dataIndex: 'amount', key: 'amount', render: (val) => `${val.toLocaleString()}đ` },
                { 
                  title: 'Trạng thái', 
                  dataIndex: 'status', 
                  key: 'status',
                  render: (status) => (
                    <Tag color={status === 'Thành công' ? 'green' : 'orange'}>{status}</Tag>
                  )
                }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PartnerWithdrawals;