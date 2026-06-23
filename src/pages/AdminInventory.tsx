// src/pages/AdminInventory.tsx
import React, { useState } from 'react';
import { Table, Tag, Switch, Space, Card, Image, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
// Let's bring in your actual mock data array to view and manipulate
import { COOKIE_MOCK_DATA } from '../utils/mockData'; 

interface CookieItem {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
  imageUrl: string;
  description: string;
}

export const AdminInventory: React.FC = () => {
  // Store the mock data array in local state so toggles trigger UI updates instantly
  const [inventory, setInventory] = useState<CookieItem[]>(COOKIE_MOCK_DATA);

  // Handler to switch availability status back and forth
  const handleAvailabilityChange = (id: number, checked: boolean) => {
    setInventory(prev => 
      prev.map(item => item.id === id ? { ...item, isAvailable: checked } : item)
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