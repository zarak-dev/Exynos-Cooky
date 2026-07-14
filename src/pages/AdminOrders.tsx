import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Table, Tag, Button, Space, message,Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { updateOrderStatus, type Order } from '../store/orderSlice';
import { type RootState } from '../store';

interface OrderItem {
  id: string;
  customerName: string;
  boxSize: string;
  contents: string;
  totalPrice: number;
  status: 'Pending' | 'Baking' | 'Dispatched';
  timestamp: string;
}

const { Title } = Typography;

export const AdminOrders: React.FC = () => {
  const dispatch = useDispatch();

  // 🌟 Cleanly read the orders array from Redux (holds both your hardcoded data & new orders!)
  const orders = useSelector((state: RootState) => state.orders.orders);

 const handleStatusChange = (orderId: string, newStatus: any) => {
  dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  message.success(`Order ${orderId} updated to ${newStatus}`);
  };
  const advanceOrderStatus = (orderId: string, currentStatus: string) => {
  // Map your status progression (e.g. Pending -> Baking -> Dispatched)
  let nextStatus: 'Pending' | 'Baking' | 'Dispatched' | 'Delivered' = 'Pending';
  
  if (currentStatus === 'Pending') nextStatus = 'Baking';
  else if (currentStatus === 'Baking') nextStatus = 'Dispatched';
  else if (currentStatus === 'Dispatched') nextStatus = 'Delivered';

  // 🌟 Dispatch directly to Redux!
  dispatch(updateOrderStatus({ id: orderId, status: nextStatus }));
};

  const columns: ColumnsType<Order> = [
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