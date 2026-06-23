import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons';

interface OrderItem {
  id: string;
  customerName: string;
  boxSize: string;
  contents: string;
  totalPrice: number;
  status: 'Pending' | 'Baking' | 'Dispatched';
  timestamp: string;
}

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: "EXNS-9481",
      customerName: "Jimmy Khan",
      boxSize: "6-Pack Signature Box",
      contents: "3x Triple Chocolate, 3x Classic Chocolate Chip",
      totalPrice: 1850,
      status: "Baking",
      timestamp: "10 mins ago"
    },
    {
      id: "EXNS-9482",
      customerName: "Baddie Khan",
      boxSize: "12-Pack Party Box",
      contents: "4x Lotus Biscoff, 4x Velvet Red, 4x Peanut Butter Crunch",
      totalPrice: 3400,
      status: "Pending",
      timestamp: "24 mins ago"
    },
    {
      id: "EXNS-9483",
      customerName: "Bilal Ahmed",
      boxSize: "4-Pack Sample Box",
      contents: "2x Matcha White Choc, 2x Salted Caramel",
      totalPrice: 1200,
      status: "Dispatched",
      timestamp: "1 hour ago"
    }
    ,
    {
      id: "EXNS-9486",
      customerName: "Milly Khan",
      boxSize: "4-Pack Sample Box",
      contents: "2x Matcha White Choc, 2x Salted Caramel",
      totalPrice: 1200,
      status: "Dispatched",
      timestamp: "1 hour ago"
    }
  ]);

  const advanceOrderStatus = (id: string, currentStatus: 'Pending' | 'Baking' | 'Dispatched') => {
    let nextStatus: 'Pending' | 'Baking' | 'Dispatched' = currentStatus;
    
    if (currentStatus === 'Pending') nextStatus = 'Baking';
    else if (currentStatus === 'Baking') nextStatus = 'Dispatched';

    setOrders(prev => 
      prev.map(order => order.id === id ? { ...order, status: nextStatus } : order)
    );

    message.success(`Order ${id} advanced to ${nextStatus}!`);
  };

  const columns: ColumnsType<OrderItem> = [
    {
      title: 'ORDER ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <code style={{ fontWeight: 700, color: '#333' }}>{text}</code>,
    },
    {
      title: 'CUSTOMER',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text) => <strong style={{ color: '#00009c' }}>{text}</strong>,
    },
    {
      title: 'BOX SELECTION',
      dataIndex: 'boxSize',
      key: 'boxSize',
    },
    {
      title: 'CONTENTS SUMMARY',
      dataIndex: 'contents',
      key: 'contents',
      ellipsis: true,
    },
    {
      title: 'TOTAL',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (val) => <span>Rs. {val}</span>,
    },
    {
      title: 'FULFILLMENT STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'Pending' | 'Baking' | 'Dispatched') => {
        if (status === 'Pending') return <Tag icon={<ClockCircleOutlined />} color="warning">PENDING QUEUE</Tag>;
        if (status === 'Baking') return <Tag icon={<SyncOutlined spin />} color="processing">IN OVEN / BAKING</Tag>;
        return <Tag icon={<CheckCircleOutlined />} color="success">DISPATCHED</Tag>;
      },
    },
    {
      title: 'PIPELINE ACTIONS',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          {record.status !== 'Dispatched' ? (
            <Button 
              type="primary" 
              size="small"
              style={{ background: record.status === 'Pending' ? '#fa8c16' : '#52c41a', borderColor: 'transparent' }}
              onClick={() => advanceOrderStatus(record.id, record.status)}
            >
              {record.status === 'Pending' ? 'Start Baking' : 'Mark Dispatched'}
            </Button>
          ) : (
            <span style={{ color: '#8c8c8c', fontSize: '0.85rem' }}>Complete ✓</span>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ color: '#00009c', margin: 0, fontWeight: 800, fontSize: '1.8rem' }}>
        CUSTOMER ORDERS STREAM
      </h1>

      <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Table 
          columns={columns} 
          dataSource={orders} 
          rowKey="id" 
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AdminOrders;