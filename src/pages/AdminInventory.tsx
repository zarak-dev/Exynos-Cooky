import React from 'react';
import { Table, Tag, Switch, Space, Card, Image, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useSelector, useDispatch } from 'react-redux';
import { toggleItemAvailability } from '../store/inventorySlice';
import { type RootState } from '../store';

interface CookieItem {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
  imageUrl: string;
  description: string;
}

export const AdminInventory: React.FC = () => {
const inventory = useSelector((state: RootState) => state.inventory.items);
  const dispatch = useDispatch();
  const handleAvailabilityChange = (id: number, checked: boolean) => {
   dispatch(toggleItemAvailability({ id, isAvailable: checked })
    );
    
    const targetItem = inventory.find(item => item.id === id);
    if (checked) {
      message.success(`"${targetItem?.name}" is now active on the storefront! 🍪`);
    } else {
      message.warning(`"${targetItem?.name}" marked as Sold Out.`);
    }
  };

  // Define table columns matching our storefront structures
  const columns: ColumnsType<CookieItem> = [
    {
      title: 'IMAGE',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 100,
      render: (url: string, record) => (
        <Image 
          src={url} 
          alt={record.name} 
          width={60} 
          style={{ borderRadius: 6, objectFit: 'cover' }} 
        />
      ),
    },
    {
      title: 'COOKIE NAME',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong style={{ color: '#00009c' }}>{text}</strong>,
    },
    {
      title: 'PRICE',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <span>Rs. {price}</span>,
    },
    {
      title: 'STATUS',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (isAvailable: boolean) => (
        <Tag color={isAvailable ? 'success' : 'error'} style={{ fontWeight: 600 }}>
          {isAvailable ? 'AVAILABLE' : 'SOLD OUT'}
        </Tag>
      ),
    },
    {
      title: 'TOGGLE AVAILABILITY',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Switch 
            checkedChildren="ON" 
            unCheckedChildren="OFF" 
            checked={record.isAvailable} 
            onChange={(checked) => handleAvailabilityChange(record.id, checked)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ color: '#00009c', margin: 0, fontWeight: 800, fontSize: '1.8rem' }}>
        INVENTORY MANAGEMENT
      </h1>

      <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Table 
          columns={columns} 
          dataSource={inventory} 
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default AdminInventory;