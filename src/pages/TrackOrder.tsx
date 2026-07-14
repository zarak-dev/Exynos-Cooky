// src/pages/delivery.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import { Card, Input, Steps, Result, Button, message, Badge } from 'antd';
import { SearchOutlined, LoadingOutlined, SmileOutlined, CarOutlined, SolutionOutlined } from '@ant-design/icons';

export const trackOrder: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);

  // Grab live orders from our global Redux store!
  const orders = useSelector((state: RootState) => state.orders.orders);

  const handleSearch = () => {
    const trimmedId = orderId.trim();
    if (!trimmedId) {
      message.warning('Please enter an Order ID to track!');
      return;
    }

    // Search for the order in our global Redux state
    const foundOrder = orders.find(o => o.id.toUpperCase() === trimmedId.toUpperCase());

    if (foundOrder) {
      setSearchedOrder(foundOrder);
      message.success('Order status retrieved successfully!');
    } else {
      setSearchedOrder(null);
      message.error('Order ID not found. Please check your spelling.');
    }
  };

  // Maps order state status string to Steps index
  const getStepStatusIndex = (status: string) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Baking': return 1;
      case 'Dispatched': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
      <h1 style={{ color: '#00009c', fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>
        TRACK YOUR BAKE
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: 32 }}>
        Enter your unique Order ID to track your custom cookie box live.
      </p>

      {/* SEARCH BAR */}
      <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Input 
            size="large" 
            placeholder="Enter your Order ID (e.g., EXNS-12345)" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Button 
            type="primary" 
            size="large" 
            icon={<SearchOutlined />} 
            style={{ background: '#00009c', borderColor: '#00009c' }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </Card>

      {/* TRACKING RESULTS */}
      {searchedOrder ? (
        <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <h3 style={{ margin: 0 }}>Order: <span style={{ color: '#00009c' }}>{searchedOrder.id}</span></h3>
              <p style={{ color: '#888', margin: '4px 0 0 0' }}>Placed: {searchedOrder.timestamp || 'Just now'}</p>
            </div>
            <Badge status="processing" text={<strong style={{ color: '#00009c' }}>{searchedOrder.status}</strong>} />
          </div>

          {/* STEP PROGRESS */}
          <Steps
            current={getStepStatusIndex(searchedOrder.status)}
            items={[
              {
                title: 'Order Placed',
                icon: <SolutionOutlined />,
              },
              {
                title: 'Baking',
                icon: <LoadingOutlined />,
              },
              {
                title: 'Dispatched',
                icon: <CarOutlined />,
              },
              {
                title: 'Delivered',
                icon: <SmileOutlined />,
              },
            ]}
          />

          <Card type="inner" title="Order details" style={{ marginTop: 24 }}>
            <p><strong>Customer:</strong> {searchedOrder.customerName}</p>
            <p><strong>Box Size:</strong> {searchedOrder.boxSize}</p>
            <p><strong>Cookies Selected:</strong> {searchedOrder.contents}</p>
            <p style={{ margin: 0 }}><strong>Total Paid:</strong> Rs. {searchedOrder.totalPrice}</p>
          </Card>
        </Card>
      ) : (
        <Result
          status="info"
          title="No Live Tracking Session"
          subTitle="Place an order to watch its preparation. The kitchen is standing by!"
        />
      )}
    </div>
  );
};

export default trackOrder;